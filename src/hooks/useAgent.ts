import { useEffect, useRef, useState, useCallback } from 'react';
import { agoraService, RemoteUser, StartAgentResponse } from '../services/agora.service';

import { logger } from '@/utils/logger';
import { IMessage } from '@/types/agent';
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
        setIsJoined(true);
        setLoading(false);
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

  const stopAgent = async () => {
    if (!agentState) return;

    try {
      await agoraService.stopAgent();
      setIsAgentStarted(false);
      setAgentState(null);
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