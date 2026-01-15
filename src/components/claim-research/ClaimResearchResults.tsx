"use client";

// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ConfidencePill } from "./ConfidencePill";
import { useResearchStatus } from "@/hooks/useClaimResearch";
import type { ClaimResearchStatusResponse, EvidenceSynthesis, SearchResult } from "@/types/claim-research";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink, 
  FileSearch, 
  FileText, 
  Loader2, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  ShieldQuestion 
} from "lucide-react";

interface ClaimResearchResultsProps {
  jobId: string;
  onReset?: () => void;
}

export function ClaimResearchResults({ jobId, onReset }: ClaimResearchResultsProps) {
  const { data, error, isLoading } = useResearchStatus(jobId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-zinc-500">Initializing research environment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-200 flex items-start gap-4">
        <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold">Error Loading Research</h4>
          <p className="text-sm opacity-90">
            {(error as Error).message || "An error occurred while fetching the research results."}
          </p>
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset} className="mt-3 border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300">
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!data) return null;

  if (data.status !== "completed" && data.status !== "failed") {
    return <ResearchProgress data={data} />;
  }

  if (data.status === "failed") {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-200 flex items-start gap-4">
        <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold">Research Failed</h4>
          <p className="text-sm opacity-90">
            The research process could not be completed. Please try again later.
          </p>
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset} className="mt-3 border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300">
              Start New Research
            </Button>
          )}
        </div>
      </div>
    );
  }

  return <ResearchComplete data={data} onReset={onReset} />;
}

function ResearchProgress({ data }: { data: ClaimResearchStatusResponse }) {
  const { progress, status } = data;
  
  return (
    <Card className="max-w-2xl mx-auto mt-8 border-none shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-12 text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto">
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/30" 
          />
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {status === "searching" ? <Search className="w-8 h-8 text-blue-600" /> : <FileText className="w-8 h-8 text-indigo-600" />}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {status === "searching" ? "Scouring the Web" : "Synthesizing Evidence"}
          </h3>
          <p className="text-zinc-500 max-w-md mx-auto">
            {status === "searching" 
              ? "We're searching trusted sources to find evidence related to your claim..." 
              : "Analyzing findings, checking for contradictions, and generating a summary..."}
          </p>
        </div>
        
        <div className="space-y-2 max-w-sm mx-auto">
          <div className="flex justify-between text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <span>Progress</span>
            <span>{Math.round(progress.percentage)}%</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function ResearchComplete({ data, onReset }: { data: ClaimResearchStatusResponse; onReset?: () => void }) {
  const { synthesis, search_results, claim_text } = data;

  if (!synthesis) return <div>No synthesis available</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 leading-tight flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-blue-600" />
            Investigation Findings
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium italic border-l-4 border-blue-500 pl-4 py-1">
            "{claim_text}"
          </p>
        </div>
        {onReset && (
          <Button onClick={onReset} variant="outline">
            New Investigation
          </Button>
        )}
      </div>

      {/* Evidence Summary Card */}
      <Card className="border-none shadow-xl bg-gradient-to-br from-white to-blue-50/50 dark:from-zinc-900 dark:to-blue-900/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Evidence Summary
            </CardTitle>
            <ConfidencePill 
              confidence={synthesis.confidence} 
              sourceCount={search_results?.length || 0}
              showPercentage
              size="lg"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {synthesis.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <EvidenceStat 
              label="Supporting" 
              count={synthesis.evidence_assessment.supporting} 
              icon={ShieldCheck} 
              color="text-emerald-600" 
              bg="bg-emerald-100/50" 
            />
            <EvidenceStat 
              label="Contradicting" 
              count={synthesis.evidence_assessment.contradicting} 
              icon={ShieldAlert} 
              color="text-rose-600" 
              bg="bg-rose-100/50" 
            />
             <EvidenceStat 
              label="Neutral / Mixed" 
              count={synthesis.evidence_assessment.neutral} 
              icon={ShieldQuestion} 
              color="text-amber-600" 
              bg="bg-amber-100/50" 
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content (2 cols) */}
        <div className="md:col-span-2 space-y-8">
          {/* Key Findings */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Key Findings
            </h3>
            <div className="space-y-3">
              {synthesis.key_findings.map((finding, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300">{finding}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sources */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Sources & Evidence
            </h3>
            <div className="grid gap-3">
              {search_results?.map((result, i) => (
                <SourceCard key={i} result={result} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info (1 col) */}
        <div className="space-y-8">
          {/* Limitations */}
           {synthesis.limitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {synthesis.limitations.map((lim, i) => (
                    <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-2">
                      <span className="text-zinc-400">•</span>
                      {lim}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
           )}

           {/* Next Steps */}
           {synthesis.suggested_next_steps.length > 0 && (
            <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-blue-900 dark:text-blue-100">
                  Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                   {synthesis.suggested_next_steps.map((step, i) => (
                    <li key={i} className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-70" />
                      {step}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
           )}
        </div>
      </div>
    </div>
  );
}

function EvidenceStat({ label, count, icon: Icon, color, bg }: any) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${bg}`}>
      <div className={`p-3 rounded-full bg-white/80 dark:bg-black/20 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{count}</div>
        <div className="text-sm font-medium opacity-80">{label}</div>
      </div>
    </div>
  );
}

function SourceCard({ result }: { result: SearchResult }) {
  return (
    <a 
      href={result.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group hover:no-underline"
    >
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-3">
             <div className="space-y-1">
               <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                 <span>{result.source}</span>
                 {result.date && (
                   <>
                    <span>•</span>
                    <span>{result.date}</span>
                   </>
                 )}
               </div>
               <h4 className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline line-clamp-1">
                 {result.title}
               </h4>
               <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                 {result.snippet}
               </p>
             </div>
             <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
