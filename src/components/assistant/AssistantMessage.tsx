'use client';

import { format } from 'date-fns';

interface AssistantMessageProps {
  content: string;
  timestamp: Date;
}

export const AssistantMessage = ({
  content,
  timestamp,
}: AssistantMessageProps) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <div className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {format(timestamp, 'HH:mm')}
        </p>
      </div>
    </div>
  );
};
