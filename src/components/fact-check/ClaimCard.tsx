"use client";

import { ChevronRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Claim } from "@/types/fact-check";

interface ClaimCardProps {
  claim: Claim;
  onViewDetails: (claimId: string) => void;
}

export const ClaimCard = ({ claim, onViewDetails }: ClaimCardProps) => {
  // Map backend confidence string to number for color coding
  const getConfidenceScore = (confidence: string): number => {
    const confidenceLower = confidence.toLowerCase();
    if (confidenceLower === "high") return 0.8;
    if (confidenceLower === "medium") return 0.5;
    return 0.3; // low
  };

  const confidenceScore = getConfidenceScore(claim.confidence);

  const getConfidenceColor = (score: number) => {
    if (score >= 0.7) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 0.4)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all bg-white">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <p className="text-base text-gray-900 leading-relaxed">
            {claim.text}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceColor(confidenceScore)}`}
        >
          {claim.confidence} Confidence
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Tag className="w-3 h-3" />
          <span className="font-medium">Verdict:</span>
          <span className="capitalize">{claim.verdict}</span>
        </div>
        {claim.verdicts && claim.verdicts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {claim.verdicts.length} source{claim.verdicts.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Claim ID: {claim.claim_id.replace("claim_", "")}
        </span>
        <Button
          onClick={() => onViewDetails(claim.claim_id)}
          variant="outline"
          size="sm"
          className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
        >
          View Fact-Check
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
