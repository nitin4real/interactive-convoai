import { create } from 'zustand';
import { EAgentRunningStatus } from '../types/agent';

interface RTCStore {
  agentStatus: string;
  agentRunningStatus: EAgentRunningStatus;
  setAgentStatus: (status: string) => void;
  setAgentRunningStatus: (status: EAgentRunningStatus) => void;
}

type RTCStoreState = {
  agentStatus: string;
  agentRunningStatus: EAgentRunningStatus;
};

type RTCStoreActions = {
  setAgentStatus: (status: string) => void;
  setAgentRunningStatus: (status: EAgentRunningStatus) => void;
};

export const useRTCStore = create<RTCStoreState & RTCStoreActions>((set) => ({
  agentStatus: '',
  agentRunningStatus: EAgentRunningStatus.DEFAULT,
  setAgentStatus: (status: string) => set({ agentStatus: status }),
  setAgentRunningStatus: (status: EAgentRunningStatus) => set({ agentRunningStatus: status }),
})); 