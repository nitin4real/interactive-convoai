import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
      <CardHeader className="border-b bg-gradient-to-r from-[#00c2ff] via-[#a0faff] to-[#fcf9f8] pt-0 text-center">
        <CardTitle className="text-2xl">Teaching Assistant</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <AgentGlobe />
      </CardContent>
    </Card>
  );
};

export default AgentSection; 