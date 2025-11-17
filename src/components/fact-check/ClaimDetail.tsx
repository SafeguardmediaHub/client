"use client";

import { ArrowLeft } from "lucide-react";
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

  if (isLoading) {
    return <LoadingState message="Loading claim details..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Claim Details"
        message={
          error instanceof Error
            ? error.message
            : "Unable to retrieve claim details. The claim may not exist or may have been deleted."
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!data?.data) {
    return (
      <ErrorState
        title="Claim Not Found"
        message="The requested claim could not be found."
      />
    );
  }

  const { claim, verdicts, overall_status, confidence_score } = data.data;

  // Map verdict string to overall_status if overall_status is missing
  const getOverallStatus = () => {
    if (overall_status && overall_status !== 'no_verdict') {
      return overall_status;
    }

    // Fallback: derive from claim.verdict
    const verdictLower = claim.verdict?.toLowerCase() || '';
    if (verdictLower.includes('false')) return 'verified_false';
    if (verdictLower.includes('true')) return 'verified_true';
    if (verdictLower.includes('mixed')) return 'mixed';
    if (verdictLower.includes('unknown')) return 'no_verdict';
    return 'inconclusive';
  };

  const displayStatus = getOverallStatus();
  const displayReliability = typeof claim.reliability_index === 'number'
    ? claim.reliability_index
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Claims
        </Button>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Claim Analysis
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            {claim.text}
          </p>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Confidence:</span>
            <span className="text-sm font-semibold text-gray-900">
              {claim.confidence || 'Unknown'}
            </span>
          </div>
        </div>

        {claim.context && (
          <div className="pt-4 border-t border-gray-100 mt-4">
            <span className="text-sm text-gray-600 mb-2 block">
              Context:
            </span>
            <p className="text-sm text-gray-700 italic">{claim.context}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Fact-Check Verdicts ({verdicts.length})
          </h3>
          {verdicts.length > 0 && (
            <p className="text-sm text-gray-600">
              From {verdicts.length} trusted source
              {verdicts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {verdicts.length === 0 ? (
          <EmptyState
            title="No Fact-Check Verdicts Found"
            message="No external fact-checking sources have published reviews for this claim. This doesn't mean the claim is true or false - it simply hasn't been verified by major fact-checking organizations yet."
          />
        ) : (
          <div className="grid gap-4">
            {verdicts.map((verdict, idx) => (
              <VerdictCard key={idx} verdict={verdict} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
