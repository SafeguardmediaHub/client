"use client";

import { FileQuestion } from "lucide-react";
import type { Claim } from "@/types/fact-check";
import { ClaimCard } from "./ClaimCard";
import { EmptyState } from "./EmptyState";

interface ClaimListProps {
  claims: Claim[];
  onViewDetails: (claimId: string) => void;
}

export const ClaimList = ({ claims, onViewDetails }: ClaimListProps) => {
  if (claims.length === 0) {
    return (
      <EmptyState
        title="No Claims Found"
        message="No verifiable claims were detected in the provided content. Try submitting text with specific factual statements, statistics, or assertions that can be fact-checked."
        icon={<FileQuestion className="w-12 h-12 text-gray-400 mb-4" />}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Extracted Claims ({claims.length})
        </h3>
        <p className="text-sm text-gray-600">
          Click on any claim to view detailed fact-check results
        </p>
      </div>

      <div className="grid gap-4">
        {claims.map((claim) => (
          <ClaimCard
            key={claim.claim_id}
            claim={claim}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};
