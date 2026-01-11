'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/types/assistant';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';
import { ThinkingIndicator } from './ThinkingIndicator';
import { WorkflowCard } from './WorkflowCard';
import { ClarifyingQuestion } from './ClarifyingQuestion';

interface ConversationViewProps {
  messages: Message[];
  isThinking: boolean;
}

export const ConversationView = ({
  messages,
  isThinking,
}: ConversationViewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      role="log"
      aria-live="polite"
      aria-atomic="false"
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-16 h-16 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to the Verification Assistant
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
            Tell me what you're trying to verify and I'll pick the right tools
            for you.
          </p>
          <div className="mt-6 space-y-2 w-full max-w-xs">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Try asking:
            </p>
            <div className="space-y-2">
              {[
                'I want to verify if an image is authentic',
                'How can I check where this photo was taken?',
                'Is there a way to detect photo manipulation?',
                'How can you help me find where a video originally came from',
              ].map((suggestion, idx) => (
                <div
                  key={idx}
                  className="text-xs text-left px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  "{suggestion}"
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {messages.map((message, index) => {
        if (message.role === 'user') {
          return (
            <UserMessage
              key={index}
              content={message.content}
              timestamp={message.timestamp}
            />
          );
        }

        if (message.type === 'text') {
          return (
            <AssistantMessage
              key={index}
              content={message.content as string}
              timestamp={message.timestamp}
            />
          );
        }

        if (message.type === 'workflow') {
          return (
            <WorkflowCard
              key={index}
              workflow={message.content as any}
              timestamp={message.timestamp}
            />
          );
        }

        if (message.type === 'question') {
          return (
            <ClarifyingQuestion
              key={index}
              question={message.content as any}
              timestamp={message.timestamp}
            />
          );
        }

        return null;
      })}

      {isThinking && <ThinkingIndicator />}
    </div>
  );
};
