/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
'use client';

import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  FileSearch,
  HelpCircle,
  Lightbulb,
  Loader2,
  Search,
  Target,
  TrendingUp,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Claim } from '@/types/fact-check';

interface ClaimCardProps {
  claim: Claim;
  onViewDetails: (claimId: string) => void;
}

export const ClaimCard = ({ claim, onViewDetails }: ClaimCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const aiAnalysis = claim.ai_analysis;

  // Handle processing/pending state
  if (claim.status === 'processing' || claim.status === 'pending') {
    return (
      <div className="border border-blue-100 rounded-xl bg-white p-6 shadow-sm animate-pulse">
        <div className="flex items-start gap-3">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin mt-1" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-20 bg-blue-50 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
        </div>
        <div className="mt-4 text-xs text-blue-600 font-medium flex items-center gap-2">
          <Search className="w-3 h-3" />
          Analyzing claim and verifying with trusted sources...
        </div>
      </div>
    );
  }

  // Handle failed state
  if (claim.status === 'failed') {
    return (
      <div className="border border-red-200 rounded-xl bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
          <div>
            <p className="font-medium text-red-900">Analysis Failed</p>
            <p className="text-sm text-red-700 mt-1">
              We couldn't verify this claim. {claim.text}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Map backend confidence string to number for color coding
  // const getConfidenceScore = (confidence: string = 'Low'): number => {
  //   const confidenceLower = confidence.toLowerCase();
  //   if (confidenceLower === 'high') return 0.8;
  //   if (confidenceLower === 'medium') return 0.5;
  //   return 0.3; // low
  // };

  // const confidenceScore = getConfidenceScore(claim.confidence);

  // const getConfidenceColor = (score: number) => {
  //   if (score >= 0.7) return 'text-green-600 bg-green-50 border-green-200';
  //   if (score >= 0.4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  //   return 'text-red-600 bg-red-50 border-red-200';
  // };

  const getSpecificityColor = (level: string) => {
    const levelLower = level.toLowerCase();
    if (levelLower.includes('very') || levelLower === 'very_specific')
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (levelLower === 'specific')
      return 'bg-blue-100 text-blue-800 border-blue-300';
    if (levelLower === 'moderate')
      return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getVerdictColor = (verdict: string = 'Unknown') => {
    const verdictLower = verdict.toLowerCase();
    if (verdictLower.includes('true') || verdictLower === 'verified_true')
      return 'bg-green-100 text-green-800 border-green-300';
    if (verdictLower.includes('false') || verdictLower === 'verified_false')
      return 'bg-red-100 text-red-800 border-red-300';
    if (verdictLower === 'mixed')
      return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatSpecificityLevel = (level: string) => {
    return level
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all bg-white overflow-hidden">
      {/* Main Content */}
      <div className="p-5 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-gray-900 leading-relaxed">
                {claim.text}
              </p>
              {claim.context && (
                <p className="text-sm text-gray-600 mt-2 italic">
                  Context: {claim.context}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {/* <div
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getConfidenceColor(confidenceScore)} whitespace-nowrap`}
              >
                {claim.confidence || "Unknown"} Confidence
              </div> */}
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getVerdictColor(claim.verdict)} whitespace-nowrap text-center`}
              >
                {claim.verdict || 'Pending'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-900">
                Credibility
              </span>
            </div>
            <p className="text-lg font-bold text-blue-900">
              {typeof claim.credibility_score === 'number'
                ? `${Math.round(claim.credibility_score * 100)}%`
                : '0%'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-900">
                Reliability
              </span>
            </div>
            <p className="text-lg font-bold text-purple-900">
              {typeof claim.reliability_index === 'number'
                ? `${Math.round(claim.reliability_index * 100)}%`
                : '0%'}
            </p>
          </div>

          {aiAnalysis?.specificity && (
            <>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-900">
                    AI Score
                  </span>
                </div>
                <p className="text-lg font-bold text-emerald-900">
                  {typeof aiAnalysis.specificity.score === 'number'
                    ? Math.round(aiAnalysis.specificity.score)
                    : 0}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <FileSearch className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-900">
                    Elements
                  </span>
                </div>
                <p className="text-lg font-bold text-amber-900">
                  {aiAnalysis.verifiableElements?.length || 0}
                </p>
              </div>
            </>
          )}
        </div>

        {/* AI Analysis Preview */}
        {aiAnalysis && (
          <div className="space-y-3">
            {/* Specificity Badge */}
            {aiAnalysis.specificity && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-gray-600">
                  Specificity:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSpecificityColor(aiAnalysis.specificity.level)}`}
                >
                  {formatSpecificityLevel(aiAnalysis.specificity.level)} (
                  {aiAnalysis.specificity.score}/100)
                </span>
              </div>
            )}

            {/* Quick Indicators */}
            <div className="flex flex-wrap gap-2">
              {claim.verdicts && claim.verdicts.length > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
                  <ExternalLink className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">
                    {claim.verdicts.length} External Source
                    {claim.verdicts.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {aiAnalysis.logicalConsistency?.isConsistent && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-green-800">
                    Logically Consistent
                  </span>
                </div>
              )}
              {aiAnalysis.logicalConsistency &&
                !aiAnalysis.logicalConsistency.isConsistent && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
                    <XCircle className="w-3 h-3 text-red-600" />
                    <span className="text-xs font-medium text-red-800">
                      Logical Issues
                    </span>
                  </div>
                )}
              {aiAnalysis.redFlags && aiAnalysis.redFlags.length > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span className="text-xs font-medium text-red-800">
                    {aiAnalysis.redFlags.length} Red Flag
                    {aiAnalysis.redFlags.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* AI Summary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <Brain className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs font-semibold text-indigo-900">
                  AI Analysis Summary
                </span>
              </div>
              <p className="text-sm text-indigo-800 leading-relaxed">
                {aiAnalysis.summary}
              </p>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        {aiAnalysis && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Detailed Analysis
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Detailed Analysis
              </>
            )}
          </button>
        )}
      </div>

      {/* Expanded Detailed Analysis */}
      {isExpanded && aiAnalysis && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-5 sm:p-6 space-y-5">
            {/* Specificity Details */}
            {aiAnalysis.specificity && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Specificity Analysis
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">
                      Level:
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getSpecificityColor(aiAnalysis.specificity.level)}`}
                    >
                      {formatSpecificityLevel(aiAnalysis.specificity.level)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">
                      Score:
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round(aiAnalysis.specificity.score)}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 pt-2 border-t border-gray-100">
                    {aiAnalysis.specificity.reasoning}
                  </p>
                </div>
              </div>
            )}

            {/* Verifiable Elements */}
            {aiAnalysis.verifiableElements &&
              aiAnalysis.verifiableElements.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Verifiable Elements (
                      {aiAnalysis.verifiableElements.length})
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {aiAnalysis.verifiableElements.map((element, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-medium text-sm text-blue-900">
                            {element.element}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded text-xs font-semibold">
                            {element.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          {element.canBeVerified ? (
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-600" />
                          )}
                          <span
                            className={`text-xs font-medium ${
                              element.canBeVerified
                                ? 'text-green-700'
                                : 'text-red-700'
                            }`}
                          >
                            {element.canBeVerified
                              ? 'Can be verified'
                              : 'Cannot be verified'}
                          </span>
                        </div>
                        <p className="text-xs text-blue-800">
                          <span className="font-medium">Method:</span>{' '}
                          {element.verificationMethod}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Red Flags */}
            {aiAnalysis.redFlags && aiAnalysis.redFlags.length > 0 && (
              <div className="bg-white border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Red Flags ({aiAnalysis.redFlags.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {aiAnalysis.redFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="bg-red-50 border border-red-200 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-red-900">
                          {flag.type}
                        </span>
                        <span className="px-2 py-0.5 bg-red-200 text-red-800 rounded text-xs font-semibold capitalize">
                          {flag.severity}
                        </span>
                      </div>
                      <p className="text-xs text-red-800">{flag.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logical Consistency */}
            {aiAnalysis.logicalConsistency && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Logical Consistency
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {aiAnalysis.logicalConsistency.isConsistent ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        aiAnalysis.logicalConsistency.isConsistent
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}
                    >
                      {aiAnalysis.logicalConsistency.isConsistent
                        ? 'Logically Consistent'
                        : 'Logical Issues Detected'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 pt-2 border-t border-gray-100">
                    {aiAnalysis.logicalConsistency.reasoning}
                  </p>
                  {aiAnalysis.logicalConsistency.issues.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-600">
                        Issues:
                      </span>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {aiAnalysis.logicalConsistency.issues.map(
                          (issue, idx) => (
                            <li key={idx} className="text-xs text-red-700 ml-2">
                              {issue}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Missing Information */}
            {aiAnalysis.missingInformation &&
              aiAnalysis.missingInformation.length > 0 && (
                <div className="bg-white border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Missing Information (
                      {aiAnalysis.missingInformation.length})
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {aiAnalysis.missingInformation.map((info, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-amber-900"
                      >
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Verification Guide */}
            {aiAnalysis.verificationGuide && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-sm font-semibold text-indigo-900">
                    Verification Guide
                  </h4>
                </div>

                <div className="space-y-4">
                  {/* Suggested Sources */}
                  {aiAnalysis.verificationGuide.suggestedSources && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <ExternalLink className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-semibold text-indigo-900">
                          Suggested Sources
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.verificationGuide.suggestedSources.map(
                          (source, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-white border border-indigo-200 rounded-full text-xs font-medium text-indigo-800"
                            >
                              {source}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Search Terms */}
                  {aiAnalysis.verificationGuide.searchTerms && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Search className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-semibold text-indigo-900">
                          Search Terms
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.verificationGuide.searchTerms.map(
                          (term, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-indigo-100 border border-indigo-300 rounded-full text-xs font-medium text-indigo-900"
                            >
                              {term}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Key Questions */}
                  {aiAnalysis.verificationGuide.keyQuestionsToAsk && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-semibold text-indigo-900">
                          Key Questions to Ask
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {aiAnalysis.verificationGuide.keyQuestionsToAsk.map(
                          (question, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs text-indigo-800"
                            >
                              <span className="text-indigo-600 mt-0.5">•</span>
                              <span>{question}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Expert Domains */}
                  {aiAnalysis.verificationGuide.expertDomains && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <UserCheck className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-semibold text-indigo-900">
                          Expert Domains
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.verificationGuide.expertDomains.map(
                          (domain, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-purple-100 border border-purple-300 rounded-full text-xs font-medium text-purple-900"
                            >
                              {domain}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Verdicts Preview */}
            {claim.verdicts && claim.verdicts.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    External Fact-Check Reports ({claim.verdicts.length})
                  </h4>
                </div>
                <div className="space-y-3">
                  {claim.verdicts.slice(0, 3).map((verdict, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-semibold text-sm text-blue-900">
                          {verdict.source}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            verdict.rating?.toLowerCase().includes('false')
                              ? 'bg-red-100 text-red-800'
                              : verdict.rating?.toLowerCase().includes('true')
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {verdict.rating || verdict.textual_rating}
                        </span>
                      </div>
                      {verdict.review_url && (
                        <a
                          href={verdict.review_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Read Full Report
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                {claim.verdicts.length > 3 && (
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    +{claim.verdicts.length - 3} more report
                    {claim.verdicts.length - 3 !== 1 ? 's' : ''} available in
                    full view
                  </p>
                )}
              </div>
            )}

            {/* Analysis Metadata */}
            {aiAnalysis.analyzedAt && (
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                <span>
                  Analyzed: {new Date(aiAnalysis.analyzedAt).toLocaleString()}
                </span>
                {aiAnalysis.confidence && (
                  <span>AI Confidence: {aiAnalysis.confidence}%</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="border-t border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xs text-gray-500 font-mono">
            ID: {claim.claim_id}
          </span>
          <Button
            onClick={() => onViewDetails(claim.claim_id)}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            size="sm"
          >
            View Full Fact-Check Report
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
