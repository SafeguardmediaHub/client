"use client";

import { ClaimResearchForm } from "@/components/claim-research/ClaimResearchForm";
import { ClaimResearchResults } from "@/components/claim-research/ClaimResearchResults";
import { HowItWorksPanel } from "@/components/claim-research/HowItWorksPanel";
import { ResearchHistory } from "@/components/claim-research/ResearchHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function ClaimResearchPage() {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  if (currentJobId) {
    return (
      <div className="w-full h-full min-h-screen bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-4">
             <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentJobId(null)}
              className="rounded-full bg-white dark:bg-black border-zinc-200 dark:border-zinc-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Investigation Details</h1>
          </div>
          <ClaimResearchResults 
            jobId={currentJobId} 
            onReset={() => setCurrentJobId(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Claim Investigation
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl mt-2">
              Decompose claims, cross-check sources, and score evidence strength.
            </p>
          </div>
        </div>

        {/* Top Grid: Form + How It Works */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <ClaimResearchForm onSuccess={setCurrentJobId} />
          </div>
          <div className="lg:col-span-2">
            <HowItWorksPanel />
          </div>
        </div>

        {/* Bottom: Full-width History */}
        <div className="w-full">
          <ResearchHistory onSelectJob={setCurrentJobId} />
        </div>
      </div>
    </div>
  );
}
