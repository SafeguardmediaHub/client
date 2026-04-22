'use client';

import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  ExternalLink,
  Loader2,
  Scale,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AnalysisDisclaimer } from '@/components/shared/AnalysisDisclaimer';
import { useAnonymousSession } from '@/components/try/AnonymousSessionContext';
import { ToolPageLayout } from '@/components/try/ToolPageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? '';

interface FactCheckVerdict {
  source: string;
  rating: string;
  textual_rating: string;
  review_url: string;
  reviewed_at?: string;
}

interface FactCheckResult {
  resultId: string;
  feature: 'FACT_CHECK';
  claimText: string;
  verdictsFound: number;
  verdicts: FactCheckVerdict[];
  message?: string;
  processingTimeMs: number;
}

function getRatingClasses(rating: string) {
  const normalized = rating.trim().toLowerCase();

  if (normalized.includes('true')) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }

  if (normalized.includes('false')) {
    return 'border-red-200 bg-red-50 text-red-700';
  }

  if (normalized.includes('misleading')) {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }

  if (normalized.includes('mixed')) {
    return 'border-orange-200 bg-orange-50 text-orange-700';
  }

  if (normalized.includes('unverifiable')) {
    return 'border-slate-200 bg-slate-100 text-slate-700';
  }

  return 'border-blue-200 bg-blue-50 text-blue-700';
}

function ResultCard({
  result,
  triesRemaining,
  onSignup,
}: {
  result: FactCheckResult;
  triesRemaining: number;
  onSignup: () => void;
}) {
  const verdicts = useMemo(
    () =>
      [...result.verdicts].sort((a, b) => {
        if (!a.reviewed_at && !b.reviewed_at) return 0;
        if (!a.reviewed_at) return 1;
        if (!b.reviewed_at) return -1;

        return (
          new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime()
        );
      }),
    [result.verdicts],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Claim
            </div>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {result.claimText}
            </p>
          </div>
          <div className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            {result.verdictsFound} verdict
            {result.verdictsFound !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        {result.verdictsFound > 0 ? (
          <>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Result
              </div>
              <p className="mt-1 text-sm font-medium text-emerald-900">
                Found {result.verdictsFound} published fact-check verdict
                {result.verdictsFound !== 1 ? 's' : ''}.
              </p>
            </div>

            <div className="space-y-3">
              {verdicts.map((verdict, index) => (
                <a
                  key={`${verdict.source}-${verdict.review_url}-${index}`}
                  href={verdict.review_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {verdict.source}
                        </span>
                        <span
                          className={cn(
                            'rounded-full border px-2.5 py-1 text-xs font-semibold',
                            getRatingClasses(verdict.rating),
                          )}
                        >
                          {verdict.rating}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium text-slate-900">
                        {verdict.textual_rating}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        {verdict.reviewed_at && (
                          <span>
                            Reviewed{' '}
                            {new Date(verdict.reviewed_at).toLocaleDateString(
                              'en-GB',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              },
                            )}
                          </span>
                        )}
                        <span className="truncate text-blue-500">
                          {verdict.review_url}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                  </div>
                </a>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-700">
              <AlertCircle className="h-3.5 w-3.5" />
              No published verdict found
            </div>
            <p className="text-sm leading-6 text-amber-900">
              {result.message ??
                'This claim has not been fact-checked by any known sources yet.'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
          <span>Curated fact-check databases</span>
          <span>
            Processed in {(result.processingTimeMs / 1000).toFixed(1)}s
          </span>
        </div>

        {triesRemaining === 0 && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-center">
            <p className="text-sm font-medium text-blue-900">
              Sign up to save this result
            </p>
            <p className="mt-0.5 text-xs text-blue-600">
              Create a free account to keep your verification history
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

export default function FactCheckPage() {
  const { meta, updateFromResponse, setShowSignupModal } =
    useAnonymousSession();
  const [claim, setClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze =
    meta.mode === "authenticated"
      ? meta.analysesRemaining > 0 && !meta.requiresUpgrade
      : meta.triesRemaining > 0;
  const claimLen = claim.trim().length;
  const isValid = claimLen >= 50 && claimLen <= 500;

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
      const res = await fetch(`${BASE_URL}/api/anonymous/fact-check`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim_text: claim.trim() }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 403 && json.details?.anonymous?.requiresSignup) {
          setShowSignupModal(true);
          return;
        }

        if (res.status === 429) {
          setError(
            json.message ??
              'Daily fact-check quota exceeded. Please try again later.',
          );
          return;
        }

        setError(json.message ?? json.error ?? 'Something went wrong.');
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
          Fact Check
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Find out whether trusted fact-checkers have already reviewed the
          claim.
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
              placeholder="Enter one specific claim to check against published fact-check verdicts."
              value={claim}
              onChange={(e) => updateClaim(e.target.value)}
              onInput={(e) => updateClaim(e.currentTarget.value)}
              rows={5}
              disabled={loading}
              className="resize-none rounded-2xl border-slate-200 text-sm placeholder:text-slate-400 focus-visible:ring-blue-500/20"
            />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-xs text-slate-400">50–500 characters</span>
              <span
                className={cn(
                  'text-xs',
                  claimLen > 500 ? 'text-red-500' : 'text-slate-400',
                )}
              >
                {claimLen}/500
              </span>
            </div>
          </div>

          {claimLen >= 50 && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              <div className="flex items-center gap-2 font-medium">
                <Scale className="h-4 w-4" />
                Best for claims that may already have a published ruling
              </div>
              <p className="mt-1 text-xs text-blue-700">
                Use claim research when you want broader web evidence. Use fact
                check when you want existing verdicts from professional
                fact-checking outlets.
              </p>
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
                Checking…
              </>
            ) : (
              <>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Check Claim
              </>
            )}
          </Button>

          {result && (
            <ResultCard
              result={result}
              triesRemaining={meta.mode === "anonymous" ? meta.triesRemaining : 0}
              onSignup={() => setShowSignupModal(true)}
            />
          )}
          {result && <AnalysisDisclaimer />}
        </div>
      )}
    </ToolPageLayout>
  );
}
