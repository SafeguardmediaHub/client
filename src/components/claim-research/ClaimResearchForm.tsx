"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitClaim } from "@/hooks/useClaimResearch";
import type { ClaimResearchError } from "@/types/claim-research";
import { FileSearch, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ClaimResearchFormProps {
  onSuccess: (jobId: string) => void;
}

export function ClaimResearchForm({ onSuccess }: ClaimResearchFormProps) {
  const [claimText, setClaimText] = useState("");
  const [context, setContext] = useState("");
  const submitClaim = useSubmitClaim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (claimText.length < 10) {
      toast.error("Claim must be at least 10 characters long");
      return;
    }

    try {
      const result = await submitClaim.mutateAsync({
        claim_text: claimText,
        context: context || undefined,
      });

      toast.success("Investigation opened successfully!");
      onSuccess(result.job_id);
    } catch (error: any) {
      console.error("Failed to submit claim:", error);
      const errorData = error.response?.data as ClaimResearchError;
      
      if (error.response?.status === 429) {
        toast.error("Rate limit exceeded", {
          description: errorData.message || "You have reached your daily limit for claim research.",
        });
      } else {
        toast.error("Failed to open investigation", {
          description: errorData?.message || "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <Card className="w-full h-full border-zinc-200 dark:border-zinc-800 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          <FileSearch className="w-5 h-5 text-blue-600" />
          Open a Claim Investigation
        </CardTitle>
        <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400">
          We break claims into verifiable facts, cross-check sources, and score evidence strength.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="claim-text" className="text-sm font-medium">
              What claim would you like to investigate?
            </Label>
            <Textarea
              id="claim-text"
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="e.g., Drinking coffee reduces risk of heart disease by 20%..."
              rows={4}
              className="resize-none text-sm p-3 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 transition-all"
              minLength={10}
              maxLength={1000}
              required
            />
            <div className="flex justify-end">
              <span className={`text-xs ${claimText.length >= 1000 ? "text-red-500" : "text-zinc-400"}`}>
                {claimText.length}/1000
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Additional Context (Optional)
            </Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., Source URL, date published, specific details to verify..."
              rows={2}
              className="resize-none text-sm p-4 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-all duration-300"
            disabled={submitClaim.isPending || claimText.length < 10}
          >
            {submitClaim.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Opening Investigation...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Begin Investigation
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
