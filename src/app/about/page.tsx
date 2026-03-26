"use client";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  GraduationCap,
  type LucideIcon,
  Scale,
  Shield,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { HeroHeader } from "@/components/header";
import Footer from "@/components/landing-page/Footer";
import { createLandingMotion, landingViewport } from "@/lib/landing-motion";

type BuildArea = {
  title: string;
  description: string;
  icon: LucideIcon;
  surface: string;
  accent: string;
  highlights: string[];
};

type Audience = {
  title: string;
  description: string;
  icon: LucideIcon;
  fit: string;
};

const proofPoints = [
  {
    label: "Live now",
    value: "Verification workflows",
    detail: "AI media detection, authenticity, claim research, and more.",
  },
  {
    label: "Built for",
    value: "High-trust decisions",
    detail: "When media needs evidence, context, and a defensible review path.",
  },
  {
    label: "Designed around",
    value: "Usable outputs",
    detail: "Verdicts, provenance, and supporting signals in one workspace.",
  },
];

const buildAreas: BuildArea[] = [
  {
    title: "AI media detection",
    description:
      "We help teams review images, audio, and video for signs of AI generation or manipulation without collapsing everything into one simplistic outcome.",
    icon: Shield,
    surface: "from-blue-50 to-cyan-50",
    accent: "text-blue-700",
    highlights: [
      "Image, video, and audio workflows",
      "Confidence-led verdicts",
      "Failure states that stay honest",
    ],
  },
  {
    title: "Authenticity and provenance",
    description:
      "We surface content credentials, provenance signals, and integrity context so trust decisions are not made in the dark.",
    icon: Target,
    surface: "from-emerald-50 to-teal-50",
    accent: "text-emerald-700",
    highlights: [
      "C2PA-oriented review",
      "Integrity and origin signals",
      "Evidence that supports human review",
    ],
  },
  {
    title: "Claim research and evidence review",
    description:
      "We are building a verification environment where suspicious content, research, and supporting outputs can be reviewed together instead of across disconnected tools.",
    icon: FileText,
    surface: "from-slate-50 to-blue-50",
    accent: "text-slate-700",
    highlights: [
      "Research-backed outputs",
      "Cross-workflow review paths",
      "Clearer handoff into investigation work",
    ],
  },
];

const audiences: Audience[] = [
  {
    title: "Newsrooms and investigators",
    description:
      "For teams working under time pressure when suspicious media and provenance questions cannot be waved through.",
    icon: Shield,
    fit: "Best for evidence-first editorial review and fast media triage.",
  },
  {
    title: "Trust and security teams",
    description:
      "For organizations dealing with impersonation, manipulated content, and internal trust incidents across channels.",
    icon: Building2,
    fit: "Best for structured review when suspicious media affects operations or brand risk.",
  },
  {
    title: "Educators and researchers",
    description:
      "For people teaching media literacy, studying emerging threats, or evaluating verification methods in practice.",
    icon: GraduationCap,
    fit: "Best for explainable workflows that do not hide behind black-box outputs.",
  },
  {
    title: "Legal, compliance, and public-interest teams",
    description:
      "For environments where media review carries regulatory, legal, or public-trust consequences.",
    icon: Scale,
    fit: "Best for evidence-backed findings that need a clearer decision trail.",
  },
];

const principles = [
  {
    title: "Evidence over guesswork",
    description:
      "A verdict matters less if the path to that verdict cannot be reviewed.",
  },
  {
    title: "Trust needs transparency",
    description:
      "People need to understand what was checked, what was found, and where uncertainty remains.",
  },
  {
    title: "Human review still matters",
    description:
      "We build for teams making real decisions, not for a world where one score replaces judgment.",
  },
  {
    title: "Verification should be usable",
    description:
      "The best system in theory still fails if it does not fit real workflows under real pressure.",
  },
];

export default function AboutPage() {
  const reducedMotion = useReducedMotion();
  const motionSet = createLandingMotion(Boolean(reducedMotion));

  return (
    <>
      <HeroHeader />
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_28%,#f8fbff_100%)]">
        <section className="relative overflow-hidden pb-20 pt-32 md:pb-24 md:pt-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#7aa6c90d_1px,transparent_1px),linear-gradient(to_bottom,#7aa6c90d_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="absolute left-[8%] top-28 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute right-[10%] top-8 h-80 w-80 rounded-full bg-cyan-200/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-slate-200/35 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={motionSet.stagger}
              className="mx-auto max-w-5xl text-center"
            >
              <motion.div
                variants={motionSet.item}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-sm"
              >
                <Shield className="h-4 w-4" />
                About Safeguardmedia Technologies
              </motion.div>
              <motion.h1
                variants={motionSet.sectionIntro}
                className="mt-8 text-balance text-5xl font-bold leading-[0.95] tracking-tight text-[hsl(220,40%,14%)] md:text-7xl"
              >
                Building trust infrastructure for digital media.
              </motion.h1>
              <motion.p
                variants={motionSet.item}
                className="mx-auto mt-7 max-w-3xl text-balance text-lg leading-8 text-slate-600 md:text-xl"
              >
                Safeguardmedia Technologies is building practical verification
                workflows for teams that need to review suspicious content,
                assess authenticity, and work from evidence instead of
                guesswork.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={motionSet.stagger}
              className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]"
            >
              <motion.div
                variants={motionSet.panel}
                className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-sm md:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Company snapshot
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900">
                      Built for verification work that needs context.
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Platform active
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {proofPoints.map((point) => (
                    <motion.div
                      key={point.value}
                      variants={motionSet.card}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5"
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {point.label}
                      </div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">
                        {point.value}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {point.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={motionSet.panel}
                className="rounded-[2rem] border border-slate-800 bg-[hsl(222,38%,16%)] p-6 text-white shadow-xl shadow-slate-300/40 md:p-8"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  What guides us
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  Verification should be structured, explainable, and usable.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                  We are not building for a world where one score replaces
                  judgment. We are building for teams that need a better review
                  environment when content trust is actually on the line.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    "Evidence should travel with the result.",
                    "Uncertainty should be surfaced, not hidden.",
                    "Workflows should reduce friction without flattening nuance.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                      <span className="text-sm leading-7 text-slate-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="relative bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={landingViewport}
              variants={motionSet.stagger}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Target className="h-4 w-4" />
                Why we exist
              </div>
              <motion.h2
                variants={motionSet.sectionIntro}
                className="mt-6 text-4xl font-bold tracking-tight text-[hsl(220,40%,15%)] md:text-5xl"
              >
                Trust in digital content has become a workflow problem.
              </motion.h2>
              <motion.div
                variants={motionSet.item}
                className="mt-6 space-y-4 text-lg leading-8 text-slate-600"
              >
                <p>
                  Synthetic media, manipulation tooling, and low-friction
                  distribution have made it harder for teams to know what they
                  are really looking at. The challenge is no longer just
                  detection. It is review, context, and decision-making.
                </p>
                <p>
                  We started Safeguardmedia Technologies to build systems that
                  help people work through that problem more clearly. That means
                  practical verification workflows, evidence-backed outputs, and
                  tools that respect the fact that trust decisions rarely happen
                  in a vacuum.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={landingViewport}
              variants={motionSet.quickStagger}
              className="grid gap-4"
            >
              {[
                {
                  title: "The problem is layered",
                  detail:
                    "A single media file can raise questions about AI generation, manipulation, provenance, and distribution context at the same time.",
                },
                {
                  title: "The response cannot be binary-only",
                  detail:
                    "Teams need more than a pass-fail verdict. They need supporting evidence, visible uncertainty, and a usable review path.",
                },
                {
                  title: "The tool has to fit real work",
                  detail:
                    "Verification only matters if it can be used quickly by people working in news, research, trust, compliance, and security environments.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={motionSet.card}
                  className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-6"
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Core observation
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                    {item.detail}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)] py-20">
          <div className="absolute left-[10%] top-10 h-64 w-64 rounded-full bg-cyan-100/30 blur-3xl" />
          <div className="absolute bottom-0 right-[8%] h-72 w-72 rounded-full bg-blue-100/30 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={landingViewport}
                variants={motionSet.stagger}
                className="max-w-xl"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  <Sparkles className="h-4 w-4" />
                  What we build now
                </div>
                <motion.h2
                  variants={motionSet.sectionIntro}
                  className="mt-6 text-4xl font-bold tracking-tight text-[hsl(220,40%,15%)] md:text-5xl"
                >
                  A verification environment, not just a detector.
                </motion.h2>
                <motion.p
                  variants={motionSet.item}
                  className="mt-6 text-lg leading-8 text-slate-600"
                >
                  Our platform is growing into a set of connected trust
                  workflows. Each one helps users move from suspicious content
                  to a more structured conclusion with less fragmentation.
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={landingViewport}
                variants={motionSet.quickStagger}
                className="grid gap-5 md:grid-cols-2"
              >
                {buildAreas.map((area, index) => {
                  const Icon = area.icon;

                  return (
                    <motion.div
                      key={area.title}
                      variants={motionSet.card}
                      className={`rounded-[1.75rem] border border-slate-200 bg-gradient-to-br ${area.surface} p-6 shadow-sm ${
                        index === buildAreas.length - 1 ? "md:col-span-2" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-2xl bg-white/90 p-3 shadow-sm">
                          <Icon className={`h-5 w-5 ${area.accent}`} />
                        </div>
                        <div className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-500">
                          Active platform area
                        </div>
                      </div>
                      <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                        {area.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                        {area.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {area.highlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600"
                          >
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="relative bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={landingViewport}
              variants={motionSet.stagger}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                <Users className="h-4 w-4" />
                Who we build for
              </div>
              <motion.h2
                variants={motionSet.sectionIntro}
                className="mt-6 text-4xl font-bold tracking-tight text-[hsl(220,40%,15%)] md:text-5xl"
              >
                Built for teams that cannot afford a casual approach to media
                trust.
              </motion.h2>
              <motion.p
                variants={motionSet.item}
                className="mt-6 text-lg leading-8 text-slate-600"
              >
                The platform is shaped by environments where authenticity,
                manipulation, and evidence quality materially affect decisions.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={landingViewport}
              variants={motionSet.quickStagger}
              className="mt-12 grid gap-5 lg:grid-cols-2"
            >
              {audiences.map((audience) => {
                const Icon = audience.icon;

                return (
                  <motion.div
                    key={audience.title}
                    variants={motionSet.card}
                    className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-white p-3 shadow-sm">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-slate-900">
                          {audience.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                          {audience.description}
                        </p>
                        <div className="mt-4 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-medium leading-7 text-slate-700">
                          {audience.fit}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section className="relative bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={landingViewport}
              variants={motionSet.stagger}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Company principles
              </div>
              <motion.h2
                variants={motionSet.sectionIntro}
                className="mt-6 text-4xl font-bold tracking-tight text-[hsl(220,40%,15%)] md:text-5xl"
              >
                The standards we want the product to uphold.
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={landingViewport}
              variants={motionSet.quickStagger}
              className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
            >
              {principles.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  variants={motionSet.card}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                    0{index + 1}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="relative bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={landingViewport}
              variants={motionSet.panel}
              className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-[hsl(222,38%,16%)] p-8 text-center text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] md:p-12"
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,170,220,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,170,220,0.06)_1px,transparent_1px)] bg-[size:22px_22px]" />
              <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative mx-auto max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  Explore the platform
                </div>
                <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
                  See how Safeguardmedia Technologies approaches media trust in
                  practice.
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-300">
                  The product is no longer a waitlist concept. The platform is
                  active, the workflows are taking shape, and the next step is
                  seeing how they fit the work your team actually does.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-100"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                  >
                    Read the Blog
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
