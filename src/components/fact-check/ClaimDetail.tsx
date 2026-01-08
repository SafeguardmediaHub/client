"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useClaimDetail } from "@/hooks/useFactCheck";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { VerdictCard } from "./VerdictCard";

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
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.error ||
        (error instanceof Error ? error.message : 'Unable to retrieve claim');
      toast.error('Failed to load claim details', {
        description: errorMessage,
      });
    }
  }, [error]);

  if (isLoading) {
    return <LoadingState message="Loading claim investigation..." />;
  }

  if (error || !data?.data) {
    return (
      <ErrorState
        title="Claim Analysis Not Found"
        message="Unable to retrieve the requested fact-check report. The ID might be invalid or the report is still regenerating."
        onRetry={() => refetch()}
      />
    );
  }

  const { claim, verdicts, score } = data.data;

  // Fallbacks if score object is missing (backward compatibility)
  const verdictStatus = score?.verdict || claim.verdict || 'Unknown';
  const confidenceLevel = score?.confidence || claim.confidence || 'Low';
  const credibilityScore = score?.credibility_score ?? claim.credibility_score ?? 0;
  const agreementRate = score?.consensus?.agreement_rate ?? 0;
  const totalSources = score?.breakdown?.total_sources ?? verdicts.length;
  const reliableSources = score?.breakdown?.ifcn_certified ?? 0;

  const getVerdictBadgeStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('true') || s.includes('correct')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (s.includes('false') || s.includes('incorrect')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (s.includes('mixed')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

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
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase border ${getVerdictBadgeStyle(verdictStatus)}`}>
                {verdictStatus}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                {confidenceLevel} Confidence
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
                   <span className="font-semibold text-gray-900 not-italic mr-2">Context:</span>
                   {claim.context}
                 </p>
               </div>
            )}
          </div>
        </div>

        {/* Key Metrics Bar */}
        <div className="bg-gray-50 border-t border-gray-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Credibility Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {Math.round(credibilityScore * 100)}%
              </span>
              <span className="text-xs text-gray-500">trust rating</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Consensus
            </p>
             <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {Math.round(agreementRate * 100)}%
              </span>
              <span className="text-xs text-gray-500">agreement</span>
            </div>
          </div>

           <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Sources Analyzed
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {totalSources}
              </span>
              <span className="text-xs text-gray-500">total reports</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Reliable Sources
            </p>
             <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-green-700">
                {reliableSources}
              </span>
              <span className="text-xs text-gray-500">IFCN certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Consensus Interpretation */}
      {score?.consensus?.interpretation && (
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-900">
          <div className="p-2 bg-white/50 rounded-full">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm font-medium">
            <span className="font-bold mr-1">Consensus Analysis:</span> 
            {score.consensus.interpretation}
          </p>
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
            message="No external fact-checking organizations have published reports for this specific claim yet."
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
