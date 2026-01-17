import type { KeyFinding } from '@/types/explanation';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface KeyFindingsProps {
  findings: KeyFinding[];
  className?: string;
}

export function KeyFindings({ findings, className = '' }: KeyFindingsProps) {
  if (!findings || findings.length === 0) return null;

  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {findings.map((finding, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Static list
          key={index}
          className={`
            flex items-start gap-3 rounded-lg border p-3 text-sm
            ${
              finding.importance === 'critical'
                ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300'
                : finding.importance === 'high'
                  ? 'border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-900/50 dark:bg-orange-950/20 dark:text-orange-300'
                  : finding.importance === 'medium'
                    ? 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-900/50 dark:bg-yellow-950/20 dark:text-yellow-300'
                    : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-300'
            }
          `}
        >
          <div className="shrink-0 pt-0.5">
            {finding.importance === 'critical' && (
              <XCircle className="h-5 w-5" />
            )}
            {finding.importance === 'high' && (
              <AlertCircle className="h-5 w-5" />
            )}
            {finding.importance === 'medium' && <Info className="h-5 w-5" />}
            {finding.importance === 'low' && (
              <CheckCircle className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="font-medium leading-tight mb-1">{finding.finding}</p>
            <span className="inline-flex rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium dark:bg-white/10 uppercase tracking-wider opacity-80">
              {finding.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
