'use client';

import {
  CalendarIcon,
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { ReportsPagination } from '@/components/report-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReports } from '@/hooks/useReports';
import { deleteReport, downloadReport } from '@/lib/api/report';
import type { Report } from '@/types/report';

const Reporting = () => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, isError, refetch } = useReports(page);

  const reports = data?.reports || [];

  const totalPages = data?.pagination?.pages || 1;

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'processing':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'draft':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-600';
    }
  };

  const getStatusDotColor = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500';
      case 'processing':
        return 'bg-amber-500';
      case 'failed':
        return 'bg-red-500';
      case 'draft':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reports.map((r) => r.id));
    }
  };

  const handleDeleteReport = (reportId: string) => {
    setReportToDelete(reportId);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedReports.length === 0) return;
    setReportToDelete('bulk');
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;

    setIsDeleting(true);

    try {
      if (reportToDelete === 'bulk') {
        await Promise.all(selectedReports.map((id) => deleteReport(id)));
        toast.success(
          `Successfully deleted ${selectedReports.length} report(s)`,
          {
            description: 'The reports have been permanently removed.',
          }
        );
        setSelectedReports([]);
      } else {
        await deleteReport(reportToDelete);
        toast.success('Report deleted successfully', {
          description: 'The report has been permanently removed.',
        });
        setSelectedReports((prev) => prev.filter((id) => id !== reportToDelete));
      }
      refetch();
    } catch (error) {
      console.error('Failed to delete report:', error);
      toast.error('Failed to delete report', {
        description: 'Please try again later.',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus =
      filterStatus === 'all' || report.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100/50 min-h-screen">
      <div className="w-full flex flex-col gap-6 p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Reports
          </h1>
          <p className="text-base text-gray-600">
            View, download, and manage your analysis reports
          </p>
        </div>

        {/* Search and filters */}
        <Card className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search reports by title or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11 bg-gray-50 border-gray-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-48 h-11 bg-gray-50 border-gray-200 focus:ring-blue-500">
                    <FilterIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Deepfake Analysis">
                      Deepfake Analysis
                    </SelectItem>
                    <SelectItem value="Forensics Report">
                      Forensics Report
                    </SelectItem>
                    <SelectItem value="Batch Analysis">Batch Analysis</SelectItem>
                    <SelectItem value="Custom Report">Custom Report</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48 h-11 bg-gray-50 border-gray-200 focus:ring-blue-500">
                    <FilterIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* report list */}
        <div className="flex flex-col gap-4">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map(() => (
                <Card
                  key={crypto.randomUUID?.() ?? Math.random().toString(36)}
                  className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse"
                >
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      <div className="flex items-start pt-1">
                        <div className="w-5 h-5 bg-gray-200 rounded" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="h-6 w-2/3 bg-gray-200 rounded" />
                            <div className="h-4 w-full bg-gray-200 rounded" />
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="h-7 w-24 bg-gray-200 rounded-full" />
                            <div className="h-9 w-28 bg-gray-200 rounded-lg" />
                            <div className="h-9 w-24 bg-gray-200 rounded-lg" />
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="h-4 w-28 bg-gray-200 rounded" />
                          <div className="h-4 w-20 bg-gray-200 rounded" />
                          <div className="h-5 w-32 bg-gray-200 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && isError && (
            <Card className="bg-white rounded-xl border border-gray-100 p-8">
              <CardContent className="p-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Failed to load reports
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Please check your connection and try again.
                    </p>
                  </div>
                  <Button
                    onClick={() => refetch()}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && !isError && reports.length === 0 && (
            <Card className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <CardContent className="p-0">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <FileTextIcon className="w-9 h-9 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      No reports yet
                    </h3>
                    <p className="text-sm text-gray-600 max-w-sm mx-auto">
                      Your generated reports will appear here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results State */}
          {!isLoading &&
            !isError &&
            reports.length > 0 &&
            filteredReports.length === 0 && (
              <Card className="bg-white rounded-xl border border-gray-100 p-8">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        No results match your filters
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Try adjusting your search or clearing filters.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-gray-200 hover:bg-gray-50"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterType('all');
                        setFilterStatus('all');
                      }}
                    >
                      Reset filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Reports List */}
          {!isLoading &&
            !isError &&
            filteredReports.length > 0 &&
            filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-200 group">
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      <div className="flex items-center pt-1">
                        <input
                          type="checkbox"
                          checked={
                            selectedReports.includes(report.id) &&
                            report.status === 'completed'
                          }
                          disabled={report.status !== 'completed'}
                          onChange={() => handleSelectReport(report.id)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 leading-tight truncate group-hover:text-blue-600 transition-colors">
                              {report.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed mt-1.5 line-clamp-2">
                              {report.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge
                              className={`px-3 py-1.5 rounded-full border font-medium ${getStatusColor(
                                report.status
                              )} transition-all`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full mr-2 ${getStatusDotColor(
                                  report.status
                                )}`}
                              />
                              <span className="text-xs capitalize">
                                {report.status}
                              </span>
                            </Badge>

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-4 border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 cursor-pointer transition-all disabled:opacity-50"
                              disabled={report.status !== 'completed'}
                              onClick={() =>
                                downloadReport(report.id, report.title)
                              }
                            >
                              <DownloadIcon className="w-4 h-4 mr-1.5" />
                              <span className="text-xs font-medium">
                                Download
                              </span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 cursor-pointer transition-all"
                              onClick={() => handleDeleteReport(report.id)}
                            >
                              <Trash2Icon className="w-4 h-4 mr-1.5" />
                              <span className="text-xs font-medium">
                                Delete
                              </span>
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-4 h-4" />
                            <span>
                              {new Date(report.createdAt).toLocaleDateString(
                                'en-US',
                                { month: 'short', day: 'numeric', year: 'numeric' }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileTextIcon className="w-4 h-4" />
                            <span>{report.humanFileSize}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs px-2.5 py-0.5 border-gray-200 bg-gray-50 text-gray-700"
                          >
                            {report.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

          <ReportsPagination
            total={data?.pagination?.total || 0}
            limit={data?.pagination?.limit || 10}
            offset={data?.pagination?.offset || 0}
            hasMore={data?.pagination?.hasMore || false}
            pages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>

      {/* Sticky Bulk Actions Bar */}
      <AnimatePresence>
        {selectedReports.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Card className="bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-700">
                        {selectedReports.length}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">
                        {selectedReports.length} report
                        {selectedReports.length > 1 ? 's' : ''} selected
                      </p>
                      <p className="text-gray-500">
                        Choose an action to perform
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-6 border-l border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                      onClick={() => setSelectedReports([])}
                    >
                      <XIcon className="w-4 h-4 mr-1.5" />
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      onClick={handleBulkDelete}
                    >
                      <Trash2Icon className="w-4 h-4 mr-1.5" />
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      className="h-10 px-4 bg-blue-600 hover:bg-blue-700"
                    >
                      <DownloadIcon className="w-4 h-4 mr-1.5" />
                      Download All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-base pt-2">
              {reportToDelete === 'bulk'
                ? `Are you sure you want to delete ${selectedReports.length} report${selectedReports.length > 1 ? 's' : ''}? This action cannot be undone.`
                : 'Are you sure you want to delete this report? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="border-gray-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'linear',
                    }}
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2Icon className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reporting;
