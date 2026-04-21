'use client';

import {
  BadgeCheck,
  Brain,
  FileSearch,
  MapPin,
  Search,
  Shield,
  Sparkles,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FeatureCard } from '@/components/try/FeatureCard';
import { createLandingMotion } from '@/lib/landing-motion';

const features = [
  {
    href: '/try/ai-detection',
    icon: <Brain className="h-5 w-5" />,
    title: 'AI Media Detection',
    description:
      'Check if an image or short video may be AI-generated or manipulated.',
    tags: ['Image', 'Video'],
  },
  {
    href: '/try/reverse-lookup',
    icon: <FileSearch className="h-5 w-5" />,
    title: 'Reverse Image Search',
    description:
      'See where an image appears online and find clues about its source.',
    tags: ['Image'],
  },
  {
    href: '/try/authenticity',
    icon: <Shield className="h-5 w-5" />,
    title: 'Authenticity Check',
    description:
      'Review metadata for signs of editing, unusual timestamps, or location issues.',
    tags: ['Image', 'Video', 'Audio'],
  },
  {
    href: '/try/claim-research',
    icon: <Search className="h-5 w-5" />,
    title: 'Claim Research',
    description:
      'Explore whether a claim is supported by credible sources and available evidence.',
    tags: ['Text'],
  },
  {
    href: '/try/fact-check',
    icon: <BadgeCheck className="h-5 w-5" />,
    title: 'Fact Check',
    description:
      'Find out whether trusted fact-checkers have already reviewed the claim.',
    tags: ['Text'],
  },
  {
    href: '/try/geolocation',
    icon: <MapPin className="h-5 w-5" />,
    title: 'Geolocation Verify',
    description:
      "Check whether an image's location data matches the claimed place.",
    tags: ['Image'],
  },
];

export default function TryPage() {
  const reducedMotion = useReducedMotion();
  const motionSet = createLandingMotion(Boolean(reducedMotion));

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute right-0 top-48 h-72 w-72 rounded-full bg-cyan-100/35 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-sky-100/30 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#7aa6c908_1px,transparent_1px),linear-gradient(to_bottom,#7aa6c908_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 md:py-20">
        {/* Hero text */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={motionSet.stagger}
          className="text-center"
        >
          <motion.div variants={motionSet.item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 sm:px-4 sm:text-sm">
              <Sparkles className="h-3.5 w-3.5" />3 free analyses &mdash; no
              account needed
            </span>
          </motion.div>

          <motion.h1
            variants={motionSet.sectionIntro}
            className="mt-5 text-3xl font-bold leading-tight tracking-tight text-[hsl(220,40%,14%)] sm:mt-6 sm:text-4xl md:text-5xl"
          >
            Try Safeguardmedia
          </motion.h1>

          <motion.p
            variants={motionSet.item}
            className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:mt-4 sm:text-base sm:leading-7"
          >
            Use these tools to verify content, check claims, and spot important
            issues fast.
          </motion.p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={motionSet.quickStagger}
          className="mt-8 grid gap-3 sm:mt-12 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.href} variants={motionSet.card}>
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 text-center text-sm text-slate-400 sm:mt-10"
        >
          Already have an account?{' '}
          <a
            href="/auth/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Log in for unlimited access
          </a>
        </motion.p>
      </div>
    </div>
  );
}
