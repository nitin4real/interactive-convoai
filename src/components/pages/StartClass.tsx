import React from 'react';
import { AgentGlobe } from '../sections/AgentGlobe';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useRTCStore } from '../../store/rtc.store';
import useClassStore from '../../store/class.store';
import { EAgentRunningStatus } from '../../types/agent';
import { LogIn } from 'lucide-react';

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
            variant="destructive"
            className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
        Start Class
        <LogIn className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
} 