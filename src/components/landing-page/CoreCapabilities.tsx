"use client";

import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  type LucideIcon,
  MapPin,
  MessageSquareText,
  ScanEye,
  Search,
  Shield,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import SmoothScrollLink from "@/components/landing-page/SmoothScrollLink";
import { Button } from "@/components/ui/button";
import { createLandingMotion, landingViewport } from "@/lib/landing-motion";

type Capability = {
  title: string;
  description: string;
  icon: LucideIcon;
  status: string;
  accent: string;
  surface: string;
  href: string;
};

const availableNow: Capability[] = [
  {
    title: "AI Media Detection",
    description:
      "Detect AI-generated images, audio, and video from a dedicated analysis workspace.",
    icon: Shield,
    status: "Live now",
    accent: "text-blue-700",
    surface: "from-blue-50 to-cyan-50",
    href: "/try/ai-detection",
  },
  {
    title: "Authenticity and C2PA",
    description:
      "Review content credentials, provenance, and authenticity signals in one flow.",
    icon: CheckCircle2,
    status: "Live now",
    accent: "text-emerald-700",
    surface: "from-emerald-50 to-teal-50",
    href: "/try/authenticity",
  },
  {
    title: "Claim Research",
    description:
      "Investigate claims with cited web research and structured supporting evidence.",
    icon: MessageSquareText,
    status: "Live now",
    accent: "text-sky-700",
    surface: "from-sky-50 to-blue-50",
    href: "/try/claim-research",
  },
  {
    title: "Tamper Detection",
    description:
      "Check for signs of manipulation, forensic inconsistencies, and integrity risks.",
    icon: ScanEye,
    status: "Live now",
    accent: "text-violet-700",
    surface: "from-violet-50 to-fuchsia-50",
    href: "/try/authenticity",
  },
  {
    title: "Reverse Image Search",
    description:
      "Trace earlier uses of media across the web to recover context and provenance.",
    icon: Search,
    status: "Live now",
    accent: "text-teal-700",
    surface: "from-teal-50 to-emerald-50",
    href: "/try/reverse-lookup",
  },
  {
    title: "Geolocation Verify",
    description:
      "Compare embedded GPS metadata against a claimed place to catch location mismatches fast.",
    icon: MapPin,
    status: "Live now",
    accent: "text-amber-700",
    surface: "from-amber-50 to-orange-50",
    href: "/try/geolocation",
  },
  {
    title: "Fact Checking",
    description:
      "See whether trusted publishers have already investigated and ruled on a claim.",
    icon: BadgeCheck,
    status: "Live now",
    accent: "text-rose-700",
    surface: "from-rose-50 to-pink-50",
    href: "/try/fact-check",
  },
];

export default function CoreCapabilities() {
  const reducedMotion = useReducedMotion();
  const motionSet = createLandingMotion(Boolean(reducedMotion));

  return (
    <section
      id="platform"
      className="relative overflow-hidden scroll-mt-28 bg-white py-28 lg:scroll-mt-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#7aa6c90d_1px,transparent_1px),linear-gradient(to_bottom,#7aa6c90d_1px,transparent_1px)] bg-[size:18px_18px]" />
      <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute bottom-0 right-[12%] h-80 w-80 rounded-full bg-cyan-100/35 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={landingViewport}
            variants={motionSet.stagger}
            className="max-w-xl"
          >
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Platform overview
            </div>
            <motion.h2
              variants={motionSet.sectionIntro}
              className="mt-6 text-4xl font-bold tracking-tight text-[hsl(220,40%,15%)] md:text-6xl"
            >
              What teams can do in the platform right now.
            </motion.h2>
            <motion.p
              variants={motionSet.item}
              className="mt-6 text-lg leading-8 text-slate-600"
            >
              A broad set of verification workflows are already live, from AI
              media detection to provenance, research, and integrity review.
            </motion.p>

            <motion.div
              variants={motionSet.card}
              className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50/80 p-6"
            >
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                More workflows
              </div>
              <div className="mt-1 text-xl font-semibold text-slate-900">
                Additional capabilities are already on the roadmap.
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Explore the roadmap section for deeper forensics and upcoming
                verification workflows that build on what is live today.
              </p>
              <SmoothScrollLink
                href="#roadmap"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
              >
                See the roadmap
                <ArrowRight className="h-4 w-4" />
              </SmoothScrollLink>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={landingViewport}
            variants={motionSet.stagger}
          >
            <motion.div variants={motionSet.sectionIntro}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Available now
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">
                    Live verification workflows
                  </div>
                </div>
                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Shipping today
                </div>
              </div>

              <motion.div
                variants={motionSet.quickStagger}
                className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              >
                {availableNow.map((capability) => {
                  const Icon = capability.icon;

                  return (
                    <motion.div
                      key={capability.title}
                      variants={motionSet.card}
                    >
                      <Link
                        href={capability.href}
                        className={`group flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-gradient-to-br ${capability.surface} p-6 shadow-sm transition-shadow hover:shadow-md`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="rounded-2xl bg-white/90 p-3 shadow-sm">
                            <Icon className={`h-5 w-5 ${capability.accent}`} />
                          </div>
                          <div className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-600">
                            {capability.status}
                          </div>
                        </div>
                        <h3 className="mt-5 text-lg font-semibold text-slate-900">
                          {capability.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {capability.description}
                        </p>
                        <div className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold ${capability.accent} opacity-0 transition-opacity group-hover:opacity-100`}>
                          Try it free
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div variants={motionSet.item} className="mt-8 text-center">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl bg-blue-600 px-8 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
                >
                  <Link href="/try">
                    Try all tools free — no account needed
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
