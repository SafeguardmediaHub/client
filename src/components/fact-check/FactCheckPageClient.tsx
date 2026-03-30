"use client";

import { AlertCircle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  FEATURE_INFO,
  FeatureInfoDialog,
} from "@/components/FeatureInfoDialog";
import { AccessNotice } from "@/components/subscription/AccessNotice";
import { UsageSummaryBanner } from "@/components/subscription/UsageSummaryBanner";
import { Button } from "@/components/ui/button";
import { useAnalyzeContent } from "@/hooks/useFactCheck";
import { useSubscriptionUsage } from "@/hooks/useSubscriptionUsage";
import {
  formatResetDate,
  getDeniedStateFromError,
  getFeatureState,
  getLimitReachedMessage,
  getUsageGate,
} from "@/lib/subscription-access";
import type { AnalyzeContentRequest } from "@/types/fact-check";
import { ClaimDetail } from "./ClaimDetail";
import { FactCheckForm } from "./FactCheckForm";
import { FactCheckProcessing } from "./FactCheckProcessing";

export function FactCheckPageClient({
  initialJobId,
  initialClaimId,
}: {
  initialJobId?: string;
  initialClaimId?: string;
}) {
  const router = useRouter();
  const [currentJobId, setCurrentJobId] = useState<string | null>(
    initialJobId ?? null,
  );
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(
    initialClaimId ?? null,
  );
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const subscriptionUsageQuery = useSubscriptionUsage();
  const factCheckAccessState = getFeatureState(
    subscriptionUsageQuery.data,
    "factCheck",
  );
  const analysisUsage = subscriptionUsageQuery.data?.usage.analyses;
  const analysisUsageGate = getUsageGate(analysisUsage);

  const analyzeContentMutation = useAnalyzeContent();
  const mutationError = analyzeContentMutation.error as
    | { response?: { data?: { message?: string; error?: string } } }
    | undefined;

  useEffect(() => {
    if (!currentJobId) {
      setShowInfoDialog(true);
    }
  }, [currentJobId]);

  useEffect(() => {
    setCurrentJobId(initialJobId ?? null);
    setSelectedClaimId(initialClaimId ?? null);
  }, [initialClaimId, initialJobId]);

  const handleFormSubmit = (data: AnalyzeContentRequest) => {
    if (!factCheckAccessState.available) {
      toast.error(
        factCheckAccessState.message || "Fact-checking is unavailable.",
      );
      return;
    }
    if (!analysisUsageGate.allowed) {
      toast.error(
        `You have reached your monthly analysis limit. Your limit resets on ${formatResetDate(
          subscriptionUsageQuery.data?.currentPeriod.endDate,
        )}.`,
      );
      return;
    }

    analyzeContentMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success && response.data.job_id) {
          const jobId = response.data.job_id;
          setCurrentJobId(jobId);
          setSelectedClaimId(null);
          router.push(`/dashboard/fact-check?jobId=${jobId}`);

          toast.success(
            response.message || "Fact-check analysis started successfully!",
            {
              description: `Estimated completion: ~${response.data.estimated_completion_seconds}s`,
            },
          );
        }
      },
      onError: (error: unknown) => {
        console.error("Failed to start fact-check:", error);
        const denialState = getDeniedStateFromError(error);
        const errorMessage =
          denialState.kind === "limit"
            ? `You have reached your monthly analysis limit. Used ${denialState.used ?? analysisUsage?.used ?? 0} of ${denialState.limit ?? analysisUsage?.limit ?? 0}. Your limit resets on ${formatResetDate(
                denialState.resetsAt ||
                  subscriptionUsageQuery.data?.currentPeriod.endDate,
              )}.`
            : denialState.kind === "plan" || denialState.kind === "unavailable"
              ? denialState.message
              : mutationError?.response?.data?.message ||
                mutationError?.response?.data?.error ||
                (error instanceof Error ? error.message : "Unknown error");
        toast.error(`Failed to start fact-check: ${errorMessage}`);
      },
    });
  };

  const handleViewClaimDetail = (claimId: string) => {
    setSelectedClaimId(claimId);
    router.push(
      `/dashboard/fact-check?jobId=${currentJobId}&claimId=${claimId}`,
    );
  };

  const handleBackToClaims = () => {
    setSelectedClaimId(null);
    router.push(`/dashboard/fact-check?jobId=${currentJobId}`);
  };

  const handleStartNew = () => {
    setCurrentJobId(null);
    setSelectedClaimId(null);
    router.push("/dashboard/fact-check");
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-medium text-gray-900 leading-9">
              Fact-Check Analysis
            </h1>
            <p className="text-sm font-medium text-gray-600 leading-[21px]">
              Extract and verify claims from text content using trusted
              fact-checking sources
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {currentJobId && (
              <Button
                onClick={handleStartNew}
                className="h-10 px-6 bg-blue-600 hover:bg-blue-500 rounded-xl flex-shrink-0 cursor-pointer w-full sm:w-auto"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span className="text-base font-medium text-white whitespace-nowrap">
                  New Analysis
                </span>
              </Button>
            )}
          </div>
        </div>

        <FeatureInfoDialog
          open={showInfoDialog}
          onOpenChange={setShowInfoDialog}
          featureInfo={FEATURE_INFO.factCheck}
        />

        <UsageSummaryBanner
          bucket={analysisUsage}
          label="Analysis usage"
          resetAt={subscriptionUsageQuery.data?.currentPeriod.endDate}
        />

        {!factCheckAccessState.available && (
          <AccessNotice
            state={factCheckAccessState}
            message={
              factCheckAccessState.message ||
              "Fact-checking is currently unavailable."
            }
          />
        )}

        {factCheckAccessState.available && !analysisUsageGate.allowed && (
          <AccessNotice
            tone="limit"
            title="Analysis limit reached"
            message={getLimitReachedMessage(
              "analysis",
              subscriptionUsageQuery.data?.currentPeriod.endDate,
              analysisUsage?.used,
              analysisUsage?.limit,
            )}
          />
        )}

        {!currentJobId ? (
          <div className="p-8 bg-white border border-gray-200 rounded-lg">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Submit Content for Fact-Checking
              </h2>
              <p className="text-sm text-gray-600">
                Paste or type the text you want to fact-check. Our system will
                extract claims and verify them against trusted fact-checking
                databases.
              </p>
            </div>

            <FactCheckForm
              onSubmit={handleFormSubmit}
              isLoading={analyzeContentMutation.isPending}
              disabled={
                !factCheckAccessState.available || !analysisUsageGate.allowed
              }
              disabledMessage={
                factCheckAccessState.message ||
                (analysisUsageGate.allowed
                  ? undefined
                  : getLimitReachedMessage(
                      "analysis",
                      subscriptionUsageQuery.data?.currentPeriod.endDate,
                      analysisUsage?.used,
                      analysisUsage?.limit,
                    ))
              }
              disabledTone={analysisUsageGate.allowed ? "feature" : "limit"}
            />

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                How it works
              </h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Submit text content (minimum 50 characters)</li>
                <li>Our AI extracts verifiable claims from the content</li>
                <li>
                  Each claim is cross-referenced with fact-checking databases
                </li>
                <li>
                  View verdicts from trusted sources like PolitiFact, Snopes,
                  and more
                </li>
              </ol>
            </div>
          </div>
        ) : selectedClaimId ? (
          <ClaimDetail claimId={selectedClaimId} onBack={handleBackToClaims} />
        ) : (
          <div className="space-y-6">
            <FactCheckProcessing
              jobId={currentJobId}
              onViewDetails={handleViewClaimDetail}
            />
          </div>
        )}
      </div>
    </div>
  );
}
