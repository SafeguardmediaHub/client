/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
'use client';

import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useClaimDetail } from '@/hooks/useFactCheck';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';
import { VerdictCard } from './VerdictCard';

interface ClaimDetailProps {
  claimId: string;
  onBack: () => void;
}

export const ClaimDetail = ({ claimId, onBack }: ClaimDetailProps) => {
  const { data, isLoading, error, refetch } = useClaimDetail(claimId);
  const hasShownErrorToast = useRef(false);

  useEffect(() => {
    if (error && !hasShownErrorToast.current) {
      hasShownErrorToast.current = true;

      // Handle 403 Forbidden specifically
      const statusCode = (error as any)?.response?.status;
      const errorMessage =
        statusCode === 403
          ? 'You do not have permission to view this claim.'
          : (error as any)?.response?.data?.message ||
            (error as any)?.response?.data?.error ||
            (error instanceof Error
              ? error.message
              : 'Unable to retrieve claim');
      toast.error('Failed to load claim details', {
        description: errorMessage,
      });
    }
  }, [error]);

  if (isLoading) {
    return <LoadingState message="Loading claim investigation..." />;
  }

  if (error || !data?.data) {
    const statusCode = (error as any)?.response?.status;
    return (
      <ErrorState
        title={
          statusCode === 403 ? 'Access Denied' : 'Claim Analysis Not Found'
        }
        message={
          statusCode === 403
            ? 'You do not have permission to view this claim. You can only access claims for your own media.'
            : 'Unable to retrieve the requested fact-check report. The ID might be invalid or the report is still regenerating.'
        }
        onRetry={statusCode === 403 ? undefined : () => refetch()}
      />
    );
  }

  const { claim, verdicts } = data.data;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle2,
          label: 'Fact-Checked',
          style: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'no_verdict':
        return {
          icon: HelpCircle,
          label: 'No Verdict',
          style: 'bg-gray-100 text-gray-700 border-gray-200',
        };
      case 'failed':
        return {
          icon: XCircle,
          label: 'Failed',
          style: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      default:
        return {
          icon: HelpCircle,
          label: status || 'Unknown',
          style: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const statusBadge = getStatusBadge(claim.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Navigation */}
      <div className="mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="pl-0 text-gray-500 hover:text-gray-900 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase border flex items-center gap-2 ${statusBadge.style}`}
              >
                <StatusIcon className="w-4 h-4" />
                {statusBadge.label}
              </span>
              <span className="text-xs text-gray-400 font-mono ml-auto">
                ID: {claim.claim_id.slice(-8)}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 leading-tight">
              &ldquo;{claim.text}&rdquo;
            </h1>

            {claim.context && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-600 italic">
                  <span className="font-semibold text-gray-900 not-italic mr-2">
                    Context:
                  </span>
                  {claim.context}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Bar */}
        <div className="bg-gray-50 border-t border-gray-100 p-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Status
            </p>
            <span className="text-lg font-bold text-gray-900 capitalize">
              {claim.status === 'no_verdict' ? 'No Verdict' : claim.status}
            </span>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Sources Found
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {verdicts.length}
              </span>
              <span className="text-xs text-gray-500">fact-check reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* IFCN Trust Banner */}
      {verdicts.length > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-start gap-3">
          <div className="p-2 bg-white/70 rounded-full border border-green-200 flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-900">
              IFCN Certified Sources
            </p>
            <p className="text-xs text-green-700 mt-0.5 leading-relaxed">
              All results are sourced from fact-checking organizations certified
              by the International Fact-Checking Network (IFCN), accessed via
              the Google Fact Check API.
            </p>
          </div>
        </div>
      )}

      {/* Verdicts List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            Independent Verification Reports
            <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {verdicts.length}
            </span>
          </h3>
        </div>

        {verdicts.length === 0 ? (
          <EmptyState
            title="No Verified Reports Found"
            message={
              claim.status === 'no_verdict'
                ? 'This claim has not been fact-checked by any known sources yet.'
                : 'No external fact-checking organizations have published reports for this specific claim yet.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verdicts.map((verdict, idx) => (
              <div key={idx} className="h-full">
                <VerdictCard verdict={verdict} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
