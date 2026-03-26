"use client";

import {
  Code2,
  ImageIcon,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { Card, Carousel } from "@/components/ui/apple-cards-carousel";

const roadmapItems = [
  {
    category: "In development",
    title: "Developer API Access",
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2940&auto=format&fit=crop",
    content: (
      <div className="space-y-4">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-[hsl(220,85%,60%)] to-[hsl(190,95%,55%)] p-3">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Developer API Access
            </h3>
            <p className="text-sm text-gray-600">
              Bring verification workflows into your own systems
            </p>
          </div>
        </div>
        <p className="text-lg leading-relaxed text-gray-700">
          API access is in development for teams that want to run Safeguardmedia
          Technologies inside their own applications, moderation pipelines, and
          trust operations.
        </p>
        <ul className="mt-6 space-y-2">
          <li className="flex items-center gap-2 text-gray-700">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            Verification endpoints for core workflows
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            Better integration into internal tooling
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            Programmatic access for higher-volume teams
          </li>
        </ul>
      </div>
    ),
  },
  {
    category: "In development",
    title: "Teams and Organization Support",
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop",
    content: (
      <div className="space-y-4">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-[hsl(35,85%,60%)] to-[hsl(12,90%,62%)] p-3">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Teams and Organization Support
            </h3>
            <p className="text-sm text-gray-600">
              Built for shared workflows, not just individual use
            </p>
          </div>
        </div>
        <p className="text-lg leading-relaxed text-gray-700">
          Multi-user support is in development so organizations can manage
          access, share investigation context, and operate the platform as a
          real team workspace.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-amber-50 p-4">
            <div className="text-2xl font-bold text-amber-700">Teams</div>
            <div className="text-sm text-gray-600">
              Shared investigation space
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <div className="text-2xl font-bold text-amber-700">Roles</div>
            <div className="text-sm text-gray-600">
              Organization-level access
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: "In development",
    title: "Custom Workflows",
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop",
    content: (
      <div className="space-y-4">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-[hsl(190,95%,55%)] to-[hsl(220,85%,60%)] p-3">
            <SlidersHorizontal className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Custom Workflows
            </h3>
            <p className="text-sm text-gray-600">
              Fit the platform to different trust and review processes
            </p>
          </div>
        </div>
        <p className="text-lg leading-relaxed text-gray-700">
          Custom workflow support is in development for teams that need
          verification paths, review steps, and result handling tailored to
          their internal processes.
        </p>
        <div className="mt-6 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 p-4">
          <p className="mb-2 text-sm font-semibold text-gray-900">
            Planned focus
          </p>
          <p className="text-sm text-gray-600">
            More flexible task flows, configurable review paths, and better
            alignment with how organizations actually investigate content.
          </p>
        </div>
      </div>
    ),
  },
  {
    category: "In development",
    title: "Image Support for Claim Extraction",
    src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2940&auto=format&fit=crop",
    content: (
      <div className="space-y-4">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-[hsl(140,70%,48%)] to-[hsl(190,95%,45%)] p-3">
            <ImageIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Image Support for Claim Extraction
            </h3>
            <p className="text-sm text-gray-600">
              Bring claim extraction into image-based investigations
            </p>
          </div>
        </div>
        <p className="text-lg leading-relaxed text-gray-700">
          OCR is already part of the picture. What is in development is better
          image-based support for claim extraction so screenshots and visual
          evidence can move more directly into research workflows.
        </p>
        <ul className="mt-6 space-y-2">
          <li className="flex items-center gap-2 text-gray-700">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Better claim extraction from screenshots
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Stronger handoff from image evidence to research
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Clearer support for image-led verification cases
          </li>
        </ul>
      </div>
    ),
  },
];

export default function V2FeaturesCarousel() {
  const cards = roadmapItems.map((item, index) => (
    <Card key={item.title} card={item} index={index} />
  ));

  return (
    <section
      id="roadmap"
      className="relative overflow-hidden bg-[hsl(210,35%,97%)] py-24"
    >
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      <div className="absolute left-0 top-0 h-full w-1/2 -translate-x-1/4 -skew-x-12 bg-gradient-to-br from-[hsl(190,95%,55%)]/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(35,85%,60%)]/30 bg-[hsl(35,85%,60%)]/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-[hsl(35,85%,60%)]" />
            <span className="text-sm font-bold uppercase tracking-wider text-[hsl(35,85%,60%)]">
              Expanding next
            </span>
          </div>
          <h2 className="mt-6 text-5xl font-bold leading-tight text-[hsl(220,40%,15%)] md:text-6xl">
            Roadmap work that strengthens the platform.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            These roadmap items build on the workflows already available today
            and extend the platform into deeper forensic and contextual review.
          </p>
        </div>

        <Carousel items={cards} />
      </div>
    </section>
  );
}
