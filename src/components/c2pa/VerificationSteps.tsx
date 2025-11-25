'use client';

import {
  Bot,
  Check,
  FileSearch,
  KeyRound,
  Loader2,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VerificationStreamUpdate } from '@/types/c2pa';

interface Step {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VERIFICATION_STEPS: Step[] = [
  { id: 'manifest', label: 'Manifest detected', icon: FileSearch },
  { id: 'signature', label: 'Signature verification', icon: KeyRound },
  { id: 'certificate', label: 'Certificate chain validation', icon: Shield },
  { id: 'integrity', label: 'Integrity checks', icon: ShieldCheck },
  { id: 'ai_markers', label: 'AI-marker detection', icon: Bot },
];

type StepStatus = 'pending' | 'processing' | 'completed' | 'error';

interface VerificationStepsProps {
  updates?: VerificationStreamUpdate[];
  currentStep?: string;
  className?: string;
}

function getStepStatus(
  stepId: string,
  updates: VerificationStreamUpdate[],
  currentStep?: string
): StepStatus {
  const stepUpdate = updates.find((u) => u.step === stepId);
  if (stepUpdate) {
    return stepUpdate.status;
  }

  // If no update for this step yet
  const stepIndex = VERIFICATION_STEPS.findIndex((s) => s.id === stepId);
  const currentIndex = currentStep
    ? VERIFICATION_STEPS.findIndex((s) => s.id === currentStep)
    : -1;

  if (stepIndex < currentIndex) {
    return 'completed';
  } else if (stepIndex === currentIndex) {
    return 'processing';
  }

  return 'pending';
}

export function VerificationSteps({
  updates = [],
  currentStep,
  className,
}: VerificationStepsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {VERIFICATION_STEPS.map((step, index) => {
        const status = getStepStatus(step.id, updates, currentStep);
        const Icon = step.icon;

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border transition-all duration-300',
              status === 'completed' && 'bg-emerald-50 border-emerald-200',
              status === 'processing' && 'bg-blue-50 border-blue-200',
              status === 'error' && 'bg-red-50 border-red-200',
              status === 'pending' && 'bg-gray-50 border-gray-200 opacity-60'
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {/* Status indicator */}
            <div
              className={cn(
                'flex items-center justify-center size-8 rounded-full transition-colors',
                status === 'completed' && 'bg-emerald-500',
                status === 'processing' && 'bg-blue-500',
                status === 'error' && 'bg-red-500',
                status === 'pending' && 'bg-gray-300'
              )}
            >
              {status === 'completed' ? (
                <Check className="size-4 text-white" />
              ) : status === 'processing' ? (
                <Loader2 className="size-4 text-white animate-spin" />
              ) : (
                <span className="size-2 rounded-full bg-white/60" />
              )}
            </div>

            {/* Step icon and label */}
            <div className="flex-1 flex items-center gap-2">
              <Icon
                className={cn(
                  'size-4',
                  status === 'completed' && 'text-emerald-600',
                  status === 'processing' && 'text-blue-600',
                  status === 'error' && 'text-red-600',
                  status === 'pending' && 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  status === 'completed' && 'text-emerald-700',
                  status === 'processing' && 'text-blue-700',
                  status === 'error' && 'text-red-700',
                  status === 'pending' && 'text-gray-500'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Status text */}
            <span
              className={cn(
                'text-xs font-medium',
                status === 'completed' && 'text-emerald-600',
                status === 'processing' && 'text-blue-600',
                status === 'error' && 'text-red-600',
                status === 'pending' && 'text-gray-400'
              )}
            >
              {status === 'completed' && 'Done'}
              {status === 'processing' && 'Active'}
              {status === 'error' && 'Failed'}
              {status === 'pending' && 'Waiting'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function VerificationStepsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 border-gray-200 animate-pulse"
        >
          <div className="size-8 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-1">
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
