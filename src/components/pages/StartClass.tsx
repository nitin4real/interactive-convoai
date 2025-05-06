import React from 'react';
import { AgentGlobe } from '../sections/AgentGlobe';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useRTCStore } from '../../store/rtc.store';
import useClassStore from '../../store/class.store';
import { EAgentRunningStatus } from '../../types/agent';

export default function StartClass() {
  const navigate = useNavigate();
  const setAgentRunningStatus = useRTCStore((state) => state.setAgentRunningStatus);
  const setIsJoined = useClassStore((state) => state.setIsJoined);

  const handleStartClass = () => {
    // Update UI states
    setAgentRunningStatus(EAgentRunningStatus.LISTENING);
    setIsJoined(true);
    
    // Navigate to the main class view
    navigate('/class');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-8 p-4">
      <div className="w-full max-w-2xl aspect-square">
        <AgentGlobe />
      </div>
      <Button
        onClick={handleStartClass}
        className="px-12 py-8 text-xl font-semibold rounded-2xl bg-gradient-to-r from-[#00c2ff] via-[#a0faff] to-[#fcf9f8] text-gray-800 hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Start Class
      </Button>
    </div>
  );
} 