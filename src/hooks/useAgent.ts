import { useEffect, useRef, useState, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';
import { API_CONFIG } from '../config/api.config';
import axios from '../config/axios.config';
import { AgoraChannelResponse, agoraService, RemoteUser } from '../services/agora.service';
import { AgentTile, StartAgentRequest, StartAgentResponse } from '../config/agents.config';
import { logger } from '@/utils/logger';

// Static initialization state
let isGloballyInitialized = false;
let globalInitializationPromise: Promise<void> | null = null;

interface AgentState {
  channelInfo: AgoraChannelResponse | null;
  agentId: string | null;
  convoAgentId: string | null;
}

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

export const useAgent = (agentId: string) => {
  const [agentState, setAgentState] = useState<AgentState>({
    channelInfo: null,
    agentId: null,
    convoAgentId: null
  });
  const socketRef = useRef<Socket | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentStarted, setIsAgentStarted] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [agentDetails, setAgentDetails] = useState<AgentTile | null>(null);
  const [loading, setLoading] = useState(true);
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
    logger.info('useAgent', `New transcript from ${data.isAgent ? 'agent' : 'user'}: ${data.transcript}`);
    setTranscriptions(prev => [...prev, { 
      text: data.transcript, 
      type: data.isAgent ? 'agent' : 'user' 
    }]);
  }, []);

  const initializeAgent = useCallback(async () => {
    if (isGloballyInitialized) {
      logger.info('useAgent', 'Initialization skipped: already initialized');
      return;
    }

    if (globalInitializationPromise) {
      logger.info('useAgent', 'Initialization skipped: in progress');
      return globalInitializationPromise;
    }

    logger.info('useAgent', 'Starting initialization');
    globalInitializationPromise = (async () => {
      try {
        // Get channel info
        logger.info('useAgent', 'Getting channel info');
        const info = await agoraService.getChannelInfo(agentId);
        setAgentState(prev => ({ ...prev, channelInfo: info }));

        // Join the channel
        await agoraService.joinChannel(info);
        setIsJoined(true);

        // Start the agent
        const request: StartAgentRequest = {
          channelName: info.channelName,
          languageCode: selectedLanguage || ""
        };
        const response = await axios.post<StartAgentResponse>(
          `${API_CONFIG.ENDPOINTS.AGENT.START}/${agentId}`,
          request
        );
        
        setAgentState(prev => ({ ...prev, convoAgentId: response.data.agent_id }));
        
        // Initialize socket connection
        socketRef.current = io(API_CONFIG.SOCKET_URL);
        
        // Set up socket event listeners
        socketRef.current.on('new_question', handleNewQuestion);

        socketRef.current.on('answer_confirmed', (data: { correct: boolean }) => {
          logger.info('useAgent', `Answer confirmed: ${data.correct ? 'correct' : 'incorrect'}`);
          setTranscriptions(prev => [...prev, { 
            text: `Answer ${data.correct ? 'correct' : 'incorrect'}`, 
            type: 'answer' 
          }]);
        });

        socketRef.current.on('content', (data: { imageUrl: string }) => {
          logger.info('useAgent', `Received content: ${data.imageUrl}`);
          setContentImage(data.imageUrl);
        });

        socketRef.current.on('transcript', handleTranscript);

        setIsAgentStarted(true);
        isInitializedRef.current = true;
        isGloballyInitialized = true;
        setLoading(false);
        logger.info('useAgent', 'Initialization completed successfully');
      } catch (error: any) {
        console.error('Failed to initialize agent:', error);
        if (error?.response?.status === 440) {
          handleTimeout();
        } else {
          setError('Failed to initialize agent');
        }
        setLoading(false);
        isInitializedRef.current = false;
        isGloballyInitialized = false;
      } finally {
        globalInitializationPromise = null;
      }
    })();

    return globalInitializationPromise;
  }, [agentId, selectedLanguage, handleNewQuestion, handleTranscript]);

  useEffect(() => {
    initializeAgent();

    return () => {
      // Only cleanup local state, don't reset global state
      isInitializedRef.current = false;
      leaveChannel();
    };
  }, [initializeAgent]);

  // Separate effect for handling language changes
  useEffect(() => {
    if (isInitializedRef.current && selectedLanguage && agentState.convoAgentId) {
      // Handle language change for existing session
      const updateLanguage = async () => {
        try {
          const request: StartAgentRequest = {
            channelName: agentState.channelInfo?.channelName || "",
            languageCode: selectedLanguage
          };
          await axios.post<StartAgentResponse>(
            `${API_CONFIG.ENDPOINTS.AGENT.START}/${agentId}`,
            request
          );
        } catch (error) {
          console.error('Failed to update language:', error);
          setError('Failed to update language');
        }
      };
      updateLanguage();
    }
  }, [selectedLanguage, agentId, agentState.convoAgentId]);

  useEffect(() => {
    agoraService.setCallbacks({
      onUserJoined: (user) => {
        console.log('User joined:', user);
        setRemoteUsers(prev => [...prev, user]);
      },
      onUserLeft: (uid) => {
        console.log('User left:', uid);
        setRemoteUsers(prev => prev.filter(user => user.uid !== uid));
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
    if (!agentState.convoAgentId) return;

    try {
      await axios.post(
        `${API_CONFIG.ENDPOINTS.AGENT.STOP}`,
        { convoAgentId: agentState.convoAgentId }
      );
      setIsAgentStarted(false);
      setAgentState(prev => ({ ...prev, convoAgentId: null }));
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
    setAgentState(prev => ({ ...prev, convoAgentId: null }));
    
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
    setAgentState(prev => ({ ...prev, convoAgentId: null }));
    // Reset global state on timeout
    isGloballyInitialized = false;
    globalInitializationPromise = null;
  };

  return {
    channelInfo: agentState.channelInfo,
    isJoined,
    isMuted,
    isAgentStarted,
    remoteUsers,
    agentDetails,
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
    handleAnswerSubmit
  };
}; 