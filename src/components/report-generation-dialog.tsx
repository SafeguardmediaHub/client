import {
  CheckCircleIcon,
  FileTextIcon,
  SettingsIcon,
  XCircleIcon,
  XIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import {
  type ReportGenerationRequest,
  useReportGeneration,
} from '@/hooks/use-reportGeneration';
import type { Analysis } from '@/types/analysis';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './motion-primitives/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ReportGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAnalyses: Analysis[];
}

type DialogState = 'form' | 'loading' | 'success' | 'error';

export const ReportGenerationDialog: React.FC<ReportGenerationDialogProps> = ({
  open,
  onOpenChange,
  selectedAnalyses,
}) => {
  // State management for dialog phases
  const [dialogState, setDialogState] = useState<DialogState>('form');
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<
    'deepfake' | 'forensics' | 'batch' | 'custom'
  >('deepfake');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeConfidenceScores, setIncludeConfidenceScores] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(false);

  // React Query mutation for report generation
  const reportMutation = useReportGeneration();

  // Reset dialog state when opening/closing
  React.useEffect(() => {
    if (open) {
      setDialogState('form');
      setReportTitle('');
      reportMutation.reset();
    }
  }, [open, reportMutation]);

  // Handle report generation
  const handleGenerateReport = async () => {
    if (selectedAnalyses.length === 0) return;

    setDialogState('loading');

    const request: ReportGenerationRequest = {
      selectedAnalyses,
      reportType,
      reportTitle: reportTitle || undefined,
      includeMetadata,
      includeConfidenceScores,
      includeTimeline,
    };

    try {
      await reportMutation.mutateAsync(request);
      setDialogState('success');
    } catch (error) {
      setDialogState('error');
    }
  };

  // Handle dialog close
  const handleClose = () => {
    // Prevent closing during loading state
    if (dialogState === 'loading') return;
    onOpenChange(false);
  };

  // Handle retry after error
  const handleRetry = () => {
    setDialogState('form');
    reportMutation.reset();
  };

  // Handle download and close after success
  const handleDownloadAndClose = () => {
    if (reportMutation.data?.downloadUrl) {
      // In a real app, this would trigger the download
      console.log('Downloading report from:', reportMutation.data.downloadUrl);
      window.open(reportMutation.data.downloadUrl, '_blank');
    }
    onOpenChange(false);
  };

  // Render different content based on dialog state
  const renderDialogContent = () => {
    switch (dialogState) {
      case 'form':
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>Generate Report</DialogTitle>
                  <DialogDescription>
                    Configure your report settings and generate comprehensive
                    documentation from {selectedAnalyses.length} selected
                    analyses.
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Report Configuration Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                    Report Title (Optional)
                  </Label>
                  <Input
                    placeholder="Enter custom report title..."
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="h-12 bg-[#f1f1f3] border-0 focus-visible:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                    Report Type
                  </Label>
                  <Select
                    value={reportType}
                    onValueChange={(value: any) => setReportType(value)}
                  >
                    <SelectTrigger className="h-12 bg-[#f1f1f3] border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deepfake">
                        Deepfake Analysis Report
                      </SelectItem>
                      <SelectItem value="forensics">
                        Forensics Investigation Report
                      </SelectItem>
                      <SelectItem value="batch">
                        Batch Processing Summary
                      </SelectItem>
                      <SelectItem value="custom">
                        Custom Analysis Report
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Report Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                    Include in Report
                  </Label>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeMetadata}
                        onChange={(e) => setIncludeMetadata(e.target.checked)}
                        className="w-4 h-4 text-[#4b2eef] border-[#d9d9d9] rounded focus:ring-[#4b2eef]"
                      />
                      <span className="text-sm text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                        File metadata and technical details
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeConfidenceScores}
                        onChange={(e) =>
                          setIncludeConfidenceScores(e.target.checked)
                        }
                        className="w-4 h-4 text-[#4b2eef] border-[#d9d9d9] rounded focus:ring-[#4b2eef]"
                      />
                      <span className="text-sm text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                        Confidence scores and model information
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeTimeline}
                        onChange={(e) => setIncludeTimeline(e.target.checked)}
                        className="w-4 h-4 text-[#4b2eef] border-[#d9d9d9] rounded focus:ring-[#4b2eef]"
                      />
                      <span className="text-sm text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                        Processing timeline and history
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Selected Analyses Summary */}
              <Card className="bg-[#f8f9fa] border-[#e5e5e5]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileTextIcon className="w-5 h-5 text-[#5c5c5c]" />
                    <span className="text-sm font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                      Selected Analyses ({selectedAnalyses.length})
                    </span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedAnalyses.slice(0, 3).map((analysis) => (
                      <div
                        key={analysis._id}
                        className="text-xs text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]"
                      >
                        • {analysis.fileName} ({analysis.predictedClass})
                      </div>
                    ))}
                    {selectedAnalyses.length > 3 && (
                      <div className="text-xs text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                        ... and {selectedAnalyses.length - 3} more analyses
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e5e5]">
              <Button
                variant="outline"
                onClick={handleClose}
                className="h-12 px-6 border-[#d9d9d9] hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateReport}
                disabled={selectedAnalyses.length === 0}
                className="h-12 px-6 bg-[#4b2eef] hover:bg-[#4b2eef]/90"
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </>
        );

      case 'loading':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Generating Report</DialogTitle>
              <DialogDescription>
                Please wait while we process your analyses and generate the
                report...
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              {/* Loading Spinner */}
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#e5e5e5] border-t-[#4b2eef] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileTextIcon className="w-6 h-6 text-[#4b2eef]" />
                </div>
              </div>

              {/* Loading Messages */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  Generating Your Report
                </h3>
                <p className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  Processing {selectedAnalyses.length} analyses and compiling
                  comprehensive documentation...
                </p>
              </div>

              {/* Progress Steps */}
              <div className="w-full max-w-md space-y-3">
                <div className="flex items-center gap-3 text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  <div className="w-2 h-2 bg-[#4b2eef] rounded-full animate-pulse"></div>
                  <span>Analyzing selected files...</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  <div
                    className="w-2 h-2 bg-[#4b2eef] rounded-full animate-pulse"
                    style={{ animationDelay: '0.5s' }}
                  ></div>
                  <span>Compiling results and metadata...</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  <div
                    className="w-2 h-2 bg-[#4b2eef] rounded-full animate-pulse"
                    style={{ animationDelay: '1s' }}
                  ></div>
                  <span>Generating PDF document...</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-[#e5e5e5]">
              <p className="text-xs text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                This may take a few moments depending on the number of
                analyses...
              </p>
            </div>
          </>
        );

      case 'success':
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>Report Generated Successfully</DialogTitle>
                  <DialogDescription>
                    Your report has been generated and is ready for download.
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-[#e1feea] rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8 text-[#049d35]" />
              </div>

              {/* Success Message */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  Report Ready!
                </h3>
                <p className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  Your comprehensive analysis report has been successfully
                  generated.
                </p>
              </div>

              {/* Report Details */}
              {reportMutation.data && (
                <Card className="w-full bg-[#f8f9fa] border-[#e5e5e5]">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                          File Name:
                        </span>
                        <span className="text-sm font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                          {reportMutation.data.fileName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                          File Size:
                        </span>
                        <span className="text-sm font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                          {reportMutation.data.fileSize}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                          Generated:
                        </span>
                        <span className="text-sm font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                          {new Date(
                            reportMutation.data.generatedAt
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e5e5]">
              <Button
                variant="outline"
                onClick={handleClose}
                className="h-12 px-6 border-[#d9d9d9] hover:bg-gray-50"
              >
                Close
              </Button>
              <Button
                onClick={handleDownloadAndClose}
                className="h-12 px-6 bg-[#4b2eef] hover:bg-[#4b2eef]/90"
              >
                <FileTextIcon className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </>
        );

      case 'error':
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>Report Generation Failed</DialogTitle>
                  <DialogDescription>
                    An error occurred while generating your report. Please try
                    again.
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-[#fee1e1] rounded-full flex items-center justify-center">
                <XCircleIcon className="w-8 h-8 text-[#d50a0a]" />
              </div>

              {/* Error Message */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  Generation Failed
                </h3>
                <p className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                  {reportMutation.error?.message ||
                    'An unexpected error occurred while generating your report.'}
                </p>
              </div>

              {/* Error Details */}
              <Card className="w-full bg-[#fef7f7] border-[#f5c6cb]">
                <CardContent className="p-4">
                  <div className="text-sm text-[#721c24] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                    <strong>Troubleshooting Tips:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Check your internet connection</li>
                      <li>Ensure all selected analyses are valid</li>
                      <li>Try reducing the number of selected analyses</li>
                      <li>Contact support if the problem persists</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e5e5]">
              <Button
                variant="outline"
                onClick={handleClose}
                className="h-12 px-6 border-[#d9d9d9] hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRetry}
                className="h-12 px-6 bg-[#4b2eef] hover:bg-[#4b2eef]/90"
              >
                Try Again
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};
