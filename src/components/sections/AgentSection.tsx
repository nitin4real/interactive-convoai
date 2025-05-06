import React from 'react';
import { Card, CardContent } from '../ui/card';
import { AgentGlobe } from './AgentGlobe';

interface AgentSectionProps {
  agentDetails: any | null;
  isAgentStarted: boolean;
  onStartAgent: () => void;
  onStopAgent: () => void;
}

const AgentSection: React.FC<AgentSectionProps> = () => {
  return (
    <Card className="col-span-1 row-span-1 shadow-lg h-full flex flex-col">
      <CardContent className="p-0 flex-1">
        <AgentGlobe />
      </CardContent>
    </Card>
  );
};

export default AgentSection; 