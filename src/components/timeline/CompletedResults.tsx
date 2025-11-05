'use client';

import {
  ArrowLeft,
  Check,
  CheckCircle,
  Download,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineEvent {
  label: string;
  timestamp: string;
  source: string;
}

interface Match {
  title: string;
  link: string;
  source: string;
  thumbnail?: string;
  sourceIcon?: string;
}

interface Analysis {
  hasMetadata: boolean;
  metadataConsistent: boolean;
  earlierOnlineAppearance: boolean;
  spoofedMetadata: boolean;
}

interface Metadata {
  extractedAt?: string;
  analysis: {
    integrityScore: number;
    authenticityScore: number;
    completenessScore: number;
  };
}

interface VerificationData {
  timeline: TimelineEvent[];
  matches: Match[];
  flags: string[];
  analysis: Analysis;
  metadata: Metadata;
}

interface CompletedResultsProps {
  verificationState: {
    data?: VerificationData;
    completedAt?: string;
  };
  onBack?: () => void;
}

export default function CompletedResults({
  verificationState,
  onBack,
}: CompletedResultsProps) {
  const { data, completedAt } = verificationState;

  if (!data) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600">No verification data available</div>
      </div>
    );
  }

  const { timeline, matches, flags, analysis, metadata } = data;

  const formatCompletionTime = (completedTime?: string) => {
    if (!completedTime) return '';
    return new Date(completedTime).toLocaleString();
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">Verification Complete</h2>
            {completedAt && (
              <p className="text-sm text-gray-500">
                Completed at {formatCompletionTime(completedAt)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div>
            <h3 className="text-lg font-medium text-green-900">
              Timeline Verification Complete
            </h3>
            <p className="text-green-700">
              Analysis completed successfully across all search engines and
              sources.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-lg font-medium mb-3">Timeline</h3>
        <div className="space-y-3 border border-gray-200 rounded-xl p-4">
          {timeline.map((event) => (
            <div
              key={event.label}
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

      {/* Distribution Matches */}
      <div>
        <h3 className="text-lg font-medium mb-3">
          Found Matches ({matches.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <a
              key={match.link}
              href={match.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-xl overflow-hidden hover:shadow-md transition group"
            >
              {match.thumbnail && (
                <img
                  src={match.thumbnail}
                  alt={match.title}
                  className="w-full h-40 object-cover"
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
                  <span className="text-sm font-semibold">{match.source}</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {match.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Analysis Summary */}
      <div>
        <h3 className="text-lg font-medium mb-3">Analysis Summary</h3>
        <div className="space-y-2 border border-gray-200 rounded-xl p-4">
          {flags.map((flag) => (
            <div key={flag} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata Integrity Scores */}
      <div>
        <h3 className="text-lg font-medium mb-3">Metadata Integrity</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {(metadata.analysis.integrityScore * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600">Integrity</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {(metadata.analysis.authenticityScore * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600">Authenticity</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {(metadata.analysis.completenessScore * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600">Completeness</p>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div>
        <h3 className="text-lg font-medium mb-3">Detailed Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 mb-3">Metadata Checks</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Has Metadata</span>
                <span
                  className={
                    analysis.hasMetadata ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {analysis.hasMetadata ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Metadata Consistent</span>
                <span
                  className={
                    analysis.metadataConsistent
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {analysis.metadataConsistent ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Earlier Online Appearance</span>
                <span
                  className={
                    analysis.earlierOnlineAppearance
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  {analysis.earlierOnlineAppearance ? '⚠' : '✓'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Spoofed Metadata</span>
                <span
                  className={
                    analysis.spoofedMetadata ? 'text-red-600' : 'text-green-600'
                  }
                >
                  {analysis.spoofedMetadata ? '⚠' : '✓'}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 mb-3">Search Coverage</h4>
            <div className="space-y-2 text-sm">
              {['Google Images', 'Bing Visual Search', 'TinEye', 'Yandex'].map(
                (engine) => (
                  <div
                    key={engine}
                    className="flex items-center justify-between"
                  >
                    <span>{engine}</span>
                    <span className="text-green-600">✓ Checked</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Engines Used */}
      <div>
        <h3 className="text-lg font-medium mb-3">Search Engines Verified</h3>
        <div className="flex flex-wrap gap-2">
          {['Google Images', 'Bing Visual Search', 'TinEye', 'Yandex'].map(
            (name) => (
              <div
                key={name}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
              >
                <Check className="w-3 h-3" />
                {name}
              </div>
            )
          )}
        </div>
      </div>

      {/* Metadata Information */}
      {metadata.extractedAt && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-2">
            Verification Details
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              Metadata extracted:{' '}
              {new Date(metadata.extractedAt).toLocaleString()}
            </p>
            <p>Total matches found: {matches.length}</p>
            <p>Timeline events: {timeline.length}</p>
            <p>Analysis flags: {flags.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
