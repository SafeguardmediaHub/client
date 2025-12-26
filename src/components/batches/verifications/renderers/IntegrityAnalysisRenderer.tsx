"use client";

import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { VerdictBadge, IntegrityScoreBadge } from "@/components/batches/IntegrityBadges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IntegrityAnalysisFull, IntegrityCategory, IntegrityFinding } from "@/types/batch";
import type { VerificationData } from "../VerificationRegistry";

interface IntegrityAnalysisRendererProps {
  data: VerificationData;
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-red-100 text-red-700";
    case "high":
      return "bg-orange-100 text-orange-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getCategoryScoreColor = (score: number | null) => {
  if (score === null) return "text-gray-500";
  if (score >= 85) return "text-green-600";
  if (score >= 60) return "text-lime-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
};

function CategorySection({ category }: { category: IntegrityCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <span className="font-medium text-gray-900 text-xs sm:text-sm break-words">
              {category.name}
            </span>
            {category.score !== null && (
              <span className={`font-bold text-xs sm:text-sm ${getCategoryScoreColor(category.score)} whitespace-nowrap`}>
                {Math.round(category.score)}/100
              </span>
            )}
            {category.score === null && (
              <span className="text-xs sm:text-sm text-gray-500">N/A</span>
            )}
          </div>
          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <Badge variant="secondary" className="text-[10px] sm:text-xs whitespace-nowrap">
              {category.findings.length} finding{category.findings.length !== 1 ? "s" : ""}
            </Badge>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
            )}
          </div>
        </div>
      </button>

      {isExpanded && category.findings.length > 0 && (
        <div className="p-3 sm:p-4 space-y-3 bg-white">
          {category.findings.map((finding, idx) => (
            <FindingItem key={idx} finding={finding} />
          ))}
        </div>
      )}

      {isExpanded && category.findings.length === 0 && (
        <div className="p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-500">
          No findings for this category
        </div>
      )}
    </div>
  );
}

function FindingItem({ finding }: { finding: IntegrityFinding }) {
  const hasDetails = finding.details !== undefined && finding.details !== null;

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-start gap-2">
        <Badge className={`${getSeverityColor(finding.severity)} whitespace-nowrap text-[10px] sm:text-xs`} variant="secondary">
          {finding.severity.toUpperCase()}
        </Badge>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
            {finding.type}
          </p>
          {finding.impact !== undefined && (
            <p className="text-[10px] sm:text-xs text-gray-500">
              Impact: {finding.impact > 0 ? `+${finding.impact}` : finding.impact} points
            </p>
          )}
        </div>
      </div>
      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-2 border-l-2 border-gray-300 break-words">
        {finding.explanation}
      </p>
      {hasDetails ? (
        <div className="mt-2 p-2 bg-gray-50 rounded text-[10px] sm:text-xs font-mono text-gray-600 overflow-x-auto">
          <pre className="whitespace-pre-wrap break-words">
            {typeof finding.details === "string"
              ? finding.details
              : JSON.stringify(finding.details, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

export function IntegrityAnalysisRenderer({ data }: IntegrityAnalysisRendererProps) {
  const fullData = data.fullData as IntegrityAnalysisFull | undefined;
  const summary = data.summary as {
    verdict?: string;
    summary?: string;
    flags?: string[];
    integrityScore?: number;
  } | undefined;

  if (!fullData && !summary) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        No detailed integrity analysis data available
      </div>
    );
  }

  const verdict = summary?.verdict || fullData?.verdict;
  const integrityScore = summary?.integrityScore || fullData?.integrityScore || 0;
  const summaryText = summary?.summary || fullData?.summary;
  const flags = summary?.flags || fullData?.flags || [];
  const recommendations = fullData?.recommendations;
  const categories = fullData?.fullReport?.categories || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overall Verdict & Score */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Overall Verdict:</span>
          {verdict && <VerdictBadge verdict={verdict as any} />}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Integrity Score:</span>
          <IntegrityScoreBadge score={integrityScore} />
        </div>
      </div>

      {/* Summary */}
      {summaryText && (
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">Summary</h4>
          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed break-words">
            {summaryText}
          </p>
        </div>
      )}

      {/* Key Flags/Concerns */}
      {flags.length > 0 && (
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">
            Key Concerns ({flags.length})
          </h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {flags.map((flag, idx) => (
              <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 text-[10px] sm:text-xs">
                <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="break-words">{flag}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Category Analysis */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
            Category Analysis ({categories.length})
          </h4>
          <div className="space-y-2">
            {categories.map((category, idx) => (
              <CategorySection key={idx} category={category} />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && (
        <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h4 className="text-xs sm:text-sm font-semibold text-amber-900 mb-2">
            Recommendations
          </h4>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed break-words">
            {recommendations}
          </p>
        </div>
      )}

      {/* Raw Data (Debug) */}
      {fullData && (
        <details className="text-[10px] sm:text-xs">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">
            View Raw Data (JSON)
          </summary>
          <pre className="mt-2 p-2 sm:p-3 bg-gray-900 text-gray-100 rounded overflow-x-auto">
            <code className="break-words whitespace-pre-wrap">
              {JSON.stringify(fullData, null, 2)}
            </code>
          </pre>
        </details>
      )}
    </div>
  );
}
