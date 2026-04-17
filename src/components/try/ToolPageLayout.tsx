"use client";

import { Brain, FileSearch, MapPin, Search, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tools = [
  {
    href: "/try/deepfake",
    icon: Brain,
    label: "AI Media Detection",
    tags: ["Image", "Video"],
  },
  {
    href: "/try/authenticity",
    icon: Shield,
    label: "Authenticity Check",
    tags: ["Image", "Video", "Audio"],
  },
  {
    href: "/try/claim-research",
    icon: Search,
    label: "Claim Research",
    tags: ["Text"],
  },
  {
    href: "/try/geolocation",
    icon: MapPin,
    label: "Geolocation Verify",
    tags: ["Image"],
  },
  {
    href: "/try/reverse-lookup",
    icon: FileSearch,
    label: "Reverse Lookup",
    tags: ["Image"],
  },
];

export function ToolPageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Mobile: horizontal scroll nav */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {tools.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop: sidebar + content */}
      <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Tools
            </div>
            <nav className="space-y-0.5">
              {tools.map(({ href, icon: Icon, label, tags }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                        active
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="flex-1 truncate">{label}</span>
                    {active && (
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
              <p className="text-xs leading-5 text-slate-500">
                3 free analyses shared across all tools.
              </p>
              <Link
                href="/try"
                className="mt-2 block text-xs font-medium text-blue-600 hover:underline"
              >
                ← Back to overview
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
