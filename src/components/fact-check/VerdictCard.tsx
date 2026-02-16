import { Check, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Verdict } from '@/types/fact-check';

interface VerdictCardProps {
  verdict: Verdict;
}

export const VerdictCard = ({ verdict }: VerdictCardProps) => {
  const [copied, setCopied] = useState(false);

  const getRatingColor = (rating: string) => {
    const lowerRating = rating.toLowerCase();
    if (lowerRating.includes('true') || lowerRating.includes('correct')) {
      return 'text-green-700 bg-green-50 border-green-200';
    }
    if (lowerRating.includes('false') || lowerRating.includes('incorrect')) {
      return 'text-red-700 bg-red-50 border-red-200';
    }
    if (lowerRating.includes('mixed') || lowerRating.includes('mostly')) {
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
    return 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const handleCopyUrl = async () => {
    if (verdict.review_url) {
      await navigator.clipboard.writeText(verdict.review_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reviewDate = verdict.reviewed_at
    ? new Date(verdict.reviewed_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="h-full flex flex-col p-5 border border-gray-200 rounded-xl bg-white hover:shadow-lg transition-all duration-300 hover:border-blue-200">
      {/* Header with Source and Rating */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h4 className="text-base font-bold text-gray-900 line-clamp-1">
            {verdict.source}
          </h4>
          <div className="flex items-center gap-3 mt-1.5">
            {/* <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
              <ShieldCheck className="w-3 h-3 text-green-600" />
              <span className="text-[10px] font-semibold text-green-700">
                IFCN Certified
              </span>
            </span> */}
            {reviewDate && (
              <span className="text-xs text-gray-400">{reviewDate}</span>
            )}
          </div>
        </div>
        <div
          className={`flex-shrink-0 px-3 py-1 rounded-lg text-sm font-bold border shadow-sm ${getRatingColor(verdict.rating)}`}
        >
          {verdict.rating || verdict.textual_rating}
        </div>
      </div>

      {/* Textual Rating */}
      {verdict.textual_rating && verdict.textual_rating !== verdict.rating && (
        <p className="text-sm text-gray-700 mb-4 leading-relaxed flex-grow">
          {verdict.textual_rating}
        </p>
      )}

      {/* Footer Actions */}
      <div className="mt-auto space-y-2">
        {verdict.review_url && (
          <>
            <a
              href={verdict.review_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Read Full Report
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy Link
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
