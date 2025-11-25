'use client';

import {
  AlertTriangle,
  Bot,
  Building2,
  Calendar,
  CheckCircle,
  Download,
  Monitor,
  Shield,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { VerificationSummary } from '@/types/c2pa';
import { StatusBadge } from './StatusBadge';

interface SummaryCardProps {
  summary: VerificationSummary;
  onDownloadReport?: () => void;
  className?: string;
}

interface SummaryItemProps {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  status?: 'success' | 'warning' | 'error' | 'neutral';
}

function SummaryItem({ label, value, icon: Icon, status }: SummaryItemProps) {
  const statusColors = {
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="flex items-start gap-3 py-3">
      {Icon && (
        <div className="flex-shrink-0 mt-0.5">
          <Icon
            className={cn('size-4', status ? statusColors[status] : 'text-gray-400')}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </dt>
        <dd
          className={cn(
            'text-sm mt-0.5',
            status ? statusColors[status] : 'text-gray-900'
          )}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

function CheckItem({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      {passed ? (
        <CheckCircle className="size-4 text-emerald-500" />
      ) : (
        <XCircle className="size-4 text-red-500" />
      )}
      <span
        className={cn(
          'text-sm',
          passed ? 'text-gray-700' : 'text-red-700'
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function SummaryCard({
  summary,
  onDownloadReport,
  className,
}: SummaryCardProps) {
  return (
    <Card className={cn('animate-in fade-in slide-in-from-bottom-2', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Verification Summary</CardTitle>
          <StatusBadge status={summary.status} size="md" />
        </div>
        {summary.statusReason && (
          <p className="text-sm text-gray-500 mt-1">{summary.statusReason}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Verification checks */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Verification Checks
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <CheckItem label="Manifest found" passed={summary.manifestFound} />
            <CheckItem label="Signature valid" passed={summary.signatureValid} />
            <CheckItem
              label="Certificate chain valid"
              passed={summary.certificateChainValid}
            />
            <CheckItem label="Integrity passed" passed={summary.integrityPassed} />
          </div>
        </div>

        {/* AI Markers */}
        {summary.aiMarkersDetected && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Bot className="size-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">
                AI-generated content markers detected
              </span>
            </div>
          </div>
        )}

        {/* Creator info */}
        {summary.creator && (
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Creator Information
            </h4>
            <dl className="divide-y divide-gray-100">
              <SummaryItem
                label="Creator"
                value={summary.creator.name}
                icon={Building2}
              />
              {summary.creator.software && (
                <SummaryItem
                  label="Software"
                  value={`${summary.creator.software}${
                    summary.creator.version ? ` v${summary.creator.version}` : ''
                  }`}
                  icon={Monitor}
                />
              )}
              {summary.creator.signedAt && (
                <SummaryItem
                  label="Signed"
                  value={new Date(summary.creator.signedAt).toLocaleString()}
                  icon={Calendar}
                />
              )}
            </dl>
          </div>
        )}

        {/* Device info */}
        {summary.device && (
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Device Information
            </h4>
            <dl className="divide-y divide-gray-100">
              {summary.device.manufacturer && (
                <SummaryItem
                  label="Manufacturer"
                  value={summary.device.manufacturer}
                  icon={Building2}
                />
              )}
              {summary.device.model && (
                <SummaryItem
                  label="Model"
                  value={summary.device.model}
                  icon={Monitor}
                />
              )}
            </dl>
          </div>
        )}

        {/* Warnings */}
        {summary.warnings && summary.warnings.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              Warnings
            </h4>
            <ul className="space-y-2">
              {summary.warnings.map((warning, index) => (
                <li
                  key={index}
                  className="text-sm text-amber-700 bg-amber-50 rounded-lg p-2"
                >
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Download button */}
        {onDownloadReport && (
          <Button
            onClick={onDownloadReport}
            variant="outline"
            className="w-full mt-4"
          >
            <Download className="size-4 mr-2" />
            Download Report
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function SummaryCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('animate-pulse', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}
