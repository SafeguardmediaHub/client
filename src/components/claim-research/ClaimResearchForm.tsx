'use client';

import { FileSearch, Info, Loader2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitClaim } from '@/hooks/useClaimResearch';
import type { ClaimResearchError } from '@/types/claim-research';

interface ClaimResearchFormProps {
  onSuccess: (jobId: string) => void;
}

const EXAMPLE_CLAIMS = [
  'ICE agents shoots woman in Minneapolis',
  'New tax law passed today affecting remote workers',
  'Video claims Mars has water flowing on the surface',
  'Rumor: Celebrity X arrested for tax evasion',
];

export function ClaimResearchForm({ onSuccess }: ClaimResearchFormProps) {
  const [claimText, setClaimText] = useState('');
  const [context, setContext] = useState('');
  const submitClaim = useSubmitClaim();

  const handleExampleClick = (text: string) => {
    setClaimText(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (claimText.length < 10) {
      toast.error('Claim must be at least 10 characters long');
      return;
    }

    try {
      const result = await submitClaim.mutateAsync({
        claim_text: claimText,
        context: context || undefined,
      });

      toast.success('Investigation opened successfully!');
      onSuccess(result.job_id);
    } catch (error: unknown) {
      console.error('Failed to submit claim:', error);
      // biome-ignore lint/suspicious/noExplicitAny: error handling fallback
      const errorData = (error as any).response?.data as ClaimResearchError;

      // biome-ignore lint/suspicious/noExplicitAny: error handling fallback
      if ((error as any).response?.status === 429) {
        toast.error('Rate limit exceeded', {
          description:
            errorData.message ||
            'You have reached your daily limit for claim research.',
        });
      } else {
        toast.error('Failed to open investigation', {
          description:
            errorData?.message ||
            'An unexpected error occurred. Please try again.',
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
          We break claims into verifiable facts, cross-check sources, and score
          evidence strength.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="claim-text" className="text-sm font-medium">
              Enter a statement to verify
            </Label>

            {/* Guardrail Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-md text-xs flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <p>
                This tool checks if a statement is true or false. It is{' '}
                <strong>not a search engine</strong> for general questions
                (e.g., "what is the price of gold").
              </p>
            </div>

            <Textarea
              id="claim-text"
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="Paste a headline, rumor, or statement here to fact-check..."
              rows={4}
              className="resize-none text-sm p-3 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500/20 transition-all"
              minLength={10}
              maxLength={1000}
              required
            />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500 font-medium">
                  Try an example:
                </span>
                <span
                  className={`text-xs ${claimText.length >= 1000 ? 'text-red-500' : 'text-zinc-400'}`}
                >
                  {claimText.length}/1000
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_CLAIMS.map((example) => (
                  <Badge
                    key={example}
                    variant="secondary"
                    className="cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-normal text-xs py-1"
                    onClick={() => handleExampleClick(example)}
                  >
                    "{example}"
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="context"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
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
                analyzing evidence...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-5 w-5" />
                Verify This Claim
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
