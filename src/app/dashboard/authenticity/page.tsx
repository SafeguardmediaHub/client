'use client';

import {
  AlertTriangle,
  CheckCircle,
  CircleDashed,
  LayoutGrid,
  ShieldAlert,
  Upload,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import {
  MediaInfoBlock,
  StatsCard,
  StatsCardSkeleton,
  SummaryCard,
  SummaryCardSkeleton,
  VerificationFilters,
  VerificationTable,
} from '@/components/c2pa';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useDeleteVerification,
  useVerificationStats,
  useVerificationSummary,
  useVerifications,
} from '@/hooks/useC2PA';
import type { C2PAVerification, VerificationsListParams } from '@/types/c2pa';

function OverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse filters from URL
  const initialFilters: VerificationsListParams = {
    page: Number(searchParams.get('page')) || 1,
    limit: 10,
    status:
      (searchParams.get('status') as VerificationsListParams['status']) ||
      undefined,
    mediaType:
      (searchParams.get('mediaType') as VerificationsListParams['mediaType']) ||
      undefined,
    search: searchParams.get('search') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
  };

  const [filters, setFilters] =
    useState<VerificationsListParams>(initialFilters);
  const [selectedVerification, setSelectedVerification] =
    useState<C2PAVerification | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Queries
  const statsQuery = useVerificationStats();
  const verificationsQuery = useVerifications(filters);
  const deleteMutation = useDeleteVerification();

  const summaryQuery = useVerificationSummary(
    selectedVerification?.verificationId || '',
    {
      enabled: !!selectedVerification && isSheetOpen,
    }
  );

  // Handlers
  const handleFiltersChange = (newFilters: VerificationsListParams) => {
    setFilters(newFilters);

    // Update URL
    const params = new URLSearchParams();
    if (newFilters.page && newFilters.page > 1)
      params.set('page', String(newFilters.page));
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.mediaType) params.set('mediaType', newFilters.mediaType);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.startDate) params.set('startDate', newFilters.startDate);
    if (newFilters.endDate) params.set('endDate', newFilters.endDate);

    const queryString = params.toString();
    router.push(
      `/dashboard/authenticity${queryString ? `?${queryString}` : ''}`
    );
  };

  const handlePageChange = (page: number) => {
    handleFiltersChange({ ...filters, page });
  };

  const handleViewDetails = (verificationId: string) => {
    router.push(`/dashboard/authenticity/${verificationId}`);
  };

  const handleRowClick = (verification: C2PAVerification) => {
    setSelectedVerification(verification);
    setIsSheetOpen(true);
  };

  const handleDelete = async (verificationId: string) => {
    try {
      await deleteMutation.mutateAsync(verificationId);
      toast.success('Verification deleted successfully');
    } catch (error) {
      toast.error('Failed to delete verification');
      console.error('Delete error:', error);
    }
  };

  const stats = statsQuery.data?.data;
  const verifications = verificationsQuery.data?.data.verifications || [];
  const pagination = verificationsQuery.data?.data.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-gray-900 leading-9">
            Authenticity Overview
          </h1>
          <p className="text-sm font-medium text-gray-600 leading-[21px]">
            Monitor and manage C2PA content authenticity verifications
          </p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/authenticity/verify')}
          className="h-10 px-6 bg-blue-600 hover:bg-blue-500 rounded-xl flex-shrink-0 w-full md:w-auto"
        >
          <Upload className="w-4 h-4 mr-2" />
          <span className="text-base font-medium text-white whitespace-nowrap">
            Verify Media
          </span>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsQuery.isLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Total"
              value={stats?.counts?.total || 0}
              icon={LayoutGrid}
              variant="default"
              description={`${
                stats?.counts?.avgProcessingTime
                  ? `Avg: ${(stats.counts.avgProcessingTime / 1000).toFixed(
                      1
                    )}s`
                  : ''
              }`}
            />
            <StatsCard
              title="Verified"
              value={stats?.counts?.verified || 0}
              icon={CheckCircle}
              variant="success"
              description={`${
                stats?.percentages?.verifiedRate?.toFixed(1) || 0
              }% verified`}
            />
            <StatsCard
              title="Tampered"
              value={stats?.counts?.tampered || 0}
              icon={ShieldAlert}
              variant="danger"
              description={`${
                stats?.percentages?.tamperRate?.toFixed(1) || 0
              }% tampered`}
            />
            <StatsCard
              title="Invalid"
              value={
                (stats?.counts?.invalidSignature || 0) +
                (stats?.counts?.invalidCertificate || 0)
              }
              icon={AlertTriangle}
              variant="warning"
              description={`Sig: ${
                stats?.counts?.invalidSignature || 0
              } / Cert: ${stats?.counts?.invalidCertificate || 0}`}
            />
            <StatsCard
              title="No Manifest"
              value={stats?.counts?.noManifest || 0}
              icon={CircleDashed}
              variant="neutral"
              description={`${
                stats?.percentages?.manifestPresenceRate?.toFixed(1) || 0
              }% with manifest`}
            />
          </>
        )}
      </div>

      {/* Filters */}
      <VerificationFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Verifications table */}
      <VerificationTable
        verifications={verifications}
        pagination={pagination}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
        isLoading={verificationsQuery.isLoading}
      />

      {/* Quick view sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto p-4">
          <SheetHeader>
            <SheetTitle>Quick View</SheetTitle>
            <SheetDescription>
              Verification summary for selected media
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {selectedVerification && (
              <>
                {/* Media info */}
                <MediaInfoBlock
                  fileName={selectedVerification.fileName ?? 'Unknown file'}
                  fileSize={selectedVerification.fileSize ?? 0}
                  mediaType={selectedVerification.mediaType}
                  thumbnailUrl={selectedVerification.thumbnailUrl}
                  uploadedAt={selectedVerification.createdAt}
                  size="lg"
                />

                {/* Summary */}
                {summaryQuery.isLoading ? (
                  <SummaryCardSkeleton />
                ) : summaryQuery.data?.data ? (
                  <SummaryCard summary={summaryQuery.data.data} />
                ) : null}

                {/* View full details button */}
                <Button
                  onClick={() =>
                    handleViewDetails(selectedVerification.verificationId)
                  }
                  className="w-full"
                >
                  View Full Details
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

export default function AuthenticityOverviewPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OverviewContent />
    </Suspense>
  );
}
