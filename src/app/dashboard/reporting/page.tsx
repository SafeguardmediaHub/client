'use client';

import {
  CalendarIcon,
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  SearchIcon,
  UserIcon,
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
import { reports } from '@/lib/data';
import type { Report } from '@/types/report';

const Reporting = () => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#e1feea] border-[#049d35] text-[#049d35]';
      case 'Processing':
        return 'bg-[#fdfbe1] border-[#d5c70a] text-[#d5c70a]';
      case 'Failed':
        return 'bg-[#fee1e1] border-[#d50a0a] text-[#d50a0a]';
      case 'Draft':
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
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
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
          {' '}
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
            <div className="flex flex-col md:flex-row gap-4">
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
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* report list */}
      <div className="flex flex-col gap-4">
        {filteredReports.map((report, index) => (
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
                      report.status === 'Completed'
                    }
                    disabled={report.status !== 'Completed'}
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
                            report.status === 'Completed'
                              ? 'bg-[#049d35]'
                              : report.status === 'Processing'
                              ? 'bg-[#d5c70a]'
                              : report.status === 'Failed'
                              ? 'bg-[#d50a0a]'
                              : 'bg-[#0a7bd5]'
                          }`}
                        />
                        <span className="text-xs font-medium [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                          {report.status}
                        </span>
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 border-[#d9d9d9] hover:bg-gray-50"
                        disabled={report.status !== 'Completed'}
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
                      <UserIcon className="w-4 h-4" />
                      <span>{report.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {new Date(report.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileTextIcon className="w-4 h-4" />
                      <span>{report.fileSize}</span>
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
