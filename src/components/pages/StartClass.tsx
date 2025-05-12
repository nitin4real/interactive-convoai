import { AgentGlobe } from '../sections/AgentGlobe';
import { Button } from '../ui/button';
import { LogIn } from 'lucide-react';

export default function StartClass({
  startAgent,
}: {
  startAgent: () => void;
}) {
  const handleStartClass = () => {
    startAgent();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-8 p-4">
      <div className="w-full max-w-2xl  " onClick={handleStartClass}
      >
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