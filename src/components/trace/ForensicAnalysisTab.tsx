"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  Lightbulb,
  Shield,
  Target,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ForensicAnalysis } from "@/types/trace";

interface ForensicAnalysisTabProps {
  analysis: ForensicAnalysis;
  searchConfig?: any;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return {
        icon: CheckCircle,
        label: "Completed",
        color: "text-green-700 bg-green-50 border-green-200",
      };
    case "processing":
      return {
        icon: Clock,
        label: "Processing",
        color: "text-blue-700 bg-blue-50 border-blue-200",
      };
    case "failed":
      return {
        icon: AlertCircle,
        label: "Failed",
        color: "text-red-700 bg-red-50 border-red-200",
      };
    default:
      return {
        icon: Info,
        label: "Unknown",
        color: "text-gray-700 bg-gray-50 border-gray-200",
      };
  }
};

export const ForensicAnalysisTab = ({ analysis, searchConfig }: ForensicAnalysisTabProps) => {
  // Resolve data from Mongoose wrapper if present, otherwise use as is
  const data = (analysis as any)?._doc || analysis;

  if (!data || (!data.status && !(analysis as any).status)) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Forensic Analysis Available
        </h3>
        <p className="text-sm text-gray-600">
          Forensic analysis data is not available for this trace.
        </p>
      </div>
    );
  }

  const statusConfig = getStatusConfig(data.status || (analysis as any).status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (!analysis) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Forensic Analysis Available
        </h3>
        <p className="text-sm text-gray-600">
          Forensic analysis data is not available for this trace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Status */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Analysis Status
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <Badge className={cn("border", statusConfig.color)}>
              <StatusIcon className="w-4 h-4 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Started At</div>
              <div className="text-sm font-medium text-gray-900">
                {formatDate(data.startedAt)}
              </div>
            </div>
            {data.completedAt && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Completed At</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(data.completedAt)}
                </div>
              </div>
            )}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Processing Time</div>
              <div className="text-sm font-medium text-gray-900">
                {formatDuration(data.processingTimeSeconds || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Configuration */}
      {searchConfig && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Depth</div>
              <div className="text-sm font-semibold text-gray-900">Level {searchConfig.searchDepth}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Max Results</div>
              <div className="text-sm font-semibold text-gray-900">{searchConfig.maxResults}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Visual Search</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                {searchConfig.enableVisualSearch ? 'Enabled' : 'Disabled'}
                {searchConfig.enableVisualSearch && (
                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-100">
                    {(searchConfig.visualVerificationThreshold * 100).toFixed(0)}% Thresh
                  </Badge>
                )}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Platforms</div>
              <div className="flex flex-wrap gap-1">
                {searchConfig.platforms?.map((p: string) => (
                  <Badge key={p} className="text-[10px] capitalize bg-gray-200 text-gray-700 border-none">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracing Score */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Tracing Score
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              How effectively we traced the content across platforms
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {((data.tracingScore || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                (data.tracingScore || 0) >= 0.7
                  ? "bg-green-600"
                  : (data.tracingScore || 0) >= 0.4
                    ? "bg-yellow-600"
                    : "bg-red-600",
              )}
              style={{ width: `${(data.tracingScore || 0) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            A higher tracing score indicates better coverage and more comprehensive tracking across platforms.
          </p>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Confidence Score
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Overall confidence in the analysis results
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {((data.confidence || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                (data.confidence || 0) >= 0.7
                  ? "bg-blue-600"
                  : (data.confidence || 0) >= 0.4
                    ? "bg-purple-600"
                    : "bg-gray-600",
              )}
              style={{ width: `${(data.confidence || 0) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            This score represents the reliability of the forensic analysis based on data quality and coverage.
          </p>
        </div>
      </div>

      {/* Analysis Summary */}
      {data.summary && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Analysis Summary
          </h3>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              {data.summary}
            </p>
          </div>
        </div>
      )}

      {/* Flags */}
      {data.flags && data.flags.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            Analysis Flags
          </h3>
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

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            Recommendations
          </h3>
          <ul className="space-y-3">
            {data.recommendations.map((recommendation: string, index: number) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interpretation Guide */}
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Interpreting the Results
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
            <div>
              <span className="font-medium">High Scores (70%+):</span> Strong evidence trail with comprehensive platform coverage and reliable data
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-1.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Medium Scores (40-70%):</span> Moderate coverage with some gaps in the evidence trail
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Low Scores (Below 40%):</span> Limited coverage or insufficient data for conclusive analysis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
