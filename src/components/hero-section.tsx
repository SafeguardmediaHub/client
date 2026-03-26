"use client";

import { ArrowRight, CheckCircle2, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { useAuth } from "@/context/AuthContext";
import { HeroHeader } from "./header";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.28,
        duration: 1.2,
      },
    },
  },
};

const capabilityChips = [
  "AI media detection",
  "Authenticity and C2PA",
  "Claim research",
  "Forensic verification",
];

const workflowItems = [
  {
    title: "Choose the right workflow",
    detail:
      "AI media detection, authenticity, reverse lookup, or claim research.",
  },
  {
    title: "Review evidence, not just verdicts",
    detail:
      "Confidence, provenance, citations, and supporting context stay in one place.",
  },
  {
    title: "Move from upload to investigation fast",
    detail:
      "Designed for teams handling trust-sensitive content under time pressure.",
  },
];

const liveSignals = [
  "AI-generated media detection",
  "Content authenticity checks",
  "Fact-checking and research",
];

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <HeroHeader />
      <main className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f6fbff_54%,#ffffff_100%)]">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-14rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-300/25 blur-3xl" />
          <div className="absolute left-[8%] top-40 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
          <div className="absolute bottom-0 right-[6%] h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#7aa6c90d_1px,transparent_1px),linear-gradient(to_bottom,#7aa6c90d_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>

        <section className="relative pb-20 pt-28 md:pb-28 md:pt-40">
          <div className="mx-auto max-w-7xl px-6">
            <div>
              <div className="mx-auto max-w-6xl text-center">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href={
                      isAuthenticated
                        ? "/dashboard/ai-media-detection"
                        : "/auth/signup"
                    }
                    className="group inline-flex w-fit items-center gap-3 rounded-full border border-blue-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      Live now: AI Media Detection and content authenticity
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-8 max-w-6xl text-balance text-5xl font-bold tracking-tight leading-[0.96] text-[hsl(220,40%,14%)] md:text-7xl xl:text-[5.9rem]"
                >
                  Investigate digital content before it becomes a trust problem.
                </TextEffect>

                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.4}
                  as="p"
                  className="mx-auto mt-8 max-w-3xl text-balance text-lg leading-8 text-slate-600"
                >
                  Safeguardmedia Technologies gives trust and investigations
                  teams one place to detect AI-generated media, verify
                  provenance, and review evidence-backed results with speed.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.7,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl bg-blue-600 px-8 py-6 text-base text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700"
                  >
                    <Link
                      href={isAuthenticated ? "/dashboard" : "/auth/signup"}
                    >
                      Get Started
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-xl border-slate-300 px-8 text-base text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <Link href="#platform">Explore the Platform</Link>
                  </Button>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={transitionVariants}
                  className="mt-10 flex flex-wrap justify-center gap-3"
                >
                  {capabilityChips.map((chip) => (
                    <div
                      key={chip}
                      className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
                    >
                      {chip}
                    </div>
                  ))}
                </AnimatedGroup>
              </div>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.06,
                        delayChildren: 0.8,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="relative mt-16"
              >
                <div className="absolute inset-x-12 top-12 -z-10 h-72 rounded-full bg-blue-400/20 blur-3xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Investigation Workspace
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        Safeguardmedia Technologies
                      </div>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Live product
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            Workflow snapshot
                          </div>
                          <div className="text-sm text-slate-500">
                            From selection to verdict
                          </div>
                        </div>
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="mt-5 space-y-4">
                        {workflowItems.map((item, index) => (
                          <div
                            key={item.title}
                            className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">
                                {item.title}
                              </div>
                              <p className="mt-1 text-sm leading-6 text-slate-600">
                                {item.detail}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[1.5rem] border border-blue-700 bg-blue-600 p-5 text-white shadow-lg shadow-blue-500/20">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold">
                            AI media detection
                          </div>
                          <div className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
                            Result sample
                          </div>
                        </div>
                        <div className="mt-5 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                          <div className="text-xs uppercase tracking-[0.16em] text-blue-100">
                            Verdict
                          </div>
                          <div className="mt-2 text-3xl font-semibold">
                            Likely AI-Generated
                          </div>
                          <div className="mt-4 flex items-end justify-between">
                            <div>
                              <div className="text-xs text-blue-100">
                                Confidence
                              </div>
                              <div className="text-2xl font-semibold">94%</div>
                            </div>
                            <div>
                              <div className="text-xs text-blue-100">
                                Media type
                              </div>
                              <div className="text-lg font-medium">Video</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                        <div className="text-sm font-semibold text-slate-900">
                          Live verification coverage
                        </div>
                        <div className="mt-4 space-y-3">
                          {liveSignals.map((signal) => (
                            <div
                              key={signal}
                              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3"
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm font-medium text-slate-700">
                                {signal}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
