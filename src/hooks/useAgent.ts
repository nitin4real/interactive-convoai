import { useEffect, useRef, useState, useCallback } from 'react';
import { agoraService, RemoteUser, StartAgentResponse } from '../services/agora.service';

import { logger } from '@/utils/logger';
import { IMessage } from '@/types/agent';
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
interface Question {
  id: string;
  question: string;
  options: string[];
}

export const useAgent = () => {
  const [agentState, setAgentState] = useState<StartAgentResponse | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentStarted, setIsAgentStarted] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [transcriptions, setTranscriptions] = useState<IMessage[]>([]);
  const [contentImage, setContentImage] = useState<string | undefined>();
  const isInitializedRef = useRef(false);
  const convoAgentId = useRef<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const handleNewQuestion = useCallback((data: Question) => {
    logger.info('useAgent', `Received new question: ${data.question}`);
    setCurrentQuestion(data);
  }, []);



  const startAgent = useCallback(async () => {
    setLoading(true);
    logger.info('useAgent', 'Starting agent');
    try {
      const startAgentResponse = await agoraService.startAgent();
      if (startAgentResponse) {
        setAgentState(startAgentResponse);
        setIsAgentStarted(true);
        // join the channel
        logger.info('useAgent', `Joining channel ${JSON.stringify(startAgentResponse)}`);
        await agoraService.joinChannel({
          appId: startAgentResponse.data.appId,
          channelName: startAgentResponse.data.channelName,
          token: startAgentResponse.data.rtcToken,
          uid: startAgentResponse.data.uid,
          rtmToken: startAgentResponse.data.rtmToken
        });
        convoAgentId.current = startAgentResponse.data.agentResponse.agent_id;
        setIsJoined(true);
        setLoading(false);
        startHeartbeat();

        logger.info('useAgent', 'Initialization completed successfully');
      } else {
        setError('Failed to initialize agent');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Failed to initialize agent:', error);
      if (error?.response?.status === 440) {
        handleTimeout();
      } else {
        setError(error?.response?.data?.error || 'Failed to initialize agent');
      }
      setLoading(false);
    }
  }, [handleNewQuestion]);

  // Clean up socket connection on unmount
  useEffect(() => {
    return () => {
      isInitializedRef.current = false;
      leaveChannel();
    };
  }, []);


  useEffect(() => {
    agoraService.setCallbacks({
      onUserJoined: (user) => {
        console.log('User joined:', user);
        setRemoteUsers(prev => [...prev, user]);
      },
      onUserLeft: (uid) => {
        console.log('User left:', uid);
        setRemoteUsers(prev => prev.filter(user => user.uid !== uid));
      },
      onMessage: (message) => {
        if(!message) return
        if (message.type === 'user.transcription' || message.type === 'assistant.transcription') {
          setTranscriptions(prev => {
            if (prev.length > 0) {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage.turn_id === message.turn_id && lastMessage.type === message.type) {
                // compare the last message with the new message
                if (lastMessage.text === message.text) {
                  return prev;
                }
                return [...prev.slice(0, -1), message];
              } else {
                // check if the new message is the same as the last message
                if (lastMessage.text === message.text) {
                  return prev;
                }
                return [...prev, message];
              }
            }
            return [...prev, message];
          });
        } else if (message.type === 'question' && message.questionData) {
          setCurrentQuestion({
            id: 'message.questionData.id',
            question: message.questionData.questionDescription,
            options: message.questionData.options
          });
        } else if (message.type === 'concept_image' && message.imageData) {
          setContentImage(message.imageData.imageUrl);
        }
      }

    });
  }, []);

  const handleAnswerSubmit = (answer: string) => {
    console.log('handleAnswerSubmit', answer);
  };

  const sendHeartbeat = async () => {
    if (!convoAgentId.current) return;

    try {
      const response = await axios.post<{ status: string; secondsRemaining: number }>(
        `${API_CONFIG.ENDPOINTS.AGENT.HEARTBEAT}/${convoAgentId.current}`,
        {}
      );
      logger.info('useAgent', 'Heartbeat sent');
      setRemainingTime(response.data.secondsRemaining);
    } catch (error: any) {
      console.error('Failed to send heartbeat', error);
      // stop services and leave channel
      setAgentState(null);
      setIsAgentStarted(false);
      leaveChannel();
    }
  };

  const startHeartbeat = () => {
    logger.info('useAgent', 'Starting heartbeat');
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    sendHeartbeat();
    heartbeatIntervalRef.current = setInterval(sendHeartbeat, 5000);
    logger.info('useAgent', 'Heartbeat started');

    // Update timer every second
    timerIntervalRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
  };

  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const stopAgent = async () => {
    if (!agentState) return;

    try {
      await agoraService.stopAgent(agentState?.data?.agentResponse?.agent_id);
      setIsAgentStarted(false);
      setAgentState(null);
      stopHeartbeat();
    } catch (error) {
      console.error('Failed to stop agent:', error);
      setError('Failed to stop agent');
    }
  };

  const leaveChannel = async () => {
    await agoraService.leaveChannel();
    setIsJoined(false);
    setIsAgentStarted(false);
    setRemoteUsers([]);
    setAgentState(null);
  };

  const toggleMute = () => {
    agoraService.toggleAudio(isMuted);
    setIsMuted(!isMuted);
  };

  const handleTimeout = () => {
    console.log('Session expired, stopping heartbeat');
    leaveChannel();
    setIsAgentStarted(false);
    setAgentState(null);
  };

  return {
    channelInfo: agentState,
    isJoined,
    isMuted,
    isAgentStarted,
    remoteUsers,
    loading,
    error,
    selectedLanguage,
    setSelectedLanguage,
    currentQuestion,
    transcriptions,
    contentImage,
    stopAgent,
    leaveChannel,
    toggleMute,
    startAgent,
    handleAnswerSubmit
  };
}; 