"use client";

import {
  CheckCircle2,
  FileQuestion,
  Layers,
  Scale,
  XCircle,
} from "lucide-react";
import type { Claim } from "@/types/fact-check";
import { ClaimCard } from "./ClaimCard";
import { EmptyState } from "./EmptyState";

interface ClaimListProps {
  claims: Claim[];
  onViewDetails: (claimId: string) => void;
  summary?: {
    total_claims: number;
    verified_false: number;
    verified_true: number;
    mixed: number;
  };
}

export const ClaimList = ({
  claims,
  onViewDetails,
  summary,
}: ClaimListProps) => {
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
    <div className="space-y-6">
      {/* Summary Statistics */}
      {summary && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Analysis Summary
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-900">
                  Total Claims
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {summary.total_claims}
              </p>
            </div>

            <div className="bg-white border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-900">
                  Verified True
                </span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {summary.verified_true}
              </p>
            </div>

            <div className="bg-white border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-900">
                  Verified False
                </span>
              </div>
              <p className="text-2xl font-bold text-red-900">
                {summary.verified_false}
              </p>
            </div>

            <div className="bg-white border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-900">
                  Mixed Verdict
                </span>
              </div>
              <p className="text-2xl font-bold text-orange-900">
                {summary.mixed}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Claims Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Detailed Claim Analysis ({claims.length})
        </h3>
        <p className="text-sm text-gray-600">
          Click on any claim to view the full fact-check report
        </p>
      </div>

      {/* Claims Grid */}
      <div className="grid gap-6">
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
