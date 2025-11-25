'use client';

import {
  AlertTriangle,
  CheckCircle,
  CircleDashed,
  LayoutGrid,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import {
  StatsCard,
  StatsCardSkeleton,
  VerificationFilters,
  VerificationTable,
  SummaryCard,
  SummaryCardSkeleton,
  MediaInfoBlock,
  MediaInfoBlockSkeleton,
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
  useVerifications,
  useVerificationStats,
  useVerificationSummary,
} from '@/hooks/useC2PA';
import type { C2PAVerification, VerificationsListParams } from '@/types/c2pa';

function OverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse filters from URL
  const initialFilters: VerificationsListParams = {
    page: Number(searchParams.get('page')) || 1,
    limit: 10,
    status: searchParams.get('status') as VerificationsListParams['status'] || undefined,
    mediaType: searchParams.get('mediaType') as VerificationsListParams['mediaType'] || undefined,
    search: searchParams.get('search') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
  };

  const [filters, setFilters] = useState<VerificationsListParams>(initialFilters);
  const [selectedVerification, setSelectedVerification] = useState<C2PAVerification | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Queries
  const statsQuery = useVerificationStats();
  const verificationsQuery = useVerifications(filters);

  const summaryQuery = useVerificationSummary(selectedVerification?.id || '', {
    enabled: !!selectedVerification && isSheetOpen,
  });

  // Handlers
  const handleFiltersChange = (newFilters: VerificationsListParams) => {
    setFilters(newFilters);

    // Update URL
    const params = new URLSearchParams();
    if (newFilters.page && newFilters.page > 1) params.set('page', String(newFilters.page));
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.mediaType) params.set('mediaType', newFilters.mediaType);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.startDate) params.set('startDate', newFilters.startDate);
    if (newFilters.endDate) params.set('endDate', newFilters.endDate);

    const queryString = params.toString();
    router.push(`/dashboard/authenticity${queryString ? `?${queryString}` : ''}`);
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

  const stats = statsQuery.data?.data;
  const verifications = verificationsQuery.data?.data.verifications || [];
  const pagination = verificationsQuery.data?.data.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  return (
    <div className="w-full flex flex-col gap-6 p-8">
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
          className="h-10 px-6 bg-blue-600 hover:bg-blue-500 rounded-xl flex-shrink-0"
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
              title="Verified"
              value={stats?.verified || 0}
              icon={CheckCircle}
              variant="success"
              change={stats?.weeklyChange?.verified}
              changeLabel="this week"
            />
            <StatsCard
              title="Tampered"
              value={stats?.tampered || 0}
              icon={ShieldAlert}
              variant="danger"
              change={stats?.weeklyChange?.tampered}
              changeLabel="this week"
            />
            <StatsCard
              title="Invalid Signature"
              value={stats?.invalidSignature || 0}
              icon={AlertTriangle}
              variant="warning"
            />
            <StatsCard
              title="No C2PA"
              value={stats?.noC2PA || 0}
              icon={CircleDashed}
              variant="neutral"
              change={stats?.weeklyChange?.noC2PA}
              changeLabel="this week"
            />
            <StatsCard
              title="Total"
              value={stats?.total || 0}
              icon={LayoutGrid}
              variant="default"
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
        isLoading={verificationsQuery.isLoading}
      />

      {/* Quick view sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
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
                  fileName={selectedVerification.fileName}
                  fileSize={selectedVerification.fileSize}
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
                  onClick={() => handleViewDetails(selectedVerification.id)}
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
    <div className="w-full flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
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
