'use client';

import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ApproveDialog } from '@/components/admin/ApproveDialog';
import { DeleteDialog } from '@/components/admin/DeleteDialog';
import { EntryDetailDialog } from '@/components/admin/EntryDetailDialog';
import { RejectDialog } from '@/components/admin/RejectDialog';
import { WaitlistFilters } from '@/components/admin/WaitlistFilters';
import { WaitlistPagination } from '@/components/admin/WaitlistPagination';
import { WaitlistStats } from '@/components/admin/WaitlistStats';
import { WaitlistTable } from '@/components/admin/WaitlistTable';
import { useAuth } from '@/context/AuthContext';
import {
  useApproveWaitlistEntry,
  useDeleteWaitlistEntry,
  useRejectWaitlistEntry,
  useWaitlistEntries,
} from '@/hooks/useWaitlist';
import type {
  WaitlistEntry,
  WaitlistQueryParams,
} from '@/types/waitlist-admin';

export default function WaitlistManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Filters and pagination state
  const [filters, setFilters] = useState<WaitlistQueryParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Dialog states
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(
    null,
  );
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Data fetching
  const { data: entriesData, isLoading: entriesLoading } =
    useWaitlistEntries(filters);

  // Mutations
  const { mutate: approve, isPending: isApproving } = useApproveWaitlistEntry();
  const { mutate: reject, isPending: isRejecting } = useRejectWaitlistEntry();
  const { mutate: deleteEntry, isPending: isDeleting } =
    useDeleteWaitlistEntry();

  // Auth check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    router.push('/dashboard');
    return null;
  }

  // Handlers
  const handleFiltersChange = (newFilters: WaitlistQueryParams) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ ...filters, limit, page: 1 });
  };

  const handleViewEntry = (entry: WaitlistEntry) => {
    setSelectedEntry(entry);
    setDetailDialogOpen(true);
  };

  const handleApprove = (entry: WaitlistEntry) => {
    setSelectedEntry(entry);
    setApproveDialogOpen(true);
  };

  const handleReject = (entry: WaitlistEntry) => {
    setSelectedEntry(entry);
    setRejectDialogOpen(true);
  };

  const handleDelete = (entry: WaitlistEntry) => {
    setSelectedEntry(entry);
    setDeleteDialogOpen(true);
  };

  const confirmApprove = (notes?: string, sendEmail?: boolean) => {
    if (!selectedEntry) return;
    approve(
      { id: selectedEntry._id, input: { notes, sendEmail } },
      {
        onSuccess: () => {
          setApproveDialogOpen(false);
          setSelectedEntry(null);
        },
      },
    );
  };

  const confirmReject = (notes?: string, sendEmail?: boolean) => {
    if (!selectedEntry) return;
    reject(
      { id: selectedEntry._id, input: { notes, sendEmail } },
      {
        onSuccess: () => {
          setRejectDialogOpen(false);
          setSelectedEntry(null);
        },
      },
    );
  };

  const confirmDelete = () => {
    if (!selectedEntry) return;
    deleteEntry(selectedEntry._id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedEntry(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1
                className="text-3xl font-bold text-gray-900 mb-1"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                Waitlist Management
              </h1>
              <p className="text-gray-600 text-sm">
                Manage and review waitlist entries
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <WaitlistStats />

        {/* Filters */}
        <WaitlistFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Table */}
        <WaitlistTable
          entries={entriesData?.data || []}
          isLoading={entriesLoading}
          onViewEntry={handleViewEntry}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {entriesData?.pagination && (
          <WaitlistPagination
            pagination={entriesData.pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>

      {/* Dialogs */}
      <ApproveDialog
        entry={selectedEntry}
        isOpen={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={confirmApprove}
        isPending={isApproving}
      />

      <RejectDialog
        entry={selectedEntry}
        isOpen={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={confirmReject}
        isPending={isRejecting}
      />

      <DeleteDialog
        entry={selectedEntry}
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        isPending={isDeleting}
      />

      <EntryDetailDialog
        entry={selectedEntry}
        isOpen={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
      />
    </div>
  );
}
