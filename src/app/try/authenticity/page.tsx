"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAnonymousSession } from "@/components/try/AnonymousSessionContext";
import { ToolPageLayout } from "@/components/try/ToolPageLayout";
import { UploadZone } from "@/components/try/UploadZone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "";

const ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/heic,image/heif,video/mp4,video/webm,video/quicktime,audio/mpeg,audio/wav,audio/m4a,audio/ogg";

interface AuthResult {
  fileName: string;
  fileSize: number;
  mimeType: string;
  integrity: {
    verdict: {
      status: string;
      confidence: number;
      summary: string;
    };
    flags: string[];
    recommendations: string;
  };
  tamperAnalysis: {
    summary: {
      confidence: number;
      confidenceLevel: string;
      riskAssessment: {
        level: string;
        description: string;
      };
    };
    details: {
      completeness: number;
      integrity: number;
      authenticity: number;
      missingFields: string[];
      suspiciousIndicators: string[];
    };
  };
  metadata: {
    analysis: {
      strippedMetadata: boolean;
      possibleTampering: boolean;
      integrityScore: number;
      completenessScore: number;
      authenticityScore: number;
      temporalAnomalies: string[];
      geolocationAnomalies: string[];
    };
    image?: {
      width: number;
      height: number;
    };
    temporal: {
      datesConsistent: boolean;
      inconsistencies: string[];
    };
  };
}

const STATUS_CONFIG = {
  authentic: {
    label: "Authentic",
    color: "text-emerald-700",
    bg: "bg-emerald-50/60",
    border: "border-emerald-200",
    Icon: CheckCircle2,
  },
  likely_authentic: {
    label: "Likely Authentic",
    color: "text-teal-700",
    bg: "bg-teal-50/60",
    border: "border-teal-200",
    Icon: CheckCircle2,
  },
  suspicious: {
    label: "Suspicious",
    color: "text-amber-700",
    bg: "bg-amber-50/60",
    border: "border-amber-200",
    Icon: AlertCircle,
  },
  likely_manipulated: {
    label: "Likely Manipulated",
    color: "text-orange-700",
    bg: "bg-orange-50/60",
    border: "border-orange-200",
    Icon: XCircle,
  },
  manipulated: {
    label: "Manipulated",
    color: "text-red-700",
    bg: "bg-red-50/60",
    border: "border-red-200",
    Icon: XCircle,
  },
} as const;

function ResultCard({
  result,
  triesRemaining,
  onSignup,
}: {
  result: AuthResult;
  triesRemaining: number;
  onSignup: () => void;
}) {
  const statusKey = result.integrity.verdict
    .status as keyof typeof STATUS_CONFIG;
  const config = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.suspicious;
  const { Icon } = config;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className={cn("border-b border-slate-100 px-6 py-5", config.bg)}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Icon className={cn("h-6 w-6", config.color)} />
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Verdict
              </div>
              <div className={cn("text-xl font-bold", config.color)}>
                {config.label}
              </div>
            </div>
          </div>
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
              config.border,
              config.color,
              config.bg,
            )}
          >
            {result.integrity.verdict.confidence}% confidence
          </span>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <p className="text-sm leading-6 text-slate-600">
          {result.integrity.verdict.summary}
        </p>

        {/* Scores grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Integrity", value: result.tamperAnalysis.details.integrity },
            { label: "Authenticity", value: result.tamperAnalysis.details.authenticity },
            { label: "Completeness", value: result.tamperAnalysis.details.completeness },
          ].map(({ label, value }) => {
            const pct = Math.round(value * 100);
            const color =
              pct >= 70 ? "text-emerald-600" : pct >= 40 ? "text-amber-600" : "text-red-600";
            const bar =
              pct >= 70 ? "bg-emerald-400" : pct >= 40 ? "bg-amber-400" : "bg-red-400";
            return (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                <div className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  {label}
                </div>
                <div className={cn("mt-1 text-xl font-bold", color)}>{pct}%</div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className={cn("h-full rounded-full", bar)} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Risk assessment */}
        {result.tamperAnalysis.summary.riskAssessment && (
          <div className={cn(
            "rounded-xl border px-4 py-3",
            result.tamperAnalysis.summary.riskAssessment.level === "High"
              ? "border-red-100 bg-red-50/50"
              : result.tamperAnalysis.summary.riskAssessment.level === "Medium"
                ? "border-amber-100 bg-amber-50/50"
                : "border-emerald-100 bg-emerald-50/50",
          )}>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Risk Assessment
              </div>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                result.tamperAnalysis.summary.riskAssessment.level === "High"
                  ? "bg-red-100 text-red-700"
                  : result.tamperAnalysis.summary.riskAssessment.level === "Medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700",
              )}>
                {result.tamperAnalysis.summary.riskAssessment.level}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-700">
              {result.tamperAnalysis.summary.riskAssessment.description}
            </p>
          </div>
        )}

        {/* Flags */}
        {result.integrity.flags.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Findings
            </div>
            <ul className="space-y-2">
              {result.integrity.flags.map((flag, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span className="text-sm text-slate-700">{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suspicious indicators */}
        {result.tamperAnalysis.details.suspiciousIndicators.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Suspicious Indicators
            </div>
            <ul className="space-y-2">
              {result.tamperAnalysis.details.suspiciousIndicators.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3"
                >
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <span className="text-sm text-red-800">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing metadata fields */}
        {result.tamperAnalysis.details.missingFields.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Missing Metadata
            </div>
            <div className="flex flex-wrap gap-2">
              {result.tamperAnalysis.details.missingFields.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-xs text-slate-600"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* File info row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          {result.metadata.analysis.strippedMetadata && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-600">
              Metadata stripped
            </span>
          )}
          {result.metadata.image && (
            <span className="font-mono">
              {result.metadata.image.width}×{result.metadata.image.height}px
            </span>
          )}
          <span>{(result.fileSize / 1024).toFixed(1)} KB</span>
          <span className="uppercase">{result.mimeType.split("/")[1]}</span>
          {result.metadata.temporal.datesConsistent ? (
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Timestamps consistent
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="h-3.5 w-3.5" /> Timestamp anomalies
            </span>
          )}
        </div>

        {/* Recommendation */}
        {result.integrity.recommendations && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-500">
              Recommendation
            </div>
            <p className="text-sm leading-6 text-slate-700">
              {result.integrity.recommendations}
            </p>
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

export default function AuthenticityPage() {
  const { meta, updateFromResponse, setShowSignupModal } =
    useAnonymousSession();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuthResult | null>(null);
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
      const res = await fetch(`${BASE_URL}/api/anonymous/authenticity`, {
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
          Authenticity Check
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Analyse file metadata integrity — detect editing traces, timestamp
          anomalies, and GPS inconsistencies.
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
            accept={ACCEPT}
            acceptLabel="Images, Video, Audio"
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
                Analyzing…
              </>
            ) : (
              "Analyze"
            )}
          </Button>

          {result && (
            <ResultCard
              result={result}
              triesRemaining={meta.triesRemaining}
              onSignup={() => setShowSignupModal(true)}
            />
          )}
        </div>
      )}
    </ToolPageLayout>
  );
}
