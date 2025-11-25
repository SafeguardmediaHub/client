import { ExternalLink, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import type { Verdict, PublisherCredibility } from "@/types/fact-check";

interface VerdictCardProps {
  verdict: Verdict;
}

export const VerdictCard = ({ verdict }: VerdictCardProps) => {
  const getCredibilityConfig = (credibility: PublisherCredibility) => {
    switch (credibility) {
      case "ifcn_certified":
        return {
          label: "IFCN Certified",
          icon: ShieldCheck,
          color: "text-green-700",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "reputable":
        return {
          label: "Reputable Source",
          icon: Shield,
          color: "text-blue-700",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "questionable":
        return {
          label: "Questionable Source",
          icon: ShieldAlert,
          color: "text-orange-700",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        };
      default:
        return {
          label: "Unknown Source",
          icon: Shield,
          color: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const getRatingColor = (rating: string) => {
    const lowerRating = rating.toLowerCase();
    if (lowerRating.includes("true") || lowerRating.includes("correct")) {
      return "text-green-700 bg-green-50 border-green-200";
    }
    if (lowerRating.includes("false") || lowerRating.includes("incorrect")) {
      return "text-red-700 bg-red-50 border-red-200";
    }
    if (lowerRating.includes("mixed") || lowerRating.includes("mostly")) {
      return "text-yellow-700 bg-yellow-50 border-yellow-200";
    }
    return "text-gray-700 bg-gray-50 border-gray-200";
  };

  const credibilityConfig = getCredibilityConfig(verdict.publisher_credibility);
  const CredibilityIcon = credibilityConfig.icon;

  return (
    <div className="p-5 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900 mb-1">
            {verdict.source}
          </h4>
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${credibilityConfig.color} ${credibilityConfig.bgColor} ${credibilityConfig.borderColor}`}
          >
            <CredibilityIcon className="w-3 h-3" />
            {credibilityConfig.label}
          </div>
        </div>
        <div
          className={`px-3 py-1.5 rounded-md text-sm font-semibold border ${getRatingColor(verdict.rating)}`}
        >
          {verdict.textual_rating || verdict.rating}
        </div>
      </div>

      {verdict.api_response?.title && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {verdict.api_response.title}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">
            Score: {verdict.weighted_score > 0 ? "+" : ""}
            {verdict.weighted_score}
          </span>
        </div>
        {verdict.review_url && (
          <a
            href={verdict.review_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            Read Full Review
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
