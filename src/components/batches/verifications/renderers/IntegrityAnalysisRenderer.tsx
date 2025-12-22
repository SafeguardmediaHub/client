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
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900">{category.name}</span>
          {category.score !== null && (
            <span className={`font-bold ${getCategoryScoreColor(category.score)}`}>
              {Math.round(category.score)}/100
            </span>
          )}
          {category.score === null && (
            <span className="text-sm text-gray-500">N/A</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {category.findings.length} finding{category.findings.length !== 1 ? "s" : ""}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          )}
        </div>
      </button>

      {isExpanded && category.findings.length > 0 && (
        <div className="p-4 space-y-3 bg-white">
          {category.findings.map((finding, idx) => (
            <FindingItem key={idx} finding={finding} />
          ))}
        </div>
      )}

      {isExpanded && category.findings.length === 0 && (
        <div className="p-4 text-center text-sm text-gray-500">
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
      <div className="flex items-start gap-2">
        <Badge className={getSeverityColor(finding.severity)} variant="secondary">
          {finding.severity.toUpperCase()}
        </Badge>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{finding.type}</p>
          {finding.impact !== undefined && (
            <p className="text-xs text-gray-500">
              Impact: {finding.impact > 0 ? `+${finding.impact}` : finding.impact} points
            </p>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed pl-2 border-l-2 border-gray-300">
        {finding.explanation}
      </p>
      {hasDetails ? (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600 overflow-x-auto">
          <pre className="whitespace-pre-wrap">
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
    <div className="space-y-6">
      {/* Overall Verdict & Score */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Overall Verdict:</span>
          {verdict && <VerdictBadge verdict={verdict as any} />}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Integrity Score:</span>
          <IntegrityScoreBadge score={integrityScore} />
        </div>
      </div>

      {/* Summary */}
      {summaryText && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Summary</h4>
          <p className="text-sm text-blue-800 leading-relaxed">{summaryText}</p>
        </div>
      )}

      {/* Key Flags/Concerns */}
      {flags.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Key Concerns ({flags.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {flags.map((flag, idx) => (
              <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {flag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Category Analysis */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
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
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h4 className="text-sm font-semibold text-amber-900 mb-2">
            Recommendations
          </h4>
          <p className="text-sm text-amber-800 leading-relaxed">{recommendations}</p>
        </div>
      )}

      {/* Raw Data (Debug) */}
      {fullData && (
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">
            View Raw Data (JSON)
          </summary>
          <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded overflow-x-auto">
            {JSON.stringify(fullData, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
