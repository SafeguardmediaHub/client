'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useJobStatus } from '@/hooks/useFactCheck';
import { ErrorState } from './ErrorState';
import { JobProgress } from './JobProgress';

interface FactCheckProcessingProps {
  jobId: string;
}

export const FactCheckProcessing = ({ jobId }: FactCheckProcessingProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(
    'Initializing fact-check analysis...'
  );
  const { data, isLoading, error, refetch } = useJobStatus(jobId, {
    enabled: !!jobId,
  });

  useEffect(() => {
    if (!data?.data) return;

    const { progress, status } = data.data;

    if (status === 'prioritized') {
      setCurrentStep('Job queued and prioritized...');
    } else if (status === 'processing') {
      if (progress !== undefined) {
        if (progress < 20) {
          setCurrentStep('Extracting claims from content...');
        } else if (progress < 50) {
          setCurrentStep('Analyzing claim structure and entities...');
        } else if (progress < 80) {
          setCurrentStep('Querying fact-check databases...');
        } else {
          setCurrentStep('Finalizing results...');
        }
      } else {
        setCurrentStep('Processing your request...');
      }
    }
  }, [data?.data]);

  if (isLoading && !data) {
    return (
      <div className="p-6 border border-gray-200 rounded-lg bg-white">
        <JobProgress
          status="processing"
          progress={0}
          currentStep="Loading job status..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Job Status"
        message={
          error instanceof Error
            ? error.message
            : 'Unable to retrieve fact-check job status. The job may have expired or been deleted.'
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!data?.data) {
    return (
      <ErrorState
        title="Job Not Found"
        message="The requested fact-check job could not be found. It may have expired or been deleted."
      />
    );
  }

  const {
    status,
    progress,
    estimated_remaining_seconds,
    claims,
    summary,
    error: jobError,
  } = data.data;

  // Set progress to 100% when completed
  // Ensure progress is a number, not an object
  const progressValue = typeof progress === 'number' ? progress : 0;
  const displayProgress = status === 'completed' ? 100 : progressValue;

  return (
    <div className="space-y-6">
      <JobProgress
        status={status}
        progress={displayProgress}
        estimatedRemainingSeconds={estimated_remaining_seconds}
        currentStep={status === 'processing' ? currentStep : undefined}
      />

      {status === 'completed' && summary && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Analysis Complete!
          </h3>
          <p className="text-sm text-green-800 mb-4">
            Found {summary.total_claims} claim
            {summary.total_claims !== 1 ? 's' : ''} in the provided content.
          </p>
          {summary.total_claims > 0 && (
            <p className="text-sm text-gray-700 mb-4">
              Review the extracted claims below to see fact-check verdicts from
              trusted sources.
            </p>
          )}
        </div>
      )}

      {status === 'failed' && (
        <ErrorState
          title="Fact-Check Failed"
          message={
            jobError ||
            'The fact-check analysis failed to complete. This could be due to invalid content, service unavailability, or an internal error.'
          }
          onRetry={() => router.push('/dashboard/fact-check')}
          retryLabel="Start New Analysis"
        />
      )}
    </div>
  );
};
