'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ConfidencePill } from './ConfidencePill';
import {
  useDeleteResearch,
  useResearchHistory,
} from '@/hooks/useClaimResearch';
import type { ClaimResearchHistoryItem } from '@/types/claim-research';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ResearchHistoryProps {
  onSelectJob: (jobId: string) => void;
}

export function ResearchHistory({ onSelectJob }: ResearchHistoryProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading } = useResearchHistory(page, pageSize);
  const deleteResearch = useDeleteResearch();

  const handleDelete = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this investigation?')) return;

    try {
      await deleteResearch.mutateAsync(jobId);
      toast.success('Investigation deleted');
    } catch (error) {
      toast.error('Failed to delete investigation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'searching':
      case 'analyzing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const totalPages = data?.total ? Math.ceil(data.total / pageSize) : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!data?.researches?.length && page === 1) {
    return (
      <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-zinc-500" />
            Investigation Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-zinc-500">
            No investigations yet. Open your first case above.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <FileText className="w-5 h-5 text-blue-600" />
            Investigation Cases
          </CardTitle>
          <div className="text-sm text-zinc-500">
            {data?.total} total case{data?.total !== 1 ? 's' : ''}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[45%]">Claim</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.researches.map((item) => (
                <TableRow
                  key={item.job_id}
                  className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <TableCell className="font-medium align-top py-4">
                    <div className="space-y-1">
                      <div
                        className="line-clamp-2 text-base text-zinc-900 dark:text-zinc-100 font-semibold capitalize"
                        title={item.claim_text}
                      >
                        {item.claim_text}
                      </div>
                      {item.status === 'completed' &&
                        item.confidence &&
                        item.confidence < 40 && (
                          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low confidence - review findings</span>
                          </div>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="align-top py-4">
                    <Badge
                      variant={getStatusColor(item.status) as any}
                      className="capitalize"
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="align-top py-4">
                    {item.confidence ? (
                      <ConfidencePill confidence={item.confidence} size="sm" />
                    ) : (
                      <span className="text-sm text-zinc-400">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-500 align-top py-4 whitespace-nowrap text-sm">
                    {formatDistanceToNow(new Date(item.submitted_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right align-top py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => onSelectJob(item.job_id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View Analysis
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => handleDelete(e as any, item.job_id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View - Shown only on mobile */}
        <div className="md:hidden space-y-3 p-4">
          {data?.researches.map((item) => (
            <MobileInvestigationCard
              key={item.job_id}
              item={item}
              onSelect={onSelectJob}
              onDelete={handleDelete}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between sm:justify-end space-x-2 p-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Mobile Card Component
function MobileInvestigationCard({
  item,
  onSelect,
  onDelete,
  getStatusColor,
}: {
  item: ClaimResearchHistoryItem;
  onSelect: (jobId: string) => void;
  onDelete: (e: React.MouseEvent, jobId: string) => void;
  getStatusColor: (status: string) => string;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 space-y-3">
      {/* Header with Status and Date */}
      <div className="flex items-start justify-between gap-2">
        <Badge
          variant={getStatusColor(item.status) as any}
          className="capitalize"
        >
          {item.status}
        </Badge>
        <span className="text-xs text-zinc-500">
          {formatDistanceToNow(new Date(item.submitted_at), {
            addSuffix: true,
          })}
        </span>
      </div>

      {/* Claim Text */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-3">
          {item.claim_text}
        </p>
        {item.status === 'completed' &&
          item.confidence &&
          item.confidence < 40 && (
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3 h-3" />
              <span>Low confidence - review findings</span>
            </div>
          )}
      </div>

      {/* Evidence Badge */}
      {item.confidence && (
        <div>
          <ConfidencePill confidence={item.confidence} size="sm" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Button
          size="sm"
          onClick={() => onSelect(item.job_id)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          View Analysis
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onDelete(e, item.job_id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
