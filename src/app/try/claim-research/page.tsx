'use client';

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AnalysisDisclaimer } from '@/components/shared/AnalysisDisclaimer';
import { useAnonymousSession } from '@/components/try/AnonymousSessionContext';
import { ToolPageLayout } from '@/components/try/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? '';

interface SearchResult {
  source: string;
  title: string;
  snippet: string;
  link: string;
  date?: string;
  relevance_score: number;
}

interface ClaimResult {
  claimText: string;
  synthesis: {
    summary: string;
    evidence_assessment: {
      supporting: number;
      contradicting: number;
      neutral: number;
    };
    confidence: number;
    key_findings: string[];
    contradictions: string[];
    limitations: string[];
    suggested_next_steps: string[];
  };
  searchResults: SearchResult[];
  searchResultCount: number;
  fromCache: boolean;
  processingTimeMs: number;
}

function ConfidencePill({ value }: { value: number }) {
  const style =
    value >= 70
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : value >= 40
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-red-200 bg-red-50 text-red-700';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold',
        style,
      )}
    >
      {value}% confidence
    </span>
  );
}

function ResultCard({
  result,
  triesRemaining,
  onSignup,
}: {
  result: ClaimResult;
  triesRemaining: number;
  onSignup: () => void;
}) {
  const { synthesis } = result;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Claim
            </div>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {result.claimText}
            </p>
          </div>
          {result.fromCache && (
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              Cached
            </span>
          )}
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <ConfidencePill value={synthesis.confidence} />

        <p className="text-sm leading-7 text-slate-700">{synthesis.summary}</p>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            {
              label: 'Supporting',
              value: synthesis.evidence_assessment.supporting,
              Icon: TrendingUp,
              color: 'text-emerald-600',
            },
            {
              label: 'Contradicting',
              value: synthesis.evidence_assessment.contradicting,
              Icon: TrendingDown,
              color: 'text-red-600',
            },
            {
              label: 'Neutral',
              value: synthesis.evidence_assessment.neutral,
              Icon: Minus,
              color: 'text-slate-500',
            },
          ].map(({ label, value, Icon, color }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center sm:p-3"
            >
              <Icon className={cn('mx-auto mb-1 h-4 w-4', color)} />
              <div className="text-xl font-bold text-slate-900 sm:text-2xl">
                {value}
              </div>
              <div className="truncate text-[10px] text-slate-400 sm:text-xs">
                {label}
              </div>
            </div>
          ))}
        </div>

        {synthesis.key_findings.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Key Findings
            </div>
            <ul className="space-y-2">
              {synthesis.key_findings.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-sm text-slate-700">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {synthesis.contradictions.length > 0 && (
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-600">
              Contradictions
            </div>
            <ul className="space-y-1.5">
              {synthesis.contradictions.map((c, i) => (
                <li key={i} className="text-sm text-amber-900">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {synthesis.limitations.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Limitations
            </div>
            <ul className="space-y-1.5">
              {synthesis.limitations.map((l, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-slate-500"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sources searched */}
        {result.searchResults.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Sources searched
              </div>
              <span className="text-xs text-slate-400">
                {result.searchResultCount} result
                {result.searchResultCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {result.searchResults.map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 transition-colors hover:border-slate-200 hover:bg-white"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                        {s.source}
                      </span>
                      {s.date && (
                        <span className="text-xs text-slate-400">
                          {new Date(s.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 truncate text-sm font-medium text-slate-800">
                      {s.title}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-500">
                      {s.snippet}
                    </p>
                  </div>
                  <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-300" />
                </a>
              ))}
            </div>
          </div>
        )}

        {synthesis.suggested_next_steps.length > 0 && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-500">
              Suggested next steps
            </div>
            <ul className="space-y-1.5">
              {synthesis.suggested_next_steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                  <span className="text-sm text-blue-800">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-right text-xs text-slate-400">
          Processed in {(result.processingTimeMs / 1000).toFixed(1)}s
        </div>

        {triesRemaining === 0 && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-center">
            <p className="text-sm font-medium text-blue-900">
              Sign up to save this result
            </p>
            <Button
              size="sm"
              className="mt-3 bg-blue-600 text-white hover:bg-blue-700"
              onClick={onSignup}
            >
              Create free account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClaimResearchPage() {
  const { meta, updateFromResponse, setShowSignupModal } =
    useAnonymousSession();
  const [claim, setClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = meta.triesRemaining > 0;
  const claimLen = claim.trim().length;
  const isValid = claimLen >= 10 && claimLen <= 1000;

  const updateClaim = (value: string) => {
    setClaim(value);
    setResult(null);
    setError(null);
  };

  async function handleAnalyze() {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${BASE_URL}/api/anonymous/claim-research`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: claim.trim() }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 403 && json.details?.anonymous?.requiresSignup) {
          setShowSignupModal(true);
          return;
        }
        setError(json.message ?? 'Something went wrong.');
        return;
      }

      if (json.anonymous) updateFromResponse(json.anonymous);
      setResult(json.data);
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageLayout>
      <Link
        href="/try"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 lg:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tools
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Claim Research
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Explore whether a claim is supported by credible sources and available
          evidence.
        </p>
      </div>

      {!canAnalyze ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-600">
            You&apos;ve used all 3 free analyses.
          </p>
          <Button
            className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setShowSignupModal(true)}
          >
            Sign up to continue
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <Textarea
              placeholder="e.g. The Eiffel Tower was built in 1887."
              value={claim}
              onChange={(e) => updateClaim(e.target.value)}
              onInput={(e) => updateClaim(e.currentTarget.value)}
              rows={4}
              disabled={loading}
              className="resize-none rounded-2xl border-slate-200 text-sm placeholder:text-slate-400 focus-visible:ring-blue-500/20"
            />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-xs text-slate-400">10–1000 characters</span>
              <span
                className={cn(
                  'text-xs',
                  claimLen > 1000 ? 'text-red-500' : 'text-slate-400',
                )}
              >
                {claimLen}/1000
              </span>
            </div>
          </div>

          {/* Context quality cue — updates as user types */}
          {claimLen >= 10 && (
            <div
              className={cn(
                'rounded-xl border px-4 py-3 text-sm transition-colors',
                claimLen >= 120
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : claimLen >= 60
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">
                  {claimLen >= 120
                    ? "Good detail — you'll get a thorough result"
                    : claimLen >= 60
                      ? 'Adding more context improves accuracy'
                      : 'Try adding more detail for a stronger result'}
                </span>
                <span className="shrink-0 text-xs font-semibold opacity-70">
                  {claimLen >= 120
                    ? 'Strong'
                    : claimLen >= 60
                      ? 'Moderate'
                      : 'Basic'}
                </span>
              </div>
              {claimLen < 120 && (
                <p className="mt-1 text-xs opacity-75">
                  {claimLen < 60
                    ? 'Include who, when, or where — e.g. "The Eiffel Tower was built in 1887 for the Paris World\'s Fair."'
                    : 'You can add a date, location, or source to help narrow the search.'}
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!isValid || loading}
            size="lg"
            className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Researching…
              </>
            ) : (
              'Research Claim'
            )}
          </Button>

          {result && (
            <ResultCard
              result={result}
              triesRemaining={meta.triesRemaining}
              onSignup={() => setShowSignupModal(true)}
            />
          )}
          {result && <AnalysisDisclaimer />}
        </div>
      )}
    </ToolPageLayout>
  );
}
