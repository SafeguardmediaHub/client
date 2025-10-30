import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from './ui/button';

interface TimelineEvent {
  label: string;
  timestamp: string;
  source: string;
}

interface Match {
  title: string;
  link: string;
  source: string;
  sourceIcon?: string;
  thumbnail?: string;
}

interface VerifyTimelineResponse {
  timeline: TimelineEvent[];
  flags: string[];
  analysis: {
    hasMetadata: boolean;
    metadataConsistent: boolean;
    earlierOnlineAppearance: boolean;
    spoofedMetadata: boolean;
  };
  matches: Match[];
  metadata: {
    extractedAt: string;
    analysis: {
      integrityScore: number;
      authenticityScore: number;
      completenessScore: number;
    };
  };
}

interface ResultsPageProps {
  data: VerifyTimelineResponse;
  onBack?: () => void;
}

export default function ResultsPage({ data, onBack }: ResultsPageProps) {
  const { timeline, matches, flags, analysis, metadata } = data;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-semibold">Verification Results</h2>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-lg font-medium mb-3">Timeline</h3>
        <div className="space-y-3 border border-gray-200 rounded-xl p-4">
          {timeline.map((event, idx) => (
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

      {/* Distribution Matches */}
      <div>
        <h3 className="text-lg font-medium mb-3">Found Matches</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((m, idx) => (
            <a
              key={idx}
              href={m.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <img
                src={m.thumbnail}
                alt={m.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  {m.sourceIcon && (
                    <img
                      src={m.sourceIcon}
                      alt={m.source}
                      className="w-4 h-4 rounded"
                    />
                  )}
                  <span className="text-sm font-semibold">{m.source}</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{m.title}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Flags / Analysis */}
      <div>
        <h3 className="text-lg font-medium mb-3">Analysis Summary</h3>
        <div className="space-y-2 border border-gray-200 rounded-xl p-4">
          {flags.map((flag, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata Scores */}
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

      {/* Search Engines Used */}
      <div>
        <h3 className="text-lg font-medium mb-3">Search Engines Checked</h3>
        <div className="flex flex-wrap gap-2">
          {['Google Images', 'Bing Visual Search', 'TinEye', 'Yandex'].map(
            (name) => (
              <div
                key={name}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {name}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
