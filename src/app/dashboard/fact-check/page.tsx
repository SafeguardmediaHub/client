'use client';

import { AlertCircle, ArrowLeft, FileText, Info } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ClaimDetail } from '@/components/fact-check/ClaimDetail';
import { ClaimList } from '@/components/fact-check/ClaimList';
import { FactCheckForm } from '@/components/fact-check/FactCheckForm';
import { FactCheckProcessing } from '@/components/fact-check/FactCheckProcessing';
import { LoadingState } from '@/components/fact-check/LoadingState';
import {
  FeatureInfoDialog,
  FEATURE_INFO,
} from '@/components/FeatureInfoDialog';
import { Button } from '@/components/ui/button';
import { useAnalyzeContent, useJobStatus } from '@/hooks/useFactCheck';
import type { AnalyzeContentRequest } from '@/types/fact-check';

const FactCheckContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobIdFromUrl = searchParams.get('jobId');
  const claimIdFromUrl = searchParams.get('claimId');

  const [currentJobId, setCurrentJobId] = useState<string | null>(jobIdFromUrl);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(
    claimIdFromUrl
  );
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const analyzeContentMutation = useAnalyzeContent();
  const jobStatusQuery = useJobStatus(currentJobId || '', {
    enabled: !!currentJobId && !selectedClaimId,
  });

  // Show dialog on first visit (only when no job is active)
  useEffect(() => {
    if (!currentJobId) {
      setShowInfoDialog(true);
    }
  }, [currentJobId]);

  const handleFormSubmit = (data: AnalyzeContentRequest) => {
    analyzeContentMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success && response.data.job_id) {
          const jobId = response.data.job_id;
          setCurrentJobId(jobId);
          setSelectedClaimId(null);

          // Update URL with job ID
          router.push(`/dashboard/fact-check?jobId=${jobId}`);

          toast.success(response.message || 'Fact-check analysis started successfully!', {
            description: `Estimated completion: ~${response.data.estimated_completion_seconds}s`,
          });
        }
      },
      onError: (error: any) => {
        console.error('Failed to start fact-check:', error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          (error instanceof Error ? error.message : 'Unknown error');
        toast.error(`Failed to start fact-check: ${errorMessage}`);
      },
    });
  };

  const handleViewClaimDetail = (claimId: string) => {
    setSelectedClaimId(claimId);
    router.push(
      `/dashboard/fact-check?jobId=${currentJobId}&claimId=${claimId}`
    );
  };

  const handleBackToClaims = () => {
    setSelectedClaimId(null);
    router.push(`/dashboard/fact-check?jobId=${currentJobId}`);
  };

  const handleStartNew = () => {
    setCurrentJobId(null);
    setSelectedClaimId(null);
    router.push('/dashboard/fact-check');
  };

  const jobStatus = jobStatusQuery.data?.data.status;
  const claims = jobStatusQuery.data?.data.claims || [];

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="cursor-pointer w-full sm:w-auto"
            >
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfoDialog(true)}
              className="cursor-pointer w-full sm:w-auto"
            >
              <Info className="size-4 mr-2" />
              How it works
            </Button>
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
            <FactCheckProcessing jobId={currentJobId} />

            {jobStatus === 'completed' &&
              (claims.length === 0 ? (
                <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                        No Claims Detected
                      </h3>
                      <p className="text-sm text-yellow-800 mb-4">
                        The analysis completed successfully, but no verifiable
                        claims were detected in the provided content. This could
                        be because:
                      </p>
                      <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                        <li>
                          The text contains opinions rather than factual claims
                        </li>
                        <li>Claims are too vague or general to fact-check</li>
                        <li>
                          The content is too short or lacks specific assertions
                        </li>
                      </ul>
                      <Button
                        onClick={handleStartNew}
                        variant="outline"
                        className="mt-4 cursor-pointer border-yellow-300 hover:bg-yellow-100"
                      >
                        Try Different Content
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-white border border-gray-200 rounded-lg">
                  <ClaimList
                    claims={claims}
                    onViewDetails={handleViewClaimDetail}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FactCheckPage = () => {
  return (
    <Suspense fallback={<LoadingState message="Loading fact-check..." />}>
      <FactCheckContent />
    </Suspense>
  );
};

export default FactCheckPage;
