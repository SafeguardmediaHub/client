"use client";

import { AlertCircle, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnalysisDisclaimer } from "@/components/shared/AnalysisDisclaimer";
import { useAnonymousSession } from "@/components/try/AnonymousSessionContext";
import { ToolPageLayout } from "@/components/try/ToolPageLayout";
import { UploadZone } from "@/components/try/UploadZone";
import { Button } from "@/components/ui/button";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "";

const IMAGE_ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/heic,image/heif";

interface ReverseMatch {
  title: string;
  url: string;
  thumbnail?: string;
  source: string;
  position: number;
}

interface ReverseResult {
  totalMatches: number;
  matches: ReverseMatch[];
  searchedAt: string;
  engine: string;
}

function ResultCard({
  result,
  triesRemaining,
  onSignup,
}: {
  result: ReverseResult;
  triesRemaining: number;
  onSignup: () => void;
}) {
  const VISIBLE = 10;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Results
            </div>
            <div className="mt-1 text-xl font-bold text-slate-900">
              Found in{" "}
              <span className="text-blue-600">{result.totalMatches}</span>{" "}
              location{result.totalMatches !== 1 ? "s" : ""} online
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-6">
        {result.matches.slice(0, VISIBLE).map((match, i) => (
          <a
            key={i}
            href={match.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
          >
            {match.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={match.thumbnail}
                alt=""
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-slate-900">
                {match.title}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                <span className="font-medium text-slate-500">
                  {match.source}
                </span>
                <span>·</span>
                <span className="truncate text-blue-500">{match.url}</span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-300" />
          </a>
        ))}

        {result.totalMatches > VISIBLE && (
          <p className="pt-1 text-center text-xs text-slate-400">
            Showing {VISIBLE} of {result.totalMatches} matches.{" "}
            <span className="text-blue-500">Sign up to see all results.</span>
          </p>
        )}

        {triesRemaining === 0 && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-center">
            <p className="text-sm font-medium text-blue-900">
              You&apos;ve seen what SafeGuard can find. Sign up to save this
              report and run unlimited searches.
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

export default function ReverseLookupPage() {
  const { meta, updateFromResponse, setShowSignupModal } =
    useAnonymousSession();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReverseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = meta.triesRemaining > 0;

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/api/anonymous/reverse-lookup`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 403 && json.details?.anonymous?.requiresSignup) {
          setShowSignupModal(true);
          return;
        }
        setError(json.message ?? "Something went wrong.");
        return;
      }

      if (json.anonymous) updateFromResponse(json.anonymous);
      setResult(json.data);
    } catch {
      setError("Network error. Check your connection and try again.");
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
          Reverse Lookup
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Find where an image appears across the web using Google Vision web
          detection.
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
            acceptLabel="JPEG, PNG, WebP, GIF, TIFF, HEIC"
            maxSizeMB={10}
            file={file}
            onChange={(f) => { setFile(f); setResult(null); setError(null); }}
            disabled={loading}
          />

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
                Searching…
              </>
            ) : (
              "Search Web"
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
