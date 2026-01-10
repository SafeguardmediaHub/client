'use client';

import { format } from 'date-fns';

interface UserMessageProps {
  content: string;
  timestamp: Date;
}

export const UserMessage = ({ content, timestamp }: UserMessageProps) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[80%]">
        <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5">
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {format(timestamp, 'HH:mm')}
        </p>
      </div>
    </div>
  );
};
