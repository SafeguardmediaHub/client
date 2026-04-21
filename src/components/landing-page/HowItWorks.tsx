'use client';

import { ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { createLandingMotion, landingViewport } from '@/lib/landing-motion';

const steps = [
  {
    number: '01',
    title: 'Bring content into the case',
    description:
      'Start from uploaded media or a verification workflow that fits the question you need answered.',
    detail:
      'Supports media analysis, provenance checks, and research workflows.',
  },
  {
    number: '02',
    title: 'Run the right verification path',
    description:
      'Choose AI media detection, authenticity, reverse lookup, claim research, or another workflow based on the type of evidence.',
    detail: 'Different problems need different verification methods.',
  },
  {
    number: '03',
    title: 'Review evidence with confidence',
    description:
      'Get verdicts, confidence scores, provenance details, and supporting signals in a structure teams can actually work from.',
    detail: 'Results stay readable for both operators and decision-makers.',
  },
];

const outputs = [
  'AI-generated media verdicts',
  'Content credentials and authenticity signals',
  'Fact-check and research findings',
  'Structured outputs for team review',
];

export default function HowItWorks() {
  const reducedMotion = useReducedMotion();
  const motionSet = createLandingMotion(Boolean(reducedMotion));

  return (
    <section
      id="workflow"
      className="relative overflow-hidden scroll-mt-28 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] py-28 lg:scroll-mt-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#7aa6c90d_1px,transparent_1px),linear-gradient(to_bottom,#7aa6c90d_1px,transparent_1px)] bg-[size:18px_18px]" />
      <div className="absolute left-[8%] top-14 h-64 w-64 rounded-full bg-cyan-200/25 blur-3xl" />
      <div className="absolute bottom-0 right-[8%] h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={landingViewport}
          variants={motionSet.stagger}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Operational workflow
          </div>
          <motion.h2
            variants={motionSet.sectionIntro}
            className="mt-6 text-4xl font-bold tracking-tight text-[hsl(220,40%,15%)] md:text-6xl"
          >
            A clearer path from raw content to a defendable decision.
          </motion.h2>
          <motion.p
            variants={motionSet.item}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
          >
            The platform is built to reduce the gap between an uploaded file and
            a result your team can actually trust, share, and act on.
          </motion.p>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={landingViewport}
            variants={motionSet.panel}
            className="rounded-[2rem] border border-slate-200 bg-[hsl(220,38%,16%)] p-8 text-white shadow-xl shadow-slate-200/60"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <Shield className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                  What teams get
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  Outputs built for review, not guesswork
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {outputs.map((output) => (
                <div
                  key={output}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  <span className="text-sm leading-7 text-slate-200">
                    {output}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-5">
              <div className="text-sm font-semibold text-cyan-100">
                Use the workflow that matches the problem.
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                AI media detection answers whether content appears synthetic or
                manipulated. Authenticity answers where it came from and whether
                provenance signals hold up.
              </p>
            </div>

            <Link
              href="/try"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition-colors hover:text-white"
            >
              Try it free. No account needed
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={landingViewport}
            variants={motionSet.quickStagger}
            className="space-y-4"
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={motionSet.card}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm md:p-7"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  <div className="flex items-center gap-4 md:w-40 md:flex-col md:items-start md:gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white shadow-sm shadow-blue-500/20">
                      {step.number}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
                      Step {step.number}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <h3 className="max-w-xl text-xl font-semibold text-slate-900 md:text-2xl">
                        {step.title}
                      </h3>
                      <div className="max-w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium leading-5 text-slate-500 sm:w-fit sm:rounded-full sm:py-1.5">
                        {step.detail}
                      </div>
                    </div>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-[0.95rem]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
