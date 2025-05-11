import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface TranscriptionMessage {
  text: string;
  type: 'agent' | 'user' | 'question' | 'answer';
}

interface TranscriptionsSectionProps {
  transcriptions: TranscriptionMessage[];
}

const testTranscriptions: TranscriptionMessage[] = [
  { text: "Hello! How can I help you today?", type: "agent" },
  { text: "I have a question about mathematics", type: "user" },
  { text: "What is the quadratic formula?", type: "question" },
  { text: "The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a", type: "answer" },
  { text: "Can you explain how to use it?", type: "user" },
  { text: "Let me explain with an example: For the equation 2x² + 5x - 3 = 0, we can use the formula where a=2, b=5, and c=-3", type: "agent" }
];

const TranscriptionsSection: React.FC<TranscriptionsSectionProps> = ({ transcriptions }) => {
  // transcriptions = testTranscriptions
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcriptions]);

  const getMessageStyle = (type: TranscriptionMessage['type']) => {
    switch (type) {
      case 'agent':
        return 'bg-purple-100 text-purple-900 ml-0 mr-auto';
      case 'user':
        return 'bg-blue-100 text-blue-900 ml-auto mr-0';
      case 'question':
        return 'bg-gray-100 text-gray-900 mx-auto';
      case 'answer':
        return 'bg-green-100 text-green-900 mx-auto';
      default:
        return '';
    }
  };

  return (
    <Card className="h-full  shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-[#00c2ff] via-[#a0faff] to-[#fcf9f8] pt-0 text-center">
        <CardTitle className="text-2xl">Conversation</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-y-auto scrollbar-hide">
        {transcriptions.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-center">
              No conversation yet. Start by asking a question!
            </p>
          </div>
        ) : (
          <div className="space-y-4 scrollbar-hide">
            {transcriptions.map((message, index) => (
              <div
                key={index}
                className={`max-w-[80%] rounded-lg p-3 ${getMessageStyle(message.type)}`}
              >
                {message.text.replace(/Baiju/gi, 'Byju')}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptionsSection; 