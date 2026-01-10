'use client';

import { Play, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatCost, formatTime } from '@/lib/assistant-utils';
import type { WorkflowRecommendation } from '@/types/assistant';
import { Button } from '../ui/button';
import { StepCard } from './StepCard';
import { executeWorkflow } from '@/lib/api/assistant';
import { useAssistant } from '@/context/AssistantContext';

interface WorkflowCardProps {
  workflow: WorkflowRecommendation;
  timestamp: Date;
}

export const WorkflowCard = ({ workflow, timestamp }: WorkflowCardProps) => {
  const { sessionId, mediaContext } = useAssistant();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunWorkflow = async () => {
    if (!sessionId || !mediaContext.mediaId) {
      toast.error('Please upload media before running a workflow');
      return;
    }

    setIsExecuting(true);
    try {
      const response = await executeWorkflow({
        session_id: sessionId,
        workflow_id: workflow.id,
        media_id: mediaContext.mediaId,
      });

      toast.success(
        `Workflow started! Estimated time: ${formatTime(response.estimated_time)}`
      );
      
      // TODO: Implement job status polling
      // For now, just show success message
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      toast.error('Failed to start workflow. Please try again.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCustomize = () => {
    toast.info('Workflow customization coming soon!');
  };

  return (
    <div className="mb-4">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {workflow.name}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
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
                Total: {formatTime(workflow.totalTime)}
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
                {formatCost(workflow.totalCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          {workflow.explanation}
        </p>

        {/* Steps */}
        <div className="space-y-2 mb-4">
          {workflow.steps
            .sort((a, b) => a.order - b.order)
            .map((step, index, array) => (
              <StepCard
                key={step.id}
                step={step}
                isLast={index === array.length - 1}
              />
            ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRunWorkflow}
            disabled={isExecuting || !mediaContext.mediaId}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            {isExecuting ? 'Starting...' : 'Run Workflow'}
          </Button>
          <Button
            onClick={handleCustomize}
            variant="outline"
            disabled={isExecuting}
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {format(timestamp, 'HH:mm')}
      </p>
    </div>
  );
};
