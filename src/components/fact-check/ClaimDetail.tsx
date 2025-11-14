"use client";

import { ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClaimDetail } from "@/hooks/useFactCheck";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { VerdictBadge } from "./VerdictBadge";
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
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Claim Analysis
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">
              {claim.original_text}
            </p>
          </div>
          <VerdictBadge status={overall_status} size="lg" />
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Confidence:</span>
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(claim.confidence * 100)}%
            </span>
          </div>

          {claim.pattern_matched && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Pattern:</span>
              <span className="text-sm font-semibold text-gray-900 capitalize">
                {claim.pattern_matched}
              </span>
            </div>
          )}

          {confidence_score !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Overall Score:</span>
              <span className="text-sm font-semibold text-gray-900">
                {confidence_score.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {claim.entities && claim.entities.length > 0 && (
          <div className="pt-4 border-t border-gray-100 mt-4">
            <span className="text-sm text-gray-600 mb-2 block">
              Detected Entities:
            </span>
            <div className="flex flex-wrap gap-2">
              {claim.entities.map((entity) => (
                <span
                  key={entity}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200"
                >
                  {entity}
                </span>
              ))}
            </div>
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

      {overall_status === "mixed" && verdicts.length > 1 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-900 mb-1">
            Mixed Verdicts Detected
          </h4>
          <p className="text-sm text-yellow-800">
            Different fact-checking sources have reached different conclusions
            about this claim. Review all verdicts carefully and consider the
            credibility of each source when forming your own assessment.
          </p>
        </div>
      )}

      {overall_status === "inconclusive" && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            Inconclusive Results
          </h4>
          <p className="text-sm text-gray-700">
            The available fact-checks do not provide a clear verdict on this
            claim. This may indicate that the claim is nuanced,
            context-dependent, or requires further investigation.
          </p>
        </div>
      )}
    </div>
  );
};
