'use client';

import { format } from 'date-fns';
import { useAssistant } from '@/context/AssistantContext';
import type { ClarifyingQuestion as ClarifyingQuestionType } from '@/types/assistant';
import { Button } from '../ui/button';

interface ClarifyingQuestionProps {
  question: ClarifyingQuestionType;
  timestamp: Date;
}

export const ClarifyingQuestion = ({
  question,
  timestamp,
}: ClarifyingQuestionProps) => {
  const { sendMessage } = useAssistant();

  const handleOptionClick = (option: string) => {
    sendMessage(option);
  };

  return (
    <div className="mb-4">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
        <p className="text-sm text-gray-900 dark:text-gray-100 mb-3">
          {question.question}
        </p>
        {question.context && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 italic">
            {question.context}
          </p>
        )}
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleOptionClick(option)}
              variant="outline"
              className="w-full justify-start text-left h-auto py-2 px-3 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700"
            >
              <span className="text-sm">{option}</span>
            </Button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {format(timestamp, 'HH:mm')}
      </p>
    </div>
  );
};
