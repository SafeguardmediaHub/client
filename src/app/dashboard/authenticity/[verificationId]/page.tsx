/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
'use client';

import {
  ArrowLeft,
  Clock,
  Download,
  Loader2,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  MediaInfoBlock,
  MediaInfoBlockSkeleton,
  MetadataViewer,
  StatusBadge,
  SummaryCard,
  SummaryCardSkeleton,
  VerificationSteps,
} from '@/components/c2pa';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDeleteVerification,
  useVerificationDetails,
  useVerificationStream,
} from '@/hooks/useC2PA';
import { cn } from '@/lib/utils';
import type { VerificationStreamUpdate } from '@/types/c2pa';

export default function VerificationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const verificationId = params.verificationId as string;

  const [streamUpdates, setStreamUpdates] = useState<
    VerificationStreamUpdate[]
  >([]);
  const [currentStep, setCurrentStep] = useState<string | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const detailsQuery = useVerificationDetails(verificationId);
  const deleteMutation = useDeleteVerification();
  const details = detailsQuery.data?.data;
  const isProcessing = details?.status === 'processing';

  // Stream hook for processing state
  const stream = useVerificationStream(verificationId, {
    enabled: isProcessing,
    onUpdate: (update) => {
      setStreamUpdates((prev) => [...prev, update]);
      setCurrentStep(update.step);
    },
    onComplete: () => {
      toast.success('Verification completed!');
      detailsQuery.refetch();
    },
    onError: () => {
      toast.error('Verification stream disconnected');
    },
  });

  // Effect to track stream updates
  useEffect(() => {
    if (stream.latestUpdate) {
      setCurrentStep(stream.latestUpdate.step);
    }
  }, [stream.latestUpdate]);

  const handleBack = () => {
    router.push('/dashboard/authenticity');
  };

  const handleRefresh = () => {
    detailsQuery.refetch();
  };

  const handleDownloadReport = () => {
    toast.info('Report download starting...');
    // Implementation would go here
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(verificationId);
      toast.success('Verification deleted successfully');
      router.push('/dashboard/authenticity');
    } catch (error) {
      toast.error('Failed to delete verification');
      console.error('Delete error:', error);
    }
  };

  // Show starting state during initial load or 404 retries
  if (detailsQuery.isLoading) {
    return (
      <VerificationStartingState
        verificationId={verificationId}
        onBack={handleBack}
      />
    );
  }

  // Show starting state if we're retrying due to 404 (verification is being set up)
  if (
    detailsQuery.isError &&
    (detailsQuery.error as any)?.response?.status === 404 &&
    detailsQuery.fetchStatus === 'fetching'
  ) {
    return (
      <VerificationStartingState
        verificationId={verificationId}
        onBack={handleBack}
      />
    );
  }

  // Only show "not found" error after all retries are exhausted
  if (detailsQuery.isError || !details) {
    const is404 = (detailsQuery.error as any)?.response?.status === 404;

    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 p-8 min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {is404 ? 'Verification Not Found' : 'Error Loading Verification'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {is404
              ? "The verification you're looking for doesn't exist or has been removed."
              : 'An error occurred while loading the verification details.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="size-4 mr-2" />
            Back to Overview
          </Button>
          {!is404 && (
            <Button onClick={() => detailsQuery.refetch()} variant="default">
              <RefreshCw className="size-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Parse mediaId if it's a stringified object
  let parsedMediaId: any = null;
  try {
    if (
      typeof details.mediaId === 'string' &&
      details.mediaId.includes('ObjectId')
    ) {
      // Extract data from the stringified MongoDB object
      const filenameMatch = details.mediaId.match(
        /originalFilename:\s*'([^']+)'/
      );
      const thumbnailMatch = details.mediaId.match(/thumbnailUrl:\s*'([^']+)'/);
      const mimeTypeMatch = details.mediaId.match(/mimeType:\s*'([^']+)'/);

      parsedMediaId = {
        originalFilename: filenameMatch?.[1],
        thumbnailUrl: thumbnailMatch?.[1],
        mimeType: mimeTypeMatch?.[1],
      };
    } else if (typeof details.mediaId === 'object') {
      parsedMediaId = details.mediaId;
    }
  } catch (e) {
    console.error('Failed to parse mediaId:', e);
  }

  const fileName =
    parsedMediaId?.originalFilename || details.fileName || 'Unknown file';
  const thumbnailUrl = parsedMediaId?.thumbnailUrl || details.thumbnailUrl;
  const mimeType = parsedMediaId?.mimeType;

  // Determine media type from mimeType or fall back to details.mediaType
  const mediaType: 'image' | 'video' | 'audio' | 'document' =
    details.mediaType ||
    (mimeType?.startsWith('image/')
      ? 'image'
      : mimeType?.startsWith('video/')
      ? 'video'
      : mimeType?.startsWith('audio/')
      ? 'audio'
      : 'document');

  // Use a default file size if not available
  const fileSize = parsedMediaId.fileSize || 0;

  // Map backend response to frontend summary structure
  const summary: any = {
    status: details.status,
    statusReason: details.errors?.[0] || details.insights?.[0],
    manifestFound: details.manifestPresent || false,
    signatureValid: details.signatureValid || false,
    certificateChainValid: details.certificate?.valid || false,
    integrityPassed: details.integrity === 'intact',
    aiMarkersDetected: details.aiGenerated === true,
    creator: details.creator?.name
      ? {
          name: details.creator.name,
          software: details.creator.software,
          signedAt: details.signedAt,
        }
      : undefined,
    warnings: details.errors || [],
  };

  return (
    <div className="w-full flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="size-4 mr-1" />
            Back
          </Button>
          <StatusBadge status={details.status} size="lg" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="size-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadReport}>
            <Download className="size-4 mr-1" />
            Download Report
          </Button>
          {showDeleteConfirm ? (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="size-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Media info */}
      <div className="p-6 bg-white border border-gray-200 rounded-xl">
        <MediaInfoBlock
          fileName={fileName}
          fileSize={fileSize}
          mediaType={mediaType}
          thumbnailUrl={thumbnailUrl}
          uploadedAt={details.createdAt}
          size="lg"
        />
      </div>

      {/* Processing state */}
      {isProcessing && (
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Verification in Progress
          </h3>
          <VerificationSteps
            updates={streamUpdates}
            currentStep={currentStep}
          />
          {stream.isConnected && (
            <p className="text-xs text-blue-600 mt-4 flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-blue-500" />
              </span>
              Connected to live updates
            </p>
          )}
        </div>
      )}

      {/* Completed/Error state - Tabs */}
      {!isProcessing && (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="manifest">Manifest</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SummaryCard
                summary={summary}
                onDownloadReport={handleDownloadReport}
              />

              {/* Additional Info Card */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Verification Details
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Job Status:</dt>
                    <dd className="font-medium text-gray-900">
                      {details.jobStatus || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Processing Time:</dt>
                    <dd className="font-medium text-gray-900">
                      {details.processingTimeMs
                        ? `${(details.processingTimeMs / 1000).toFixed(2)}s`
                        : 'N/A'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Verified At:</dt>
                    <dd className="font-medium text-gray-900">
                      {details.verifiedAt
                        ? new Date(details.verifiedAt).toLocaleString()
                        : 'N/A'}
                    </dd>
                  </div>
                  {details.signedAt && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Signed At:</dt>
                      <dd className="font-medium text-gray-900">
                        {new Date(details.signedAt).toLocaleString()}
                      </dd>
                    </div>
                  )}
                  {details.certificate?.issuer && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Certificate Issuer:</dt>
                      <dd className="font-medium text-gray-900">
                        {details.certificate.issuer}
                      </dd>
                    </div>
                  )}
                  {details.editedAfterSigning !== null && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Edited After Signing:</dt>
                      <dd className="font-medium text-gray-900">
                        {details.editedAfterSigning ? 'Yes' : 'No'}
                      </dd>
                    </div>
                  )}
                </dl>

                {/* Insights */}
                {details.insights && details.insights.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Insights
                    </h4>
                    <ul className="space-y-2">
                      {details.insights.map(
                        (insight: string, index: number) => (
                          <li
                            key={index}
                            className="text-sm text-blue-700 bg-blue-50 rounded-lg p-2"
                          >
                            {insight}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Manifest Tab */}
          <TabsContent value="manifest" className="mt-0">
            <div className="p-6 bg-white border border-gray-200 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Manifest Information
              </h3>
              {details.manifestPresent ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-sm text-emerald-700">
                      C2PA manifest detected in this file
                    </p>
                    {details.manifestVersion && (
                      <p className="text-xs text-emerald-600 mt-1">
                        Version: {details.manifestVersion}
                      </p>
                    )}
                  </div>

                  {/* Edit History */}
                  {details.editHistory && details.editHistory.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Edit History
                      </h4>
                      <div className="space-y-2">
                        {details.editHistory.map((edit: any, index: number) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-3 text-sm"
                          >
                            <p className="font-medium text-gray-900">
                              {edit.action || 'Unknown action'}
                            </p>
                            {edit.timestamp && (
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(edit.timestamp).toLocaleString()}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {details.editHistory?.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No edit history available. This may be the original file
                      or edit history was not recorded.
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    No C2PA manifest found in this file. The file may not have
                    been signed with C2PA-compliant software.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="mt-0">
            <div className="p-6 bg-white border border-gray-200 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Certificate Information
              </h3>
              {details.certificate?.issuer ? (
                <div className="space-y-4">
                  <div
                    className={cn(
                      'border rounded-lg p-4',
                      details.certificate.valid
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-red-50 border-red-200'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {details.certificate.issuer}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Certificate Issuer
                        </p>
                      </div>
                      <span
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          details.certificate.valid
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        )}
                      >
                        {details.certificate.valid ? 'Valid' : 'Invalid'}
                      </span>
                    </div>

                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Status:</dt>
                        <dd className="font-medium text-gray-900">
                          {details.certificate.expired ? 'Expired' : 'Active'}
                        </dd>
                      </div>
                      {details.certificate.expiresAt && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Expires:</dt>
                          <dd className="font-medium text-gray-900">
                            {new Date(
                              details.certificate.expiresAt
                            ).toLocaleDateString()}
                          </dd>
                        </div>
                      )}
                      {details.signatureAlgorithm && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Algorithm:</dt>
                          <dd className="font-medium text-gray-900">
                            {details.signatureAlgorithm}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    No certificate information available. This may indicate the
                    file was not signed or the certificate data could not be
                    extracted.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="mt-0">
            <div className="p-6 bg-white border border-gray-200 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Verification Metadata
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Complete verification data from the backend.
              </p>
              <MetadataViewer
                data={details as unknown as Record<string, unknown>}
              />
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-0">
            <div className="p-6 bg-white border border-gray-200 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Verification Timeline
              </h3>

              {/* Verification Steps */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                      'bg-blue-500'
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Verification Started
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(details.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {details.manifestPresent && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2 bg-emerald-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        C2PA Manifest Detected
                      </p>
                      <p className="text-xs text-gray-500">
                        Manifest found in file
                      </p>
                    </div>
                  </div>
                )}

                {details.signatureValid !== null && (
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                        details.signatureValid ? 'bg-emerald-500' : 'bg-red-500'
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Signature Verification
                      </p>
                      <p className="text-xs text-gray-500">
                        {details.signatureValid
                          ? 'Signature is valid'
                          : 'Signature verification failed'}
                      </p>
                    </div>
                  </div>
                )}

                {details.certificate && (
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                        details.certificate.valid
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Certificate Validation
                      </p>
                      <p className="text-xs text-gray-500">
                        {details.certificate.valid
                          ? `Valid certificate from ${details.certificate.issuer}`
                          : `Certificate validation failed: ${
                              details.errors?.[0] || 'Unknown error'
                            }`}
                      </p>
                    </div>
                  </div>
                )}

                {details.integrity && (
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                        details.integrity === 'intact'
                          ? 'bg-emerald-500'
                          : 'bg-red-500'
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Integrity Check
                      </p>
                      <p className="text-xs text-gray-500">
                        Content integrity is {details.integrity}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                      details.jobStatus === 'completed'
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Verification Completed
                    </p>
                    <p className="text-xs text-gray-500">
                      {details.verifiedAt
                        ? new Date(details.verifiedAt).toLocaleString()
                        : 'N/A'}
                      {details.processingTimeMs &&
                        ` • Took ${(details.processingTimeMs / 1000).toFixed(
                          2
                        )}s`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function VerificationStartingState({
  verificationId,
  onBack,
}: {
  verificationId: string;
  onBack: () => void;
}) {
  return (
    <div className="w-full flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4 mr-1" />
          Back
        </Button>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center animate-in fade-in slide-in-from-bottom-4">
          {/* Animated loader */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-20 rounded-full bg-blue-100 animate-ping opacity-20" />
            </div>
            <div className="relative flex items-center justify-center size-20 rounded-full bg-blue-50">
              <Loader2 className="size-10 text-blue-600 animate-spin" />
            </div>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Verification Starting...
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Setting up C2PA verification process. This usually takes just a
            moment.
          </p>

          {/* Info card */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-md">
            <div className="flex items-center gap-3 text-left">
              <Clock className="size-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Estimated Time: ~30 seconds
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  We're analyzing the media for C2PA content credentials
                </p>
              </div>
            </div>
          </div>

          {/* Verification ID */}
          <div className="mt-8 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-mono">
              ID: {verificationId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailsLoadingState() {
  return (
    <div className="w-full flex flex-col gap-6 p-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>

      {/* Media info skeleton */}
      <div className="p-6 bg-white border border-gray-200 rounded-xl">
        <MediaInfoBlockSkeleton size="lg" />
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SummaryCardSkeleton />
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
