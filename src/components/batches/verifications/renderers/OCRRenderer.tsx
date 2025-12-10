import { Badge } from '@/components/ui/badge';
import type { VerificationData } from '../VerificationRegistry';

interface OCRRendererProps {
  data: VerificationData;
}

export function OCRRenderer({ data }: OCRRendererProps) {
  const summary = data.summary as {
    text?: string;
    language?: string;
    confidence?: number;
  } | undefined;

  if (!summary || !summary.text) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        No text extracted
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Language Badge */}
      {summary.language && summary.language !== 'unknown' && (
        <div>
          <span className="text-xs text-gray-600">Language: </span>
          <Badge variant="secondary" className="text-xs">
            {summary.language}
          </Badge>
        </div>
      )}

      {/* Extracted Text */}
      <div className="bg-white rounded p-3 max-h-64 overflow-y-auto border">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{summary.text}</p>
      </div>
    </div>
  );
}
