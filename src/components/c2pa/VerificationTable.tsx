/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
'use client';

import {
  Eye,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Trash2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { C2PAVerification, MediaType } from '@/types/c2pa';
import { StatusBadge } from './StatusBadge';

interface VerificationTableProps {
  verifications: C2PAVerification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onViewDetails: (verificationId: string) => void;
  onRowClick?: (verification: C2PAVerification) => void;
  onDelete?: (verificationId: string) => void;
  isLoading?: boolean;
  className?: string;
}

const mediaTypeIcons: Record<
  MediaType,
  React.ComponentType<{ className?: string }>
> = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  document: FileText,
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function VerificationRow({
  verification,
  onViewDetails,
  onRowClick,
  onDelete,
  index,
}: {
  verification: C2PAVerification;
  onViewDetails: (id: string) => void;
  onRowClick?: (v: C2PAVerification) => void;
  onDelete?: (verificationId: string) => void;
  index: number;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // Handle both string and MediaInfo object for mediaId, and null case
  const mediaId =
    typeof verification.mediaId === 'string'
      ? verification.mediaId
      : verification.mediaId?._id || null;

  const thumbnailUrl =
    verification.mediaId &&
    typeof verification.mediaId === 'object' &&
    'thumbnailUrl' in verification.mediaId
      ? verification.mediaId.thumbnailUrl
      : verification.thumbnailUrl;

  const fileName =
    verification.mediaId &&
    typeof verification.mediaId === 'object' &&
    'originalFilename' in verification.mediaId
      ? verification.mediaId.originalFilename
      : verification.fileName;

  const mimeType =
    verification.mediaId &&
    typeof verification.mediaId === 'object' &&
    'mimeType' in verification.mediaId
      ? verification.mediaId.mimeType
      : undefined;

  // Determine media type from mimeType or fall back to verification.mediaType
  const mediaType =
    verification.mediaType ||
    (mimeType?.startsWith('image/')
      ? 'image'
      : mimeType?.startsWith('video/')
      ? 'video'
      : mimeType?.startsWith('audio/')
      ? 'audio'
      : 'document');

  const MediaIcon = mediaTypeIcons[mediaType];

  return (
    <tr
      className={cn(
        'border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer',
        'animate-in fade-in slide-in-from-bottom-1'
      )}
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={() => onRowClick?.(verification)}
    >
      {/* Thumbnail */}
      <td className="py-3 px-4">
        <div className="size-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={fileName || 'Media file'}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MediaIcon className="size-5 text-gray-400" />
            </div>
          )}
        </div>
      </td>

      {/* File info */}
      <td className="py-3 px-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
            {fileName || 'Unknown file'}
          </p>
          <p className="text-xs text-gray-500 font-mono">
            {mediaId ? `${mediaId.slice(0, 12)}...` : 'No media ID'}
          </p>
        </div>
      </td>

      {/* Media type */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MediaIcon className="size-4" />
          <span className="capitalize">{mediaType}</span>
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <StatusBadge status={verification.status} size="sm" />
      </td>

      {/* Date */}
      <td className="py-3 px-4">
        <span className="text-sm text-gray-500">
          {formatDate(verification.updatedAt || verification.createdAt)}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 px-4">
        {showDeleteConfirm ? (
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(verification.verificationId);
                setShowDeleteConfirm(false);
              }}
              className="h-8 text-xs"
            >
              Confirm
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
              className="h-8"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(verification.verificationId);
              }}
              className="h-8"
            >
              <Eye className="size-4 mr-1" />
              View
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 animate-pulse">
          <td className="py-3 px-4">
            <Skeleton className="size-10 rounded-lg" />
          </td>
          <td className="py-3 px-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </td>
          <td className="py-3 px-4">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="py-3 px-4">
            <Skeleton className="h-6 w-20 rounded-full" />
          </td>
          <td className="py-3 px-4">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="py-3 px-4">
            <Skeleton className="h-8 w-16" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function VerificationTable({
  verifications,
  pagination,
  onPageChange,
  onViewDetails,
  onRowClick,
  onDelete,
  isLoading = false,
  className,
}: VerificationTableProps) {
  const { page, totalPages, total, limit } = pagination;

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) {
      pages.push('ellipsis');
    }

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (page < totalPages - 2) {
      pages.push('ellipsis');
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn('bg-white rounded-xl border border-gray-200', className)}
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preview
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={limit} />
            ) : verifications.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="text-gray-500">
                    <FileImage className="size-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">
                      No verifications found
                    </p>
                    <p className="text-xs mt-1">
                      Try adjusting your filters or verify some media
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              verifications.map((verification, index) => (
                <VerificationRow
                  key={verification.verificationId}
                  verification={verification}
                  onViewDetails={onViewDetails}
                  onRowClick={onRowClick}
                  onDelete={onDelete}
                  index={index}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)}{' '}
            of {total} results
          </p>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  className={cn(page === 1 && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNum, index) =>
                pageNum === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={pageNum === page}
                      onClick={() => onPageChange(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && onPageChange(page + 1)}
                  className={cn(
                    page === totalPages && 'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
