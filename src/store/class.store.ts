import { create } from 'zustand';
import { AgentTile } from '../config/agents.config';

interface TranscriptionMessage {
  text: string;
  type: 'agent' | 'user' | 'question' | 'answer';
}


interface RemoteUser {
  uid: number;
  name: string;
  avatar: string;
}

interface ClassStoreState {
  agentDetails: AgentTile | null;
  isAgentStarted: boolean;
  isJoined: boolean;
  isMuted: boolean;
  remoteUsers: RemoteUser[];
  currentQuestion: { id: string; question: string; options: string[] } | null;
  transcriptions: TranscriptionMessage[];
}

interface ClassStoreActions {
  setAgentDetails: (details: AgentTile) => void;
  setIsAgentStarted: (started: boolean) => void;
  setIsJoined: (joined: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setRemoteUsers: (users: RemoteUser[]) => void;
  setCurrentQuestion: (question: { id: string; question: string; options: string[] } | null) => void;
  addTranscription: (text: string, type?: TranscriptionMessage['type']) => void;
}

const useClassStore = create<ClassStoreState & ClassStoreActions>((set) => ({
  agentDetails: null,
  isAgentStarted: false,
  isJoined: false,
  isMuted: false,
  remoteUsers: [],
  currentQuestion: null,
  transcriptions: [],
  setAgentDetails: (details) => set({ agentDetails: details }),
  setIsAgentStarted: (started) => set({ isAgentStarted: started }),
  setIsJoined: (joined) => set({ isJoined: joined }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setRemoteUsers: (users) => set({ remoteUsers: users }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  addTranscription: (text, type = 'user') => 
    set((state) => ({
      transcriptions: [...state.transcriptions, { text, type }]
    }))
}));

export default useClassStore; 