"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LegalSection = {
  id: string;
  label: string;
};

type LegalPageLayoutProps = {
  title: string;
  summary: string;
  lastUpdated: string;
  sections: LegalSection[];
  children: React.ReactNode;
};

export default function LegalPageLayout({
  title,
  summary,
  lastUpdated,
  sections,
  children,
}: LegalPageLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  const handleSectionJump = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Button
          variant="ghost"
          size="sm"
          className="mb-5 cursor-pointer"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {summary}
            </p>
            <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
            <div className="pt-1 text-sm text-slate-500">
              Need help?{" "}
              <Link href="/about" className="text-blue-600 hover:underline">
                Contact us
              </Link>
              .
            </div>
          </div>
        </Card>

        <Card className="mt-4 border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur lg:hidden">
          <p className="mb-2 text-sm font-semibold text-slate-900">Jump to section</p>
          <Select onValueChange={handleSectionJump}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <Card className="h-fit border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur lg:sticky lg:top-5">
            <p className="mb-3 text-sm font-semibold text-slate-900">On this page</p>
            <nav aria-label={`${title} sections`}>
              <ul className="space-y-1.5">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Card>

          <Card className="border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="prose prose-sm max-w-none space-y-9 text-slate-700 sm:prose-base prose-headings:scroll-mt-24 prose-headings:text-slate-900 prose-p:leading-relaxed prose-li:leading-relaxed">
              {children}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
