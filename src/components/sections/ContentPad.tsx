import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ContentPadProps {
  imageUrl?: string;
  title?: string;
}

const ContentPad: React.FC<ContentPadProps> = ({ imageUrl, title = 'Content' }) => {
  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-[#00c2ff] via-[#a0faff] to-[#fcf9f8] pt-0 text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-y-auto">
        {imageUrl ? (
          <div className="h-full flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt="Content" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-md"
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-center">
              No content available yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentPad; 