import { useEffect, useRef, useState, useCallback } from 'react';

import { Socket, io } from 'socket.io-client';
import { API_CONFIG } from '../config/api.config';
import axios from '../config/axios.config';
import { agoraService, RemoteUser, StartAgentResponse } from '../services/agora.service';

import { logger } from '@/utils/logger';
interface Question {
  id: string;
  question: string;
  options: string[];
}

interface Transcript {
  isAgent: boolean;
  transcript: string;
}

interface TranscriptionMessage {
  text: string;
  type: 'agent' | 'user' | 'question' | 'answer';
}

export const useAgent = () => {
  const [agentState, setAgentState] = useState<StartAgentResponse | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentStarted, setIsAgentStarted] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [transcriptions, setTranscriptions] = useState<TranscriptionMessage[]>([]);
  const [contentImage, setContentImage] = useState<string | undefined>();
  const isInitializedRef = useRef(false);

  const handleNewQuestion = useCallback((data: Question) => {
    logger.info('useAgent', `Received new question: ${data.question}`);
    setCurrentQuestion(data);
    // Add to transcriptions for history
    setTranscriptions(prev => [...prev, { text: data.question, type: 'question' }]);
  }, []);

  const handleTranscript = useCallback((data: Transcript) => {
    // handle overlapping transcriptions
    setTranscriptions(prev => {
      const lastTranscript = prev[prev.length - 1];
      if (lastTranscript && lastTranscript.type === (data.isAgent ? 'agent' : 'user')) {
        prev = prev.slice(0, -1);
      }
      return [...prev, {
        text: data.transcript,
        type: data.isAgent ? 'agent' : 'user'
      }];
    });
  }, [transcriptions]);


  const startAgent = useCallback(async () => {
    setLoading(true);
    logger.info('useAgent', 'Starting agent');
    try {
      const startAgentResponse = await agoraService.startAgent();
      if (startAgentResponse) {
        setAgentState(startAgentResponse);
        setIsAgentStarted(true);

        // Initialize socket connection
        if (!socketRef.current) {
          socketRef.current = io(API_CONFIG.BASE_URL, {
            auth: {
              token: localStorage.getItem('token'),
              channelName: startAgentResponse.channelName
            },
            transports: ['websocket']
          });

          // Socket event listeners
          socketRef.current.on('connect', () => {
            logger.info('useAgent', 'Socket connected successfully');
          });
          socketRef.current.on('message', (data) => {
            logger.info('useAgent', `Socket message ${data}`);
          });
          socketRef.current.on('disconnect', () => {
            logger.info('useAgent', 'Socket disconnected');
          });

          socketRef.current.on('error', (error) => {
            logger.error('useAgent', `Socket error ${error}`);
          });

          // Listen for new questions
          socketRef.current.on('new_question', handleNewQuestion);
          socketRef.current.on('content', (data) => {
            logger.info('useAgent', `Content received ${JSON.stringify(data)}`);
            setContentImage(data.imageUrl);
          });
        }

        // join the channel
        logger.info('useAgent', `Joining channel ${JSON.stringify(startAgentResponse)}`);
        await agoraService.joinChannel({
          appId: startAgentResponse.appId,
          channelName: startAgentResponse.channelName,
          token: startAgentResponse.rtcToken,
          uid: startAgentResponse.uid,
          rtmToken: startAgentResponse.rtmToken
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
        setError('Failed to initialize agent');
      }
      setLoading(false);
    }
  }, [handleNewQuestion, handleTranscript]);

  // Clean up socket connection on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.off('new_question');
        socketRef.current.off('transcript');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
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
      onUserTranscription: (msg) => {
        handleTranscript({ transcript: msg.text, isAgent: false });
      },
      onAgentTranscription: (msg) => {
        handleTranscript({ transcript: msg.text, isAgent: true });
      }
    });
  }, []);

  const handleAnswerSubmit = (answer: string) => {
    if (!socketRef.current || !currentQuestion) return;

    socketRef.current.emit('answer_submitted', {
      answer,
      question: currentQuestion.question
    });
  };

  const stopAgent = async () => {
    if (!agentState) return;

    try {
      await axios.post(
        `${API_CONFIG.ENDPOINTS.AGENT.STOP}`,
        { channelName: agentState.channelName }
      );
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

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
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