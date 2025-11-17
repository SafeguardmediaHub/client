"use client";

import {
  AlertTriangle,
  Bot,
  Clock,
  Link as LinkIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SuspiciousPattern } from "@/types/trace";

interface SuspiciousPatternsTabProps {
  patterns: SuspiciousPattern[];
}

const getPatternIcon = (
  type: SuspiciousPattern["type"],
): React.ComponentType<{ className?: string }> => {
  switch (type) {
    case "coordinated_posting":
      return LinkIcon;
    case "bot_activity":
      return Bot;
    case "rapid_spread":
      return TrendingUp;
    case "suspicious_accounts":
      return Users;
    case "unusual_timing":
      return Clock;
    default:
      return AlertTriangle;
  }
};

const getSeverityConfig = (severity: "low" | "medium" | "high") => {
  switch (severity) {
    case "high":
      return {
        color: "text-red-700 bg-red-50 border-red-200",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        label: "High Risk",
      };
    case "medium":
      return {
        color: "text-yellow-700 bg-yellow-50 border-yellow-200",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        label: "Medium Risk",
      };
    case "low":
      return {
        color: "text-blue-700 bg-blue-50 border-blue-200",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        label: "Low Risk",
      };
  }
};

const formatPatternType = (type: SuspiciousPattern["type"]) => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const SuspiciousPatternsTab = ({
  patterns,
}: SuspiciousPatternsTabProps) => {
  const sortedPatterns = [...patterns].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const highRiskCount = patterns.filter((p) => p.severity === "high").length;
  const mediumRiskCount = patterns.filter(
    (p) => p.severity === "medium",
  ).length;
  const lowRiskCount = patterns.filter((p) => p.severity === "low").length;

  if (patterns.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Suspicious Patterns Detected
        </h3>
        <p className="text-sm text-gray-600">
          Our analysis found no suspicious activity patterns in the trace
          results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Patterns</div>
          <div className="text-3xl font-bold text-gray-900">
            {patterns.length}
          </div>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-700 mb-1">High Risk</div>
          <div className="text-3xl font-bold text-red-900">{highRiskCount}</div>
        </div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-700 mb-1">Medium Risk</div>
          <div className="text-3xl font-bold text-yellow-900">
            {mediumRiskCount}
          </div>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700 mb-1">Low Risk</div>
          <div className="text-3xl font-bold text-blue-900">{lowRiskCount}</div>
        </div>
      </div>

      {/* Overall Risk Assessment */}
      <div
        className={cn(
          "p-6 border-2 rounded-lg",
          highRiskCount > 0
            ? "bg-red-50 border-red-200"
            : mediumRiskCount > 0
              ? "bg-yellow-50 border-yellow-200"
              : "bg-blue-50 border-blue-200",
        )}
      >
        <div className="flex items-start gap-4">
          <AlertTriangle
            className={cn(
              "w-8 h-8 flex-shrink-0",
              highRiskCount > 0
                ? "text-red-600"
                : mediumRiskCount > 0
                  ? "text-yellow-600"
                  : "text-blue-600",
            )}
          />
          <div>
            <h3
              className={cn(
                "text-lg font-semibold mb-2",
                highRiskCount > 0
                  ? "text-red-900"
                  : mediumRiskCount > 0
                    ? "text-yellow-900"
                    : "text-blue-900",
              )}
            >
              {highRiskCount > 0
                ? "High Risk Activity Detected"
                : mediumRiskCount > 0
                  ? "Medium Risk Activity Detected"
                  : "Low Risk Activity Detected"}
            </h3>
            <p
              className={cn(
                "text-sm",
                highRiskCount > 0
                  ? "text-red-800"
                  : mediumRiskCount > 0
                    ? "text-yellow-800"
                    : "text-blue-800",
              )}
            >
              {highRiskCount > 0
                ? "Several high-risk suspicious patterns were identified. Immediate review is recommended."
                : mediumRiskCount > 0
                  ? "Some medium-risk patterns were detected. Further investigation may be warranted."
                  : "Minor anomalies detected, but overall activity appears normal."}
            </p>
          </div>
        </div>
      </div>

      {/* Patterns List */}
      <div className="space-y-4">
        {sortedPatterns.map((pattern) => {
          const Icon = getPatternIcon(pattern.type);
          const severityConfig = getSeverityConfig(pattern.severity);

          return (
            <div
              key={pattern.id}
              className={cn(
                "p-6 border-2 rounded-lg",
                severityConfig.bgColor,
                `border-${severityConfig.textColor.split("-")[1]}-200`,
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg border-2",
                      severityConfig.color,
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {formatPatternType(pattern.type)}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("border text-xs", severityConfig.color)}>
                        {severityConfig.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(pattern.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 mb-4">{pattern.description}</p>

              {/* Affected Posts */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-700 mb-2">
                  Affected Posts ({pattern.affectedPosts.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {pattern.affectedPosts.slice(0, 10).map((postId) => (
                    <Badge
                      key={postId}
                      variant="outline"
                      className="text-xs font-mono"
                    >
                      {postId.slice(0, 8)}...
                    </Badge>
                  ))}
                  {pattern.affectedPosts.length > 10 && (
                    <Badge variant="outline" className="text-xs">
                      +{pattern.affectedPosts.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Evidence */}
              {pattern.evidence && Object.keys(pattern.evidence).length > 0 && (
                <div className="pt-4 border-t border-gray-300">
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                      View evidence details
                    </summary>
                    <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(pattern.evidence, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              )}

              {/* Confidence Meter */}
              <div className="mt-4 pt-4 border-t border-gray-300">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-600">Detection Confidence</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(pattern.confidence * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      pattern.confidence >= 0.7
                        ? "bg-red-600"
                        : pattern.confidence >= 0.4
                          ? "bg-yellow-600"
                          : "bg-blue-600",
                    )}
                    style={{ width: `${pattern.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recommended Actions
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {highRiskCount > 0 && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>
                  Investigate high-risk patterns immediately - they may indicate
                  coordinated manipulation or bot activity
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>
                  Consider reporting suspicious accounts to platform moderators
                </span>
              </li>
            </>
          )}
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              Review affected posts to understand the scope of suspicious activity
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              Monitor for additional patterns over time with new traces
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              Cross-reference with forensic analysis for a complete picture
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
