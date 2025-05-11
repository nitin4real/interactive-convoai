import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { MessageSquare } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface QuestionsSectionProps {
  currentQuestion: Question | null;
  onAnswerSubmit: (answer: string) => void;
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  currentQuestion,
  onAnswerSubmit
}) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);

  if (!currentQuestion) {
    return (
      <Card className="col-span-1 row-span-1 shadow-lg h-full flex flex-col">
        <CardHeader className="border-b bg-gradient-to-r from-[#00c2ff] via-[#a0faff] to-[#fcf9f8] pt-0 text-center">
          <CardTitle className="text-2xl">Question Pad</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col items-center justify-center text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Question</h3>
          <p className="text-gray-500">
            Questions will appear here when the teacher asks them.
            <br />
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 row-span-1 shadow-lg h-full flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-[#00c2ff] via-[#a0faff] to-[#fcf9f8] pt-0">
        <CardTitle className="text-2xl">Current Question</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex-1 overflow-y-auto">
        <div className="space-y-6">
          <p className="text-lg text-gray-800 font-medium">{currentQuestion.question}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`w-full justify-start text-left h-auto py-3 px-4 rounded-lg transition-all duration-200
                  ${selectedAnswer === option 
                    ? '!bg-[#2B579A] !text-white !border-[#2B579A] hover:!bg-[#1E3F7A]' 
                    : '!bg-white !text-gray-700 !border-gray-200 hover:!bg-gray-50 hover:!border-[#2B579A]'}`}
                onClick={() => setSelectedAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          <Button
            variant="default"
            className="w-full !bg-[#2B579A] !text-white hover:!bg-[#1E3F7A] h-12 rounded-lg font-medium"
            disabled={!selectedAnswer}
            onClick={() => selectedAnswer && onAnswerSubmit(selectedAnswer)}
          >
            Submit Answer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionsSection; 