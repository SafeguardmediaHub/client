"use client";

import {
  AlertCircle,
  CheckCircle,
  Globe,
  Info,
  Shield,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ForensicAnalysis } from "@/types/trace";

interface ForensicAnalysisTabProps {
  analysis: ForensicAnalysis;
}

const getVerdictConfig = (
  verdict: "authentic" | "suspicious" | "manipulated" | "inconclusive",
) => {
  switch (verdict) {
    case "authentic":
      return {
        icon: CheckCircle,
        label: "Authentic",
        color: "text-green-700 bg-green-50 border-green-200",
        description: "Content appears to be authentic with no signs of manipulation",
      };
    case "suspicious":
      return {
        icon: AlertCircle,
        label: "Suspicious",
        color: "text-yellow-700 bg-yellow-50 border-yellow-200",
        description:
          "Some indicators suggest possible manipulation - further review recommended",
      };
    case "manipulated":
      return {
        icon: XCircle,
        label: "Manipulated",
        color: "text-red-700 bg-red-50 border-red-200",
        description: "Strong evidence of content manipulation detected",
      };
    case "inconclusive":
      return {
        icon: Info,
        label: "Inconclusive",
        color: "text-gray-700 bg-gray-50 border-gray-200",
        description: "Insufficient data to make a definitive determination",
      };
  }
};

export const ForensicAnalysisTab = ({ analysis }: ForensicAnalysisTabProps) => {
  const verdictConfig = getVerdictConfig(analysis.authenticity.verdict);
  const VerdictIcon = verdictConfig.icon;

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Overall Assessment */}
      <div
        className={cn("p-6 border-2 rounded-lg", verdictConfig.color.split(" ")[1], `border-${verdictConfig.color.split("-")[1]}-200`)}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-3 rounded-full border-2",
              verdictConfig.color,
            )}
          >
            <VerdictIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {verdictConfig.label}
              </h3>
              <Badge className={cn("border", verdictConfig.color)}>
                {analysis.overallConfidence}% Confidence
              </Badge>
            </div>
            <p className="text-sm text-gray-700">{verdictConfig.description}</p>
          </div>
        </div>
      </div>

      {/* Overall Confidence */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Overall Confidence Score
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Forensic Confidence</span>
            <span className="text-2xl font-bold text-gray-900">
              {analysis.overallConfidence}%
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                analysis.overallConfidence >= 70
                  ? "bg-green-600"
                  : analysis.overallConfidence >= 40
                    ? "bg-yellow-600"
                    : "bg-red-600",
              )}
              style={{ width: `${analysis.overallConfidence}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            This score represents the overall confidence in the forensic analysis
            based on multiple indicators and data points.
          </p>
        </div>
      </div>

      {/* Authenticity Assessment */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Authenticity Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Authenticity Score</div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-gray-900">
                {analysis.authenticity.score}%
              </div>
              <Badge className={cn("border", verdictConfig.color)}>
                {verdictConfig.label}
              </Badge>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Verdict</div>
            <div className="text-2xl font-bold text-gray-900 capitalize">
              {analysis.authenticity.verdict}
            </div>
          </div>
        </div>

        {/* Authenticity Indicators */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">
            Authenticity Indicators
          </h4>
          {analysis.authenticity.indicators.length === 0 ? (
            <p className="text-sm text-gray-600">No specific indicators detected</p>
          ) : (
            <div className="space-y-2">
              {analysis.authenticity.indicators.map((indicator, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {indicator.type}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(indicator.confidence * 100)}% confident
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{indicator.description}</p>
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          indicator.confidence >= 0.7
                            ? "bg-green-600"
                            : indicator.confidence >= 0.4
                              ? "bg-yellow-600"
                              : "bg-red-600",
                        )}
                        style={{ width: `${indicator.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manipulation Detection */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Manipulation Detection
        </h3>
        <div
          className={cn(
            "p-4 rounded-lg border-2 mb-4",
            analysis.manipulation.detected
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200",
          )}
        >
          <div className="flex items-center gap-3">
            {analysis.manipulation.detected ? (
              <XCircle className="w-6 h-6 text-red-600" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
            <div>
              <div className="font-semibold text-gray-900">
                {analysis.manipulation.detected
                  ? "Manipulation Detected"
                  : "No Manipulation Detected"}
              </div>
              <div
                className={cn(
                  "text-sm",
                  analysis.manipulation.detected
                    ? "text-red-700"
                    : "text-green-700",
                )}
              >
                {analysis.manipulation.detected
                  ? "Evidence of content manipulation was found"
                  : "No signs of manipulation were detected in the content"}
              </div>
            </div>
          </div>
        </div>

        {analysis.manipulation.detected && analysis.manipulation.types && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">
              Manipulation Types Detected
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.manipulation.types.map((type, index) => (
                <Badge
                  key={index}
                  className="bg-red-100 text-red-700 border-red-200"
                >
                  {type}
                </Badge>
              ))}
            </div>
            {analysis.manipulation.confidence !== undefined && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Manipulation Confidence</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(analysis.manipulation.confidence * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{
                      width: `${analysis.manipulation.confidence * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metadata & Source Information */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Source Information
        </h3>
        <div className="space-y-4">
          {analysis.metadata.originalSource ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-semibold text-blue-900 mb-2">
                Original Source Detected
              </div>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Platform:</span>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300 capitalize">
                    {analysis.metadata.originalSource.platform}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Timestamp:</span>{" "}
                  {formatDate(analysis.metadata.originalSource.timestamp)}
                </div>
                <div className="break-all">
                  <span className="font-medium">URL:</span>{" "}
                  <a
                    href={analysis.metadata.originalSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {analysis.metadata.originalSource.url}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-600">
                Original source could not be determined
              </div>
            </div>
          )}

          {analysis.metadata.earliestAppearance && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900 mb-2">
                Earliest Detected Appearance
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Platform:</span>
                  <Badge
                    variant="outline"
                    className="capitalize"
                  >
                    {analysis.metadata.earliestAppearance.platform}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Timestamp:</span>{" "}
                  {formatDate(analysis.metadata.earliestAppearance.timestamp)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Forensic Recommendations
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {analysis.authenticity.verdict === "manipulated" && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>
                  Content shows signs of manipulation - consider this when
                  evaluating authenticity
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>
                  Cross-reference with suspicious patterns to identify
                  coordinated activity
                </span>
              </li>
            </>
          )}
          {analysis.authenticity.verdict === "suspicious" && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  Some indicators suggest possible issues - perform additional
                  verification
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>Compare with known authentic versions if available</span>
              </li>
            </>
          )}
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              Review the distribution timeline to understand content spread
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              Consider running additional forensic tools for deeper analysis
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
