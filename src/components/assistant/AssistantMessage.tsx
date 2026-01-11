'use client';

import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface AssistantMessageProps {
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export const AssistantMessage = ({
  content,
  timestamp,
  isStreaming,
}: AssistantMessageProps) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <div className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
          <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none [&>p]:mb-3 [&>p:last-child]:mb-0">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
              }}
            >
              {content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-indigo-500 animate-pulse" />
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {format(timestamp, 'HH:mm')}
        </p>
      </div>
    </div>
  );
};
