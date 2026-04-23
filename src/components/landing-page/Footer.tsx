"use client";

import {
  ArrowRight,
  Linkedin,
  Mail,
  Shield,
  Twitter,
  Youtube,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import SmoothScrollLink from "@/components/landing-page/SmoothScrollLink";
import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/cookie-consent";
import { createLandingMotion, landingViewport } from "@/lib/landing-motion";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Overview", href: "#platform" },
      { label: "Workflow", href: "#workflow" },
      { label: "Use Cases", href: "#use-cases" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "AI Media Detection", href: "/dashboard/ai-media-detection" },
      { label: "Authenticity", href: "/dashboard/authenticity" },
      { label: "Fact Checking", href: "/dashboard/fact-check" },
      { label: "Library", href: "/dashboard/library" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const workflowTags = [
  "AI media detection",
  "Authenticity",
  "Claim research",
  "Evidence review",
];

const statusPills = [
  "Live verification workflows",
  "Evidence-backed review",
  "Built for high-trust teams",
];

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  {
    icon: Youtube,
    href: "https://www.youtube.com/channel/UCNTAiiAqvTgO5rhzDc8aP6g",
    label: "YouTube",
  },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:info@safeguardmedia.org", label: "Email" },
];

export default function Footer() {
  const reducedMotion = useReducedMotion();
  const motionSet = createLandingMotion(Boolean(reducedMotion));
  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT));
  };

  return (
    <footer className="relative overflow-hidden bg-[hsl(222,42%,12%)] text-white">
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      <div className="absolute left-[-8rem] top-12 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="absolute right-[-5rem] top-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,170,220,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,170,220,0.06)_1px,transparent_1px)] bg-[size:22px_22px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={landingViewport}
          variants={motionSet.stagger}
          className="rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10"
        >
          <motion.div
            variants={motionSet.panel}
            className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
          >
            <div className="max-w-3xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <Shield className="h-4 w-4" />
                Trusted media verification infrastructure
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Bring your verification workflow into one place.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                Detect AI-generated media, review authenticity signals, and move
                from suspicious content to evidence-backed findings with less
                friction.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 sm:w-auto"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:info@safeguardmedia.org"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10 hover:text-white sm:w-auto"
              >
                Talk to Us
              </a>
            </div>
          </motion.div>

          <div className="grid gap-12 pt-10 lg:grid-cols-12">
            <motion.div
              variants={motionSet.stagger}
              className="space-y-8 text-center lg:col-span-5 lg:text-left"
            >
              <div className="space-y-5">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 justify-center lg:justify-start"
                >
                  <div className="relative">
                    <div className="relative flex h-14 w-11 items-center justify-center">
                      <Image
                        src="/SGM.svg"
                        alt=""
                        width={231}
                        height={315}
                        unoptimized
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold tracking-tight text-white">
                      Safeguardmedia Technologies
                    </div>
                    <div className="text-sm text-slate-400">
                      Defending trust in digital media
                    </div>
                  </div>
                </Link>

                <p className="max-w-md text-base leading-8 text-slate-300">
                  Built for trust and investigations teams handling AI-generated
                  media, provenance questions, and high-stakes digital evidence.
                </p>

                <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                  {workflowTags.map((tag) => (
                    <div
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-300"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                  Contact
                </div>
                <div className="mt-3 break-all text-xl font-semibold text-white sm:break-normal">
                  info@safeguardmedia.org
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Reach out if your team is evaluating verification workflows,
                  internal tooling, or organization-level adoption.
                </p>
              </div>

              <div className="flex justify-center gap-3 lg:justify-start">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-200 hover:border-cyan-300/40 hover:bg-white/10"
                    >
                      <Icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-cyan-200" />
                    </a>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              variants={motionSet.quickStagger}
              className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6 md:p-7 lg:col-span-7"
            >
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
                {footerSections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    variants={motionSet.card}
                    className={
                      index === 0
                        ? ""
                        : "border-t border-white/8 pt-6 md:border-l md:border-t-0 md:pt-0 md:pl-6"
                    }
                  >
                    <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[hsl(35,85%,68%)]">
                      {section.title}
                    </h3>
                    <ul className="mt-4 space-y-1.5">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          <SmoothScrollLink
                            href={link.href}
                            className="group inline-flex items-center gap-2 rounded-lg py-2 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                          >
                            <span>{link.label}</span>
                            <ArrowRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                          </SmoothScrollLink>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={landingViewport}
          variants={motionSet.quickStagger}
          className="mt-8 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-400 md:justify-start">
            <span>
              © {new Date().getFullYear()} Safeguardmedia Technologies.
            </span>
            <span className="hidden md:inline">•</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
            {statusPills.map((pill) => (
              <div
                key={pill}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
              >
                {pill}
              </div>
            ))}
            <button
              type="button"
              onClick={openCookieSettings}
              className="rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-100 transition-colors hover:bg-cyan-300/20"
            >
              Cookie Settings
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
