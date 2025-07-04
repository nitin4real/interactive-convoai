import React, { useEffect } from 'react';
import Header from '../Header';
import AgentSection from '../sections/AgentSection';
import QuestionsSection from '../sections/QuestionsSection';
import TranscriptionsSection from '../sections/TranscriptionsSection';
import ContentPad from '../sections/ContentPad';
import useClassStore from '../../store/class.store';
import { useAgent } from '../../hooks/useAgent';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import StartClass from '../pages/StartClass';

export interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const {
    isJoined,
    isMuted,
    isAgentStarted,
    loading,
    error,
    currentQuestion,
    transcriptions,
    contentImage,
    stopAgent,
    leaveChannel,
    startAgent,
    handleAnswerSubmit
  } = useAgent();

  const {
    setIsAgentStarted,
    setIsJoined,
    setIsMuted,
    addTranscription
  } = useClassStore();

  // Update store when agent state changes
  useEffect(() => {
    setIsAgentStarted(isAgentStarted);
    setIsJoined(isJoined);
    setIsMuted(isMuted);
  }, [isAgentStarted, isJoined, isMuted, setIsAgentStarted, setIsJoined, setIsMuted]);

  // Sync transcriptions with store
  useEffect(() => {
    if (transcriptions.length > 0) {
      const lastTranscription = transcriptions[transcriptions.length - 1];
      addTranscription(lastTranscription.text, lastTranscription.type);
    }
  }, [transcriptions, addTranscription]);


  // const handleToggleMute = () => {
  //   setIsMuted(!isMuted);
  //   agoraService.toggleAudio(isMuted);
  // };

  const handleLeaveChannel = async () => {
    try {
      leaveChannel();
      stopAgent();
      setIsJoined(false);
      setIsAgentStarted(false);
      addTranscription('User left the classroom');
    } catch (error) {
      console.error('Failed to leave classroom:', error);
      addTranscription('Error leaving classroom');
    }
  };

  if (loading) {
    return <div className="min-h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate('/')}>Go Back</Button>
      </div>
    );
  }

  if(!isJoined) {
    return <StartClass startAgent={startAgent} />
  }

  return (
    <div className="min-h-screen w-full bg-background h-[100vh]">
      <Header />
      <main className="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex flex-col h-full gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <AgentSection
                isAgentStarted={isAgentStarted}
              />
            </div>
            <div className="col-span-1">
              <QuestionsSection
                currentQuestion={currentQuestion}
                onAnswerSubmit={handleAnswerSubmit}
              />
            </div>
            <div className="col-span-1">
              <ContentPad 
                imageUrl={contentImage}
                title="Content Pad"
              />
            </div>
          </div>
          
          <div className="h-[30vh]">
            <TranscriptionsSection
              transcriptions={transcriptions}
            />
          </div>
        </div>
        <div className="fixed bottom-6 right-6 flex gap-4">
          {/* <Button
            onClick={handleToggleMute}
            variant="outline"
            className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isMuted ? (
              <MicOff className="mr-2 h-5 w-5" />
            ) : (
              <Mic className="mr-2 h-5 w-5" />
            )}
            {isMuted ? 'Unmute' : 'Mute'}
          </Button> */}
          <Button
            onClick={handleLeaveChannel}
            variant="destructive"
            className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Leave Classroom
          </Button>
        </div>
      </main>
      {children}
    </div>
  );
};

export default MainLayout; 