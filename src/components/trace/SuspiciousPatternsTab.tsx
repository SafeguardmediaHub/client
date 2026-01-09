"use client";

import {
  AlertTriangle,
  Bot,
  Clock,
  Link as LinkIcon,
  TrendingUp,
  Shield,
  Flag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SuspiciousPatterns } from "@/types/trace";

interface SuspiciousPatternsTabProps {
  patterns: SuspiciousPatterns;
}

const getRiskConfig = (risk: "low" | "medium" | "high") => {
  switch (risk) {
    case "high":
      return {
        color: "text-red-700 bg-red-50 border-red-200",
        icon: AlertTriangle,
        label: "High Risk",
      };
    case "medium":
      return {
        color: "text-yellow-700 bg-yellow-50 border-yellow-200",
        icon: Flag,
        label: "Medium Risk",
      };
    case "low":
      return {
        color: "text-green-700 bg-green-50 border-green-200",
        icon: Shield,
        label: "Low Risk",
      };
  }
};

export const SuspiciousPatternsTab = ({
  patterns,
}: SuspiciousPatternsTabProps) => {
  // Resolve data from Mongoose wrapper if present
  const data = (patterns as any)?._doc || patterns;

  if (!data || !data.riskLevel) {
    return (
      <div className="p-12 text-center text-gray-500">
        No patterns data available.
      </div>
    );
  }

  const riskConfig = getRiskConfig(data.riskLevel);
  const RiskIcon = riskConfig.icon;

  const hasAnyDetection =
    data.coordinatedBehavior?.detected ||
    data.botAmplification?.detected ||
    data.rapidSpread?.detected;

  if (!hasAnyDetection && patterns.flags.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
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
      {/* Overall Risk Assessment */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Overall Risk Assessment
          </h3>
          <Badge className={cn("border", riskConfig.color)}>
            <RiskIcon className="w-4 h-4 mr-1" />
            {riskConfig.label}
          </Badge>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-2">Suspicion Score</div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  (data.overallSuspicionScore || 0) >= 0.7
                    ? "bg-red-600"
                    : (data.overallSuspicionScore || 0) >= 0.4
                      ? "bg-yellow-600"
                      : "bg-green-600"
                )}
                style={{
                  width: `${(data.overallSuspicionScore || 0) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {((data.overallSuspicionScore || 0) * 100).toFixed(1)}%
          </div>
        </div>

        {data.flags && data.flags.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Flags:</div>
            <div className="flex flex-wrap gap-2">
              {data.flags.map((flag: string, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-yellow-300 bg-yellow-50 text-yellow-800"
                >
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Coordinated Behavior */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <LinkIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Coordinated Behavior
              </h3>
              <p className="text-sm text-gray-600">
                Patterns suggesting coordinated posting activity
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "border",
              data.coordinatedBehavior?.detected
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            )}
          >
            {data.coordinatedBehavior?.detected ? "Detected" : "Not Detected"}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Detection Score</span>
            <span className="font-medium text-gray-900">
              {((data.coordinatedBehavior?.score || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Accounts Involved</span>
            <span className="font-medium text-gray-900">
              {data.coordinatedBehavior?.accountsInvolved?.length ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Timing Clusters</span>
            <span className="font-medium text-gray-900">
              {data.coordinatedBehavior?.timingClusters?.length ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Similarity Score</span>
            <span className="font-medium text-gray-900">
              {((data.coordinatedBehavior?.similarityScore ?? 0) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Bot Amplification */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Bot className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Bot Amplification
              </h3>
              <p className="text-sm text-gray-600">
                Automated accounts potentially amplifying content
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "border",
              data.botAmplification?.detected
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            )}
          >
            {data.botAmplification?.detected ? "Detected" : "Not Detected"}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Detection Score</span>
            <span className="font-medium text-gray-900">
              {((data.botAmplification?.score || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Suspicious Accounts</span>
            <span className="font-medium text-gray-900">
              {data.botAmplification?.suspiciousAccounts?.length ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Bot Probability</span>
            <span className="font-medium text-gray-900">
              {((data.botAmplification?.botProbability ?? 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Indicators Found</span>
            <span className="font-medium text-gray-900">
              {data.botAmplification?.indicators?.length ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Rapid Spread */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Rapid Spread Analysis
              </h3>
              <p className="text-sm text-gray-600">
                Unusually fast content propagation patterns
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "border",
              data.rapidSpread?.detected
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            )}
          >
            {data.rapidSpread?.detected ? "Detected" : "Not Detected"}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Spread Rate</span>
            <span className="font-medium text-gray-900">
              {(data.rapidSpread?.spreadRate ?? 0).toFixed(2)} posts/hour
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Detection Score</span>
            <span className="font-medium text-gray-900">
              {((data.rapidSpread?.score || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Organic Likelihood</span>
            <span className="font-medium text-gray-900">
              {((data.rapidSpread?.organicLikelihood ?? 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Acceleration Points</span>
            <span className="font-medium text-gray-900">
              {data.rapidSpread?.accelerationPoints?.length ?? 0}
            </span>
          </div>
        </div>

        {data.rapidSpread?.timeline && data.rapidSpread.timeline.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Spread Timeline ({data.rapidSpread.timeline.length} hours tracked)
            </div>
            <div className="text-xs text-gray-600">
              Peak activity at hour {data.rapidSpread.timeline.reduce((max: any, curr: any) =>
                curr.postCount > max.postCount ? curr : max,
                data.rapidSpread.timeline[0]
              )?.hour || 0} with {data.rapidSpread.timeline.reduce((max: number, curr: any) =>
                Math.max(max, curr.postCount),
                0
              )} posts
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
