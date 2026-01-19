import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import type { PublisherCredibility, Verdict } from '@/types/fact-check';

interface VerdictCardProps {
  verdict: Verdict;
}

export const VerdictCard = ({ verdict }: VerdictCardProps) => {
  const [copied, setCopied] = useState(false);

  const getCredibilityConfig = (credibility: PublisherCredibility) => {
    switch (credibility) {
      case 'ifcn_certified':
        return {
          label: 'IFCN Certified',
          icon: ShieldCheck,
          color: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'reputable':
        return {
          label: 'Reputable Source',
          icon: Shield,
          color: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
      case 'questionable':
        return {
          label: 'Questionable Source',
          icon: ShieldAlert,
          color: 'text-orange-700',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
        };
      default:
        return {
          label: 'Unknown Source',
          icon: Shield,
          color: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

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

  const getRecencyColor = (days?: number) => {
    if (!days) return 'text-gray-500';
    if (days < 30) return 'text-green-600';
    if (days < 365) return 'text-blue-600';
    if (days < 730) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getRecencyLabel = (days?: number) => {
    if (!days) return 'Unknown';
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const handleCopyUrl = async () => {
    if (verdict.review_url) {
      await navigator.clipboard.writeText(verdict.review_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const credibilityConfig = getCredibilityConfig(verdict.publisher_credibility);
  const CredibilityIcon = credibilityConfig.icon;
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
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-bold text-gray-900 line-clamp-1">
              {verdict.source}
            </h4>
            {reviewDate && (
              <span className="text-xs text-gray-400 font-normal whitespace-nowrap">
                • {reviewDate}
              </span>
            )}
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${credibilityConfig.color} ${credibilityConfig.bgColor} ${credibilityConfig.borderColor}`}
          >
            <CredibilityIcon className="w-3 h-3" />
            {credibilityConfig.label}
          </div>
        </div>
        <div
          className={`flex-shrink-0 px-3 py-1 rounded-lg text-sm font-bold border shadow-sm ${getRatingColor(verdict.rating)}`}
        >
          {verdict.rating || verdict.textual_rating}
        </div>
      </div>

      {/* Claim Title / Context */}
      {verdict.api_response?.title && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-3 leading-relaxed flex-grow">
          {verdict.api_response.title}
        </p>
      )}

      {verdict.textual_rating && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
          {verdict.textual_rating}
        </p>
      )}

      {/* Recency Information */}
      {verdict.recency_days !== undefined && (
        <div className="flex items-center gap-2 mb-3">
          <Clock
            className={`w-3.5 h-3.5 ${getRecencyColor(verdict.recency_days)}`}
          />
          <span
            className={`text-xs font-medium ${getRecencyColor(verdict.recency_days)}`}
          >
            {getRecencyLabel(verdict.recency_days)}
          </span>
        </div>
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <div className="space-y-1">
          <div
            className="flex items-center gap-1"
            title="How much this source's credibility affects the overall score"
          >
            <TrendingUp className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              Credibility
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {verdict.credibility_multiplier !== undefined
              ? `${(verdict.credibility_multiplier * 100).toFixed(0)}%`
              : 'N/A'}
          </p>
        </div>
        <div className="space-y-1">
          <div
            className="flex items-center gap-1"
            title="How the age of this review affects its weight"
          >
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              Recency
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {verdict.recency_multiplier !== undefined
              ? `${(verdict.recency_multiplier * 100).toFixed(0)}%`
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Impact Score */}
      <div className="mb-4 p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">
            Score Impact
          </span>
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${verdict.weighted_score >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-sm font-bold text-gray-900">
              {verdict.weighted_score > 0 ? '+' : ''}
              {verdict.weighted_score.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

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
