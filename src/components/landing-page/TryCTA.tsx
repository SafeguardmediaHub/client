"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createLandingMotion, landingViewport } from "@/lib/landing-motion";

const tools = [
  "AI Media Detection",
  "Reverse Image Search",
  "Authenticity Check",
  "Claim Research",
  "Geolocation Verify",
];

export default function TryCTA() {
  const reducedMotion = useReducedMotion();
  const motionSet = createLandingMotion(Boolean(reducedMotion));

  return (
    <section className="relative overflow-hidden bg-[hsl(220,38%,16%)] py-24">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={landingViewport}
          variants={motionSet.stagger}
          className="text-center"
        >
          <motion.div variants={motionSet.item}>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              <Sparkles className="h-4 w-4" />
              No account needed
            </div>
          </motion.div>

          <motion.h2
            variants={motionSet.sectionIntro}
            className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl"
          >
            See it work on your content.
          </motion.h2>

          <motion.p
            variants={motionSet.item}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300"
          >
            Upload a file or paste a claim and get real results in seconds — free,
            with no sign up required.
          </motion.p>

          <motion.div
            variants={motionSet.quickStagger}
            className="mt-8 flex flex-wrap justify-center gap-2"
          >
            {tools.map((tool) => (
              <motion.div
                key={tool}
                variants={motionSet.item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300"
              >
                {tool}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={motionSet.item}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-white px-10 py-6 text-base font-semibold text-[hsl(220,38%,16%)] shadow-xl hover:bg-slate-100"
            >
              <Link href="/try">
                Try the platform free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Link
              href="/auth/signup"
              className="text-sm font-semibold text-slate-400 transition-colors hover:text-white"
            >
              Or create a free account →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
