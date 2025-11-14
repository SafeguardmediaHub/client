"use client";

import { ChevronRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Claim } from "@/types/fact-check";

interface ClaimCardProps {
  claim: Claim;
  onViewDetails: (claimId: string) => void;
}

export const ClaimCard = ({ claim, onViewDetails }: ClaimCardProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return "text-green-600 bg-green-50 border-green-200";
    if (confidence >= 0.4)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.7) return "High Confidence";
    if (confidence >= 0.4) return "Medium Confidence";
    return "Low Confidence";
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all bg-white">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <p className="text-base text-gray-900 leading-relaxed">
            {claim.original_text}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceColor(claim.confidence)}`}
        >
          {getConfidenceLabel(claim.confidence)} (
          {Math.round(claim.confidence * 100)}%)
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {claim.pattern_matched && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Tag className="w-3 h-3" />
            <span className="font-medium">Pattern:</span>
            <span className="capitalize">{claim.pattern_matched}</span>
          </div>
        )}
        {claim.entities && claim.entities.length > 0 && (
          <div className="flex items-center gap-2">
            {claim.entities.slice(0, 3).map((entity) => (
              <span
                key={entity}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
              >
                {entity}
              </span>
            ))}
            {claim.entities.length > 3 && (
              <span className="text-xs text-gray-500">
                +{claim.entities.length - 3} more
              </span>
            )}
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
