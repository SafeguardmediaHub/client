'use client';

import { X, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

interface AssistantHeaderProps {
  onClose: () => void;
  onReset: () => void;
  isThinking: boolean;
}

export const AssistantHeader = ({
  onClose,
  onReset,
  isThinking,
}: AssistantHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-white/20 dark:border-slate-700/50 backdrop-blur-xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-slate-800/80 dark:to-slate-900/80">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            AI Assistant
          </h2>
          <div className="flex items-center gap-2">
            {isThinking ? (
              <span className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" />
                Thinking...
              </span>
            ) : (
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full" />
                Ready
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="h-8 w-8 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
          aria-label="New conversation"
          title="Start new conversation"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 cursor-pointer"
          aria-label="Close assistant"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
