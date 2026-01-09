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
        <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed flex-grow">
          {verdict.api_response.title}
        </p>
      )}

{verdict.textual_rating && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed flex-grow">
          {verdict.textual_rating}
        </p>
      )}
     
      {verdict.publisher_credibility && ( 
        <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed flex-grow ">
          Publisher Credibility: <span className="font-bold capitalize">{verdict.publisher_credibility}</span>
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
         <div className="flex items-center gap-2" title="Impact on credibility score">
           <div className={`w-2 h-2 rounded-full ${verdict.weighted_score >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
           <span className="text-xs font-medium text-gray-500">
             Impact: {verdict.weighted_score > 0 ? '+' : ''}{verdict.weighted_score.toFixed(2)}
           </span>
         </div>

        {verdict.review_url && (
          <a
            href={verdict.review_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Full Report
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
