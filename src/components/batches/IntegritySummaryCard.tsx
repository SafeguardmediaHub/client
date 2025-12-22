"use client";

import { AlertTriangle, Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BatchResultsSummary } from "@/types/batch";

interface IntegritySummaryCardProps {
  summary: BatchResultsSummary;
}

const VERDICT_CONFIG = {
  authentic: {
    label: "Authentic",
    icon: ShieldCheck,
    color: "text-green-600",
    bgColor: "bg-green-100",
    barColor: "bg-green-500",
  },
  likely_authentic: {
    label: "Likely Authentic",
    icon: ShieldCheck,
    color: "text-lime-600",
    bgColor: "bg-lime-100",
    barColor: "bg-lime-500",
  },
  suspicious: {
    label: "Suspicious",
    icon: ShieldAlert,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    barColor: "bg-orange-500",
  },
  likely_manipulated: {
    label: "Likely Manipulated",
    icon: AlertTriangle,
    color: "text-orange-700",
    bgColor: "bg-orange-200",
    barColor: "bg-orange-600",
  },
  manipulated: {
    label: "Manipulated",
    icon: ShieldX,
    color: "text-red-600",
    bgColor: "bg-red-100",
    barColor: "bg-red-500",
  },
};

const getScoreColor = (score: number): string => {
  if (score >= 85) return "text-green-600";
  if (score >= 60) return "text-lime-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
};

const getScoreGradient = (score: number): string => {
  if (score >= 85) return "from-green-500 to-green-600";
  if (score >= 60) return "from-lime-500 to-green-500";
  if (score >= 40) return "from-orange-500 to-lime-500";
  return "from-red-500 to-orange-500";
};

export function IntegritySummaryCard({ summary }: IntegritySummaryCardProps) {
  const {
    integrityAnalyzed = 0,
    authenticMedia = 0,
    likelyAuthenticMedia = 0,
    suspiciousMedia = 0,
    likelyManipulatedMedia = 0,
    manipulatedMedia = 0,
    averageIntegrityScore = 0,
  } = summary;

  // If no files were analyzed, don't show the card
  if (integrityAnalyzed === 0) {
    return null;
  }

  const totalVerified =
    authenticMedia +
    likelyAuthenticMedia +
    suspiciousMedia +
    likelyManipulatedMedia +
    manipulatedMedia;

  const getPercentage = (count: number) =>
    totalVerified > 0 ? ((count / totalVerified) * 100).toFixed(1) : "0.0";

  const verdictData = [
    {
      key: "authentic",
      count: authenticMedia,
      percentage: getPercentage(authenticMedia),
    },
    {
      key: "likely_authentic",
      count: likelyAuthenticMedia,
      percentage: getPercentage(likelyAuthenticMedia),
    },
    {
      key: "suspicious",
      count: suspiciousMedia,
      percentage: getPercentage(suspiciousMedia),
    },
    {
      key: "likely_manipulated",
      count: likelyManipulatedMedia,
      percentage: getPercentage(likelyManipulatedMedia),
    },
    {
      key: "manipulated",
      count: manipulatedMedia,
      percentage: getPercentage(manipulatedMedia),
    },
  ].filter((item) => item.count > 0);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Integrity Analysis Summary
        </h3>
      </div>

      {/* Average Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Average Integrity Score
          </span>
          <span
            className={`text-2xl font-bold ${getScoreColor(averageIntegrityScore)}`}
          >
            {Math.round(averageIntegrityScore)}/100
          </span>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getScoreGradient(averageIntegrityScore)} transition-all duration-500`}
            style={{ width: `${averageIntegrityScore}%` }}
          />
        </div>
      </div>

      {/* Files Analyzed */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{integrityAnalyzed}</span> files
          analyzed
        </p>
      </div>

      {/* Verdict Distribution */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Distribution
        </h4>

        {verdictData.map((item) => {
          const config =
            VERDICT_CONFIG[item.key as keyof typeof VERDICT_CONFIG];
          const Icon = config.icon;

          return (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <span className="font-medium text-gray-700">
                    {config.label}
                  </span>
                </div>
                <span className="text-gray-600">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${config.barColor} transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* High Risk Alert */}
      {(manipulatedMedia + likelyManipulatedMedia) / integrityAnalyzed > 0.1 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">
                High Manipulation Rate Detected
              </p>
              <p className="text-xs text-red-700 mt-1">
                More than 10% of files show signs of manipulation. Review
                flagged items carefully before use.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
