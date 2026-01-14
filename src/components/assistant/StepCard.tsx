'use client';

import { ArrowDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatCost, formatTime, getToolIcon } from '@/lib/assistant-utils';
import type { StepCard as StepCardType } from '@/types/assistant';

interface StepCardProps {
  step: StepCardType;
  isLast: boolean;
}

export const StepCard = ({ step, isLast }: StepCardProps) => {
  const Icon = getToolIcon(step.toolName);

  return (
    <div className="space-y-2">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {step.name}
              </h4>
              {step.frontendLink && (
                <Link 
                  href={step.frontendLink}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  title="Go to tool"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span className="font-medium">Why:</span> {step.why}
            </p>
            {step.limitation && (
              <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>
                  <span className="font-medium">Limitation:</span>{' '}
                  {step.limitation}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatTime(step.estimatedTime)}
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatCost(step.cost)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {!isLast && (
        <div className="flex justify-center">
          <ArrowDown className="w-4 h-4 text-gray-400 dark:text-gray-600" />
        </div>
      )}
    </div>
  );
};
