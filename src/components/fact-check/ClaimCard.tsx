/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
'use client';

import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Loader2,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Claim } from '@/types/fact-check';

interface ClaimCardProps {
  claim: Claim;
  onViewDetails: (claimId: string) => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return {
        icon: CheckCircle2,
        label: 'Completed',
        color: 'bg-green-100 text-green-800 border-green-300',
      };
    case 'no_verdict':
      return {
        icon: HelpCircle,
        label: 'No Verdict',
        color: 'bg-gray-100 text-gray-700 border-gray-300',
      };
    case 'failed':
      return {
        icon: XCircle,
        label: 'Failed',
        color: 'bg-red-100 text-red-800 border-red-300',
      };
    case 'processing':
    case 'pending':
      return {
        icon: Loader2,
        label: 'Processing',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
      };
    default:
      return {
        icon: HelpCircle,
        label: 'Unknown',
        color: 'bg-gray-100 text-gray-800 border-gray-300',
      };
  }
};

const getRatingColor = (rating: string) => {
  const lower = rating.toLowerCase();
  if (lower.includes('false')) return 'bg-red-100 text-red-800';
  if (lower.includes('true')) return 'bg-green-100 text-green-800';
  if (lower.includes('mixed') || lower.includes('mostly'))
    return 'bg-amber-100 text-amber-800';
  return 'bg-gray-100 text-gray-800';
};

export const ClaimCard = ({ claim, onViewDetails }: ClaimCardProps) => {
  // Handle processing/pending state
  if (claim.status === 'processing' || claim.status === 'pending') {
    return (
      <div className="border border-blue-100 rounded-xl bg-white p-6 shadow-sm animate-pulse">
        <div className="flex items-start gap-3">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin mt-1" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-20 bg-blue-50 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
        </div>
        <div className="mt-4 text-xs text-blue-600 font-medium flex items-center gap-2">
          <Search className="w-3 h-3" />
          Analyzing claim and verifying with trusted sources...
        </div>
      </div>
    );
  }

  // Handle failed state
  if (claim.status === 'failed') {
    return (
      <div className="border border-red-200 rounded-xl bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
          <div>
            <p className="font-medium text-red-900">Analysis Failed</p>
            <p className="text-sm text-red-700 mt-1">
              We couldn't verify this claim. {claim.text}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(claim.status);
  const StatusIcon = statusConfig.icon;
  const verdicts = claim.verdicts || [];

  return (
    <div className="border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all bg-white overflow-hidden">
      {/* Main Content */}
      <div className="p-5 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-gray-900 leading-relaxed">
                {claim.text}
              </p>
              {claim.context && (
                <p className="text-sm text-gray-600 mt-2 italic">
                  Context: {claim.context}
                </p>
              )}
            </div>
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.color} whitespace-nowrap flex items-center gap-1.5`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig.label}
            </div>
          </div>
        </div>

        {/* No Verdict State */}
        {claim.status === 'no_verdict' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  No fact-checks found
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  This claim has not been fact-checked by any known sources yet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Verdicts Preview */}
        {verdicts.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
                <ExternalLink className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">
                  {verdicts.length} Fact-Check Source
                  {verdicts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-50 border border-green-200 rounded-full">
                <ShieldCheck className="w-3 h-3 text-green-600" />
                <span className="text-[10px] font-semibold text-green-700">
                  IFCN Certified
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {verdicts.slice(0, 3).map((verdict, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-semibold text-sm text-blue-900">
                      {verdict.source}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${getRatingColor(verdict.rating)}`}
                    >
                      {verdict.rating || verdict.textual_rating}
                    </span>
                  </div>
                  {verdict.reviewed_at && (
                    <p className="text-xs text-gray-500 mb-2">
                      Reviewed:{' '}
                      {new Date(verdict.reviewed_at).toLocaleDateString()}
                    </p>
                  )}
                  {verdict.review_url && (
                    <a
                      href={verdict.review_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Read Full Report
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
            {verdicts.length > 3 && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                +{verdicts.length - 3} more report
                {verdicts.length - 3 !== 1 ? 's' : ''} available in full view
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xs text-gray-500 font-mono">
            ID: {claim.claim_id}
          </span>
          <Button
            onClick={() => onViewDetails(claim.claim_id)}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            size="sm"
          >
            View Full Fact-Check Report
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
