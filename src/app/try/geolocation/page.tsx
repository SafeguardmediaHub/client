'use client';

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AnalysisDisclaimer } from '@/components/shared/AnalysisDisclaimer';
import { useAnonymousSession } from '@/components/try/AnonymousSessionContext';
import { ToolPageLayout } from '@/components/try/ToolPageLayout';
import { UploadZone } from '@/components/try/UploadZone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? '';

const IMAGE_ACCEPT =
  'image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/heic,image/heif';

interface GeoResult {
  fileName: string;
  claimedLocation: string;
  extractedCoordinates: { latitude: number; longitude: number } | null;
  match: { match: boolean; confidence: number; distance: number } | null;
  verdict: 'MATCH' | 'MISMATCH' | 'NO_GPS_DATA' | 'UNVERIFIABLE';
  confidence: number;
  summary: string;
}

const VERDICT_CONFIG = {
  MATCH: {
    label: 'Match',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50/60',
    border: 'border-emerald-200',
    Icon: CheckCircle2,
  },
  MISMATCH: {
    label: 'Mismatch',
    color: 'text-red-700',
    bg: 'bg-red-50/60',
    border: 'border-red-200',
    Icon: XCircle,
  },
  NO_GPS_DATA: {
    label: 'No GPS Data',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    Icon: MapPin,
  },
  UNVERIFIABLE: {
    label: 'Unverifiable',
    color: 'text-amber-700',
    bg: 'bg-amber-50/60',
    border: 'border-amber-200',
    Icon: AlertCircle,
  },
};

function ResultCard({
  result,
  triesRemaining,
  onSignup,
}: {
  result: GeoResult;
  triesRemaining: number;
  onSignup: () => void;
}) {
  const config = VERDICT_CONFIG[result.verdict];
  const { Icon } = config;
  const showConfidence =
    result.verdict !== 'NO_GPS_DATA' && result.verdict !== 'UNVERIFIABLE';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className={cn('border-b border-slate-100 px-6 py-5', config.bg)}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Icon className={cn('h-6 w-6', config.color)} />
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Verdict
              </div>
              <div className={cn('text-xl font-bold', config.color)}>
                {config.label}
              </div>
            </div>
          </div>
          {showConfidence && (
            <span
              className={cn(
                'rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                config.border,
                config.color,
                config.bg,
              )}
            >
              {result.confidence}% confidence
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <p className="text-sm leading-6 text-slate-700">{result.summary}</p>

        {result.extractedCoordinates && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="text-xs font-medium uppercase tracking-widest text-slate-400">
                Latitude
              </div>
              <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
                {result.extractedCoordinates.latitude.toFixed(4)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="text-xs font-medium uppercase tracking-widest text-slate-400">
                Longitude
              </div>
              <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
                {result.extractedCoordinates.longitude.toFixed(4)}
              </div>
            </div>
          </div>
        )}

        {result.match && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Distance from claimed location
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-900">
              {result.match.distance} km
            </div>
          </div>
        )}

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

export default function GeolocationPage() {
  const { meta, updateFromResponse, setShowSignupModal } =
    useAnonymousSession();
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = meta.triesRemaining > 0;
  const canSubmit = !!file && location.trim().length >= 2;

  async function handleAnalyze() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const form = new FormData();
    form.append('file', file!);
    form.append('claimedLocation', location.trim());

    try {
      const res = await fetch(`${BASE_URL}/api/anonymous/geolocation`, {
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
          Geolocation Verify
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Check whether an image's location data matches the claimed place.{' '}
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
          <UploadZone
            accept={IMAGE_ACCEPT}
            acceptLabel="JPEG, PNG, WebP, TIFF, HEIC"
            maxSizeMB={10}
            file={file}
            onChange={(f) => {
              setFile(f);
              setResult(null);
              setError(null);
            }}
            disabled={loading}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Claimed location
            </label>
            <Input
              placeholder="e.g. Paris, France"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
              className="rounded-xl border-slate-200 text-sm placeholder:text-slate-400 focus-visible:ring-blue-500/20"
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!canSubmit || loading}
            size="lg"
            className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying…
              </>
            ) : (
              'Verify Location'
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
