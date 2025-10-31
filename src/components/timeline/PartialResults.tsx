"use client";

import {
  ArrowLeft,
  Clock,
  Check,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type TimelineVerificationState } from "@/hooks/useTimeline";
import ProgressBar from "./ProgressBar";

interface PartialResultsProps {
  verificationState: TimelineVerificationState;
  onBack?: () => void;
}

export default function PartialResults({
  verificationState,
  onBack,
}: PartialResultsProps) {
  const { progress, currentStage, data, startedAt } = verificationState;

  const formatElapsedTime = (startTime?: string) => {
    if (!startTime) return "";

    const elapsed = Date.now() - new Date(startTime).getTime();
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  // Show skeleton placeholders for sections that aren't ready yet
  const showTimeline = data?.timeline && data.timeline.length > 0;
  const showMatches = data?.matches && data.matches.length > 0;
  const showAnalysis = data?.flags && data.flags.length > 0;
  const showMetadata = data?.metadata;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-semibold">Verification Results</h2>
      </div>

      {/* Progress Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              Verification in Progress
            </h3>
            <p className="text-blue-700">{currentStage}</p>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formatElapsedTime(startedAt)}</span>
          </div>
        </div>

        <ProgressBar progress={progress} />

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-blue-600">{progress}% complete</span>
          <span className="text-sm text-blue-600">
            Results updating automatically...
          </span>
        </div>
      </div>

      {/* Partial Results Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <h4 className="font-medium text-yellow-900">
              Partial Results Available
            </h4>
            <p className="text-sm text-yellow-700">
              Results are being updated as the verification process continues.
              Some sections may still be processing.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      {showTimeline ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium">Timeline</h3>
          </div>
          <div className="space-y-3 border border-gray-200 rounded-xl p-4">
            {data.timeline.map((event, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-none"
              >
                <div>
                  <p className="font-semibold">{event.label}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="text-sm text-gray-600">{event.source}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-600">Timeline</h3>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Extracting timeline information...
            </p>
          </div>
        </div>
      )}

      {/* Matches Section */}
      {showMatches ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium">
              Found Matches ({data.matches.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.matches.slice(0, 6).map((match, idx) => (
              <a
                key={idx}
                href={match.link}
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-xl overflow-hidden hover:shadow-md transition group"
              >
                {match.thumbnail && (
                  <img
                    src={match.thumbnail}
                    alt={match.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {match.sourceIcon && (
                      <img
                        src={match.sourceIcon}
                        alt={match.source}
                        className="w-4 h-4 rounded"
                      />
                    )}
                    <span className="text-sm font-semibold">
                      {match.source}
                    </span>
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {match.title}
                  </p>
                </div>
              </a>
            ))}
            {data.matches.length > 6 && (
              <div className="border border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center">
                <span className="text-sm text-gray-500">
                  +{data.matches.length - 6} more results
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-600">Found Matches</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <div className="w-full h-32 bg-gray-200 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Searching across multiple engines...
          </p>
        </div>
      )}

      {/* Analysis Section */}
      {showAnalysis ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium">Preliminary Analysis</h3>
          </div>
          <div className="space-y-2 border border-gray-200 rounded-xl p-4">
            {data.flags.map((flag, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-600">
              Analysis Summary
            </h3>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-4/5" />
              <div className="h-4 bg-gray-200 rounded w-3/5" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Analyzing verification results...
            </p>
          </div>
        </div>
      )}

      {/* Metadata Scores */}
      {showMetadata ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium">Metadata Analysis</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {(data.metadata.analysis.integrityScore * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600">Integrity</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {(data.metadata.analysis.authenticityScore * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600">Authenticity</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                {(data.metadata.analysis.completenessScore * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600">Completeness</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-600">
              Metadata Analysis
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-16 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded mx-auto animate-pulse" />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Processing metadata scores...
          </p>
        </div>
      )}
    </div>
  );
}
