import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface TranscriptionMessage {
  text: string;
  type: 'agent' | 'user' | 'question' | 'answer';
}

interface TranscriptionsSectionProps {
  transcriptions: TranscriptionMessage[];
}

const TranscriptionsSection: React.FC<TranscriptionsSectionProps> = ({ transcriptions }) => {
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
    <Card className="col-span-1 md:col-span-2 row-span-1 shadow-lg h-full flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-[#00c2ff] via-[#a0faff] to-[#fcf9f8] pt-0">
        <CardTitle className="text-2xl">Conversation</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {transcriptions.map((message, index) => (
            <div
              key={index}
              className={`max-w-[80%] rounded-lg p-3 ${getMessageStyle(message.type)}`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptionsSection; 