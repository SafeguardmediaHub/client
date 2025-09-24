'use client';

import {
  CalendarIcon,
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  SearchIcon,
} from 'lucide-react';
import { useState } from 'react';
import { DialogCustomVariantsTransition } from '@/components/report-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReports } from '@/hooks/useReports';
import type { Report } from '@/types/report';

const Reporting = () => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const page = 1;

  const { data, isLoading, isError, refetch } = useReports(page);

  const reports = data?.reports || [];
  const totalPages = data?.pagination?.pages || 1;

  console.log(reports);

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#e1feea] border-[#049d35] text-[#049d35]';
      case 'processing':
        return 'bg-[#fdfbe1] border-[#d5c70a] text-[#d5c70a]';
      case 'failed':
        return 'bg-[#fee1e1] border-[#d50a0a] text-[#d50a0a]';
      case 'draft':
        return 'bg-[#e1f0fe] border-[#0a7bd5] text-[#0a7bd5]';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-600';
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
    <div className="w-full flex flex-col gap-6 p-8">
      {/* header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica] leading-9">
            Reports Generation
          </h1>
          <p className="text-sm font-medium text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica] leading-[21px]">
            Generate, manage, and download your analysis reports
          </p>
        </div>

        <DialogCustomVariantsTransition />
      </div>

      {/* existing reports */}
      <Card className="bg-white rounded-xl border border-[#d9d9d9] p-6">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica] leading-[30px]">
                Existing Reports
              </h2>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="h-10 px-4 border-[#d9d9d9] hover:bg-gray-50"
                  onClick={handleSelectAll}
                >
                  <span className="text-sm font-medium [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                    {selectedReports.length === reports.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </span>
                </Button>
                <Button
                  className="h-10 px-4 bg-blue-600 hover:bg-blue-500 cursor-pointer font-bold"
                  disabled={selectedReports.length === 0}
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm text-gray-100 [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                    Download ({selectedReports.length})
                  </span>
                </Button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 border">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5c5c5c]" />
                  <Input
                    placeholder="Search reports by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-[#f1f1f3] border-0 focus-visible:ring-0 [font-family:'Avenir_LT_Pro-Roman',Helvetica]"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48 h-12 bg-[#f1f1f3] border-0">
                  <FilterIcon className="w-4 h-4 mr-2 text-[#5c5c5c]" />
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
                <SelectTrigger className="w-full md:w-48 h-12 bg-[#f1f1f3] border-0">
                  <FilterIcon className="w-4 h-4 mr-2 text-[#5c5c5c]" />
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
          <>
            {Array.from({ length: 4 }).map(() => (
              <Card
                key={crypto.randomUUID?.() ?? Math.random().toString(36)}
                className="bg-white rounded-xl border border-[#d9d9d9] p-6"
              >
                <CardContent className="p-0">
                  <div className="flex gap-4">
                    <div className="flex items-start pt-1">
                      <div className="w-5 h-5 bg-[#f1f1f3] rounded" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="h-5 w-2/3 bg-[#f1f1f3] rounded" />
                          <div className="h-4 w-full bg-[#f1f1f3] rounded mt-2" />
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="h-6 w-24 bg-[#f1f1f3] rounded" />
                          <div className="h-8 w-24 bg-[#f1f1f3] rounded" />
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="h-4 w-28 bg-[#f1f1f3] rounded" />
                        <div className="h-4 w-20 bg-[#f1f1f3] rounded" />
                        <div className="h-5 w-16 bg-[#f1f1f3] rounded" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <Card className="bg-white rounded-xl border border-[#d9d9d9] p-8">
            <CardContent className="p-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                    Failed to load reports
                  </h3>
                  <p className="text-sm text-[#5c5c5c] mt-1 [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                    Please check your connection and try again.
                  </p>
                </div>
                <Button
                  onClick={() => refetch()}
                  className="bg-blue-600 hover:bg-blue-500"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && reports.length === 0 && (
          <Card className="bg-white rounded-xl border border-[#d9d9d9] p-10 text-center">
            <CardContent className="p-0">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#f1f1f3] flex items-center justify-center">
                  <FileTextIcon className="w-7 h-7 text-[#9ca3af]" />
                </div>
                <h3 className="text-lg font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  No reports yet
                </h3>
                <p className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  Start by generating your first report.
                </p>
                <DialogCustomVariantsTransition />
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading &&
          !isError &&
          reports.length > 0 &&
          filteredReports.length === 0 && (
            <Card className="bg-white rounded-xl border border-[#d9d9d9] p-8">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                      No results match your filters
                    </h3>
                    <p className="text-sm text-[#5c5c5c] mt-1 [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                      Try adjusting your search or clearing filters.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-[#d9d9d9]"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterType('all');
                        setFilterStatus('all');
                      }}
                    >
                      Reset filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {!isLoading &&
          !isError &&
          filteredReports.length > 0 &&
          filteredReports.map((report) => (
            <Card
              key={report.id}
              className="bg-white rounded-xl border border-[#d9d9d9] p-6 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
                <div className="flex gap-4">
                  {' '}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedReports.includes(report.id) &&
                        report.status === 'completed'
                      }
                      disabled={report.status !== 'completed'}
                      onChange={() => handleSelectReport(report.id)}
                      className="w-5 h-5 text-[#4b2eef] border-[#d9d9d9] rounded focus:ring-[#4b2eef]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica] leading-6 truncate">
                          {report.title}
                        </h3>
                        <p className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica] leading-[21px] mt-1">
                          {report.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge
                          className={`px-2 py-1 rounded border ${getStatusColor(
                            report.status
                          )}`}
                        >
                          <div
                            className={`w-2 h-2 rounded mr-2 ${
                              report.status === 'completed'
                                ? 'bg-[#049d35]'
                                : report.status === 'processing'
                                ? 'bg-[#d5c70a]'
                                : report.status === 'failed'
                                ? 'bg-[#d50a0a]'
                                : 'bg-[#0a7bd5]'
                            }`}
                          />
                          <span className="text-xs font-medium [font-family:'Avenir_LT_Pro-Medium',Helvetica] capitalize">
                            {report.status}
                          </span>
                        </Badge>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 border-[#d9d9d9] hover:bg-gray-50"
                          disabled={report.status !== 'completed'}
                        >
                          <DownloadIcon className="w-4 h-4 mr-1" />
                          <span className="text-xs [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                            Download
                          </span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileTextIcon className="w-4 h-4" />
                        <span>{report.humanFileSize}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 border-[#d9d9d9]"
                      >
                        {report.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>{' '}
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Reporting;
