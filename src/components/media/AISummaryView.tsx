'use client';

import { SparklesIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Media } from '@/hooks/useMedia';

interface AISummaryViewProps {
  media: Media;
}

export function AISummaryView({ media }: AISummaryViewProps) {
  if (!media.aiSummary) {
    if (media.status === 'processing') {
      return (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-blue-600" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">
              Analysis in progress... Summary will appear once processing
              completes.
            </p>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-blue-50/30">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 text-purple-600" />
          AI Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
          {media.aiSummary.summary}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-purple-100">
          <span>Generated {formatDate(media.aiSummary.generatedAt)}</span>
          <span>·</span>
          <span>v{media.aiSummary.dataVersion}</span>
          <span>·</span>
          <span className="font-mono">{media.aiSummary.model}</span>
        </div>
      </CardContent>
    </Card>
  );
}
