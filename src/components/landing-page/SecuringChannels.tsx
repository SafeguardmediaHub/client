"use client";

import {
  Building2,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  type LucideIcon,
  Newspaper,
  Scale,
  Shield,
} from "lucide-react";
import { useState } from "react";

type UseCase = {
  title: string;
  icon: LucideIcon;
  description: string;
  outcomes: string[];
  accent: string;
  surface: string;
};

const useCases: UseCase[] = [
  {
    title: "Newsrooms and investigators",
    icon: Newspaper,
    description:
      "Move faster on suspicious media, viral claims, and provenance questions without sacrificing review quality.",
    outcomes: [
      "Check AI-generated media before publication",
      "Trace claims and sources with supporting evidence",
      "Review authenticity and provenance signals",
    ],
    accent: "text-blue-700",
    surface: "from-blue-50 to-cyan-50",
  },
  {
    title: "Enterprise trust and security teams",
    icon: Building2,
    description:
      "Respond to impersonation, manipulated content, and internal trust incidents using one investigation workspace.",
    outcomes: [
      "Assess suspicious audio and video quickly",
      "Review tampering and authenticity signals",
      "Keep case context organized for escalation",
    ],
    accent: "text-violet-700",
    surface: "from-violet-50 to-fuchsia-50",
  },
  {
    title: "Researchers and educators",
    icon: GraduationCap,
    description:
      "Support media literacy, source verification, and evidence review with workflows that stay explainable.",
    outcomes: [
      "Compare claims with cited research outputs",
      "Teach provenance and verification concepts clearly",
      "Investigate digital media without black-box-only views",
    ],
    accent: "text-emerald-700",
    surface: "from-emerald-50 to-teal-50",
  },
  {
    title: "Legal, compliance, and public-interest teams",
    icon: Scale,
    description:
      "Work from structured results when media trust decisions carry reputational, regulatory, or legal consequences.",
    outcomes: [
      "Review evidence-backed outputs for cases",
      "Check content integrity and manipulation risk",
      "Preserve a clearer path from media to finding",
    ],
    accent: "text-amber-700",
    surface: "from-amber-50 to-orange-50",
  },
];

export default function SecuringChannels() {
  const [activeUseCase, setActiveUseCase] = useState(useCases[0]?.title);

  return (
    <section
      id="use-cases"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)] py-28"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#7aa6c90d_1px,transparent_1px),linear-gradient(to_bottom,#7aa6c90d_1px,transparent_1px)] bg-[size:18px_18px]" />
      <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-blue-100/35 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-slate-200/45 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <Shield className="h-4 w-4" />
              Built for high-trust work
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-[hsl(220,40%,15%)] md:text-6xl">
              The teams who need this most already know the cost of bad media.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Safeguardmedia Technologies is built for environments where media
              decisions need more than intuition and where evidence needs to be
              reviewed with care.
            </p>

            <div className="mt-10 rounded-[2rem] border border-slate-200 bg-[hsl(220,38%,16%)] p-7 text-white">
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                Shared requirement
              </div>
              <div className="mt-3 text-2xl font-semibold">
                Trust decisions need evidence, context, and usable outputs.
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-200">
                Teams evaluating suspicious media need more than a binary
                verdict. They need context, provenance, and structured outputs
                that support real review workflows.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              const isActive = activeUseCase === useCase.title;

              return (
                <button
                  key={useCase.title}
                  type="button"
                  onClick={() => setActiveUseCase(useCase.title)}
                  className={`w-full rounded-[1.75rem] border text-left transition-all duration-200 ${
                    isActive
                      ? `border-slate-200 bg-gradient-to-br ${useCase.surface} p-6 shadow-sm md:p-7`
                      : "border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 hover:bg-slate-50/80"
                  }`}
                >
                  {isActive ? (
                    <div className="flex flex-col gap-5 md:flex-row md:items-start">
                      <div className="flex items-center gap-4 md:w-48 md:flex-col md:items-start md:gap-4">
                        <div className="rounded-2xl bg-white p-3 shadow-sm">
                          <Icon className={`h-5 w-5 ${useCase.accent}`} />
                        </div>
                        <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-500">
                          Use case
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                            {useCase.title}
                          </h3>
                          <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                        </div>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-[0.95rem]">
                          {useCase.description}
                        </p>

                        <div className="mt-6 space-y-3">
                          {useCase.outcomes.map((outcome) => (
                            <div
                              key={outcome}
                              className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                              <span className="text-sm font-medium leading-7 text-slate-700">
                                {outcome}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="rounded-2xl bg-slate-100 p-3">
                          <Icon className={`h-5 w-5 ${useCase.accent}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-base font-semibold text-slate-900">
                            {useCase.title}
                          </div>
                          <p className="mt-1 truncate text-sm text-slate-500">
                            {useCase.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
