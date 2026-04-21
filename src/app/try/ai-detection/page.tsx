'use client';

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Info,
  Loader2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AnalysisDisclaimer } from '@/components/shared/AnalysisDisclaimer';
import { useAnonymousSession } from '@/components/try/AnonymousSessionContext';
import { ToolPageLayout } from '@/components/try/ToolPageLayout';
import { UploadZone } from '@/components/try/UploadZone';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { getVerdictLabel } from '@/lib/verdict';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? '';

const IMAGE_ACCEPT =
  'image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/heic,image/heif';
const VIDEO_ACCEPT =
  'video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska,video/mpeg';

interface DeepfakeResult {
  isDeepfake: boolean;
  // API returns 0–100 scale (e.g. 99.9), not 0–1
  confidenceScore: number;
  deepfake_probability: number;
  real_probability: number;
  predictedClass: string;
  riskScore: number;
  safeguard_analysis: {
    interpretation: string;
    risk_level: string;
  };
  imageQuality?: {
    resolution: string;
    clarity: number;
    noise: number;
    compression: number;
  };
  fileName: string;
  fileSize: number;
  mediaType: string;
  processingTimeMs: number;
}

function RiskBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    High: 'border-red-200 bg-red-50 text-red-700',
    Medium: 'border-amber-200 bg-amber-50 text-amber-700',
    Low: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  };
  return (
    <span
      className={cn(
        'rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        map[level] ?? map.Medium,
      )}
    >
      {level} Risk
    </span>
  );
}

// value is already 0–100
function ProbabilityBar({
  deepfakePct,
  realPct,
}: {
  deepfakePct: number;
  realPct: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Real</span>
        <span>Deepfake</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="flex h-full">
          <div
            className="h-full bg-emerald-400 transition-all duration-700"
            style={{ width: `${realPct}%` }}
          />
          <div
            className="h-full bg-red-400 transition-all duration-700"
            style={{ width: `${deepfakePct}%` }}
          />
        </div>
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-slate-500">
        <span className="font-semibold text-emerald-600">
          {realPct.toFixed(1)}%
        </span>
        <span className="font-semibold text-red-600">
          {deepfakePct.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function QualityBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-700">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-400 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ResultCard({
  result,
  triesRemaining,
  onSignup,
}: {
  result: DeepfakeResult;
  triesRemaining: number;
  onSignup: () => void;
}) {
  const { isDeepfake } = result;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Verdict header */}
      <div
        className={cn(
          'border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5',
          isDeepfake ? 'bg-red-50/60' : 'bg-emerald-50/60',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {isDeepfake ? (
              <XCircle className="h-6 w-6 shrink-0 text-red-500" />
            ) : (
              <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Verdict
              </div>
              <div
                className={cn(
                  'truncate text-lg font-bold sm:text-xl',
                  isDeepfake ? 'text-red-700' : 'text-emerald-700',
                )}
              >
                {getVerdictLabel(result.predictedClass)}
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <RiskBadge level={result.safeguard_analysis.risk_level} />
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        {/* Interpretation */}
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-sm leading-6 text-slate-600">
            {result.safeguard_analysis.interpretation}
          </p>
        </div>

        {/* Probability split bar */}
        <ProbabilityBar
          realPct={result.real_probability}
          deepfakePct={result.deepfake_probability}
        />

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-2.5 py-2.5 sm:px-3 sm:py-3">
            <div className="text-[10px] font-medium uppercase tracking-widest text-slate-400 sm:text-xs">
              Confidence
            </div>
            <div className="mt-1 text-base font-bold text-slate-900 sm:text-xl">
              {result.confidenceScore.toFixed(1)}%
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-2.5 py-2.5 sm:px-3 sm:py-3">
            <div className="text-[10px] font-medium uppercase tracking-widest text-slate-400 sm:text-xs">
              Risk Score
            </div>
            <div className="mt-1 text-base font-bold text-slate-900 sm:text-xl">
              {result.riskScore.toFixed(1)}
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-2.5 py-2.5 sm:px-3 sm:py-3">
            <div className="text-[10px] font-medium uppercase tracking-widest text-slate-400 sm:text-xs">
              Time
            </div>
            <div className="mt-1 text-base font-bold text-slate-900 sm:text-xl">
              {(result.processingTimeMs / 1000).toFixed(1)}s
            </div>
          </div>
        </div>

        {/* Image quality (image only) */}
        {result.imageQuality?.resolution && (
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Image Quality
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                {result.imageQuality.resolution}
              </span>
            </div>
            <div className="space-y-2.5">
              <QualityBar label="Clarity" value={result.imageQuality.clarity} />
              <QualityBar label="Noise" value={result.imageQuality.noise} />
              <QualityBar
                label="Compression"
                value={result.imageQuality.compression}
              />
            </div>
          </div>
        )}

        {triesRemaining === 0 && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-center">
            <p className="text-sm font-medium text-blue-900">
              Sign up to save this result
            </p>
            <p className="mt-0.5 text-xs text-blue-600">
              Create a free account to keep all your analyses
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

export default function DeepfakePage() {
  const { meta, updateFromResponse, setShowSignupModal } =
    useAnonymousSession();
  const [tab, setTab] = useState<'image' | 'video'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeepfakeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze =
    meta.mode === "authenticated"
      ? meta.analysesRemaining > 0 && !meta.requiresUpgrade
      : meta.triesRemaining > 0;

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const form = new FormData();
    form.append('file', file);

    const endpoint =
      tab === 'image'
        ? `${BASE_URL}/api/anonymous/deepfake/image`
        : `${BASE_URL}/api/anonymous/deepfake/video`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: form,
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 403 && json.details?.anonymous?.requiresSignup) {
          setShowSignupModal(true);
          return;
        }
        if (res.status === 400 && json.data?.upgradeRequired) {
          setError(
            'Video exceeds 60-second limit for free analysis. Sign up for full video support.',
          );
          return;
        }
        setError(json.error ?? json.message ?? 'Something went wrong.');
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

  function handleTabChange(value: string) {
    setTab(value as 'image' | 'video');
    setFile(null);
    setResult(null);
    setError(null);
  }

  return (
    <ToolPageLayout>
      <Link
        href="/try"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 sm:mb-6 lg:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tools
      </Link>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          AI Media Detection
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Check if an image or short video may be AI-generated or manipulated.
        </p>
      </div>

      {!canAnalyze ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center sm:p-8">
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
          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList className="rounded-xl border border-slate-200 bg-slate-50 p-1">
              <TabsTrigger value="image" className="rounded-lg text-sm">
                Image
              </TabsTrigger>
              <TabsTrigger value="video" className="rounded-lg text-sm">
                Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="mt-4">
              <UploadZone
                accept={IMAGE_ACCEPT}
                acceptLabel="JPEG, PNG, WebP, GIF, TIFF, HEIC"
                maxSizeMB={10}
                file={file}
                onChange={(f) => {
                  setFile(f);
                  setResult(null);
                  setError(null);
                }}
                disabled={loading}
              />
            </TabsContent>

            <TabsContent value="video" className="mt-4 space-y-2">
              <UploadZone
                accept={VIDEO_ACCEPT}
                acceptLabel="MP4, WebM, MOV, AVI, MKV"
                maxSizeMB={100}
                file={file}
                onChange={(f) => {
                  setFile(f);
                  setResult(null);
                  setError(null);
                }}
                disabled={loading}
              />
              <p className="flex items-center gap-1.5 text-xs text-slate-400">
                <Info className="h-3.5 w-3.5" />
                Free analysis limited to videos under 60 seconds
              </p>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!file || loading}
            size="lg"
            className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              'Analyze'
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
