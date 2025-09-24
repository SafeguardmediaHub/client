import {
  CheckIcon,
  FileIcon,
  ImageIcon,
  Loader2,
  VideoIcon,
} from 'lucide-react';
import type { Transition, Variants } from 'motion/react';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/motion-primitives/dialog';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import type { Analysis } from '@/types/analysis';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

export function DialogCustomVariantsTransition({
  isOpen = false,
}: {
  isOpen?: boolean;
}) {
  const [analyses] = useState<Analysis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(
    null
  );

  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isFetching } = useAnalysisHistory({
    page,
    limit: 20,
  });

  const [stage, setStage] = useState<'selection' | 'progress' | 'completed'>(
    'selection'
  );

  const getStatusColor = (status: Analysis['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#e1feea] border-[#049d35] text-[#049d35]';
      case 'processing':
        return 'bg-[#fdfbe1] border-[#d5c70a] text-[#d5c70a]';
      case 'failed':
        return 'bg-[#fee1e1] border-[#d50a0a] text-[#d50a0a]';
      case 'pending':
        return 'bg-[#e1f0fe] border-[#0a7bd5] text-[#0a7bd5]';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-600';
    }
  };

  const getMediaTypeIcon = (mediaType: Analysis['mediaType']) => {
    switch (mediaType) {
      case 'video':
        return <VideoIcon className="w-5 h-5 text-[#5c5c5c]" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-[#5c5c5c]" />;
      default:
        return <FileIcon className="w-5 h-5 text-[#5c5c5c]" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-[#049d35]';
    if (score >= 70) return 'text-[#d5c70a]';
    if (score >= 50) return 'text-[#ff8c00]';
    return 'text-[#d50a0a]';
  };

  const filteredAnalyses = (data?.analyses ?? []).filter(
    (analysis: Analysis) => {
      const matchesSearch =
        analysis.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        analysis.predictedClass
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || analysis.status === statusFilter;
      const matchesMediaType =
        mediaTypeFilter === 'all' || analysis.mediaType === mediaTypeFilter;

      return matchesSearch && matchesStatus && matchesMediaType;
    }
  );

  const handleSelectAnalysis = (analysisId: string) => {
    setSelectedAnalysisId(analysisId);
  };

  const handleGenerate = () => {
    setStage('progress');

    // Fake timeout to simulate backend processing
    setTimeout(() => {
      setStage('completed');
    }, 2500);
  };

  // Completed analyses available (if needed later)
  // const completedAnalyses = filteredAnalyses.filter((a) => a.status === 'completed');

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const customVariants: Variants = {
    initial: {
      scale: 0.9,
      filter: 'blur(10px)',
      y: '100%',
    },
    animate: {
      scale: 1,
      filter: 'blur(0px)',
      y: 0,
    },
  };

  const customTransition: Transition = {
    type: 'spring',
    bounce: 0,
    duration: 0.4,
  };

  return (
    <Dialog variants={customVariants} transition={customTransition}>
      <DialogTrigger className="bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 cursor-pointer">
        Generate Report
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl bg-white p-6 dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-white">
            {stage === 'selection' && 'Generate new report'}
            {stage === 'progress' && 'Report requested'}
            {stage === 'completed' && 'Report ready'}
          </DialogTitle>
          <DialogDescription className="text-zinc-600 dark:text-zinc-400">
            {stage === 'selection' &&
              'Choose the completed analysis you want to include in your report.'}
            {stage === 'progress' &&
              'Your report is being generated. This usually takes a few seconds.'}
            {stage === 'completed' &&
              'Your report has been generated successfully.'}
          </DialogDescription>
        </DialogHeader>

        {stage === 'selection' && (
          <>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-8 h-8 border-4 border-[#4b2eef] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-[#5c5c5c]">Loading analyses...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by filename or classification..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 bg-[#f1f1f3] border-0 focus-visible:ring-0"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-auto max-h-96">
                  {filteredAnalyses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                      <FileIcon className="w-12 h-12 text-[#5c5c5c]" />
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-black [font-family:'Avenir_LT_Pro-Medium',Helvetica] mb-2">
                          No analyses found
                        </h3>
                        <p className="text-sm text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                          {analyses.length === 0
                            ? 'No analyses available. Upload and process media files to generate reports.'
                            : 'Try adjusting your search criteria or filters.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      role="listbox"
                      aria-label="Analyses"
                      className="flex flex-col gap-3"
                    >
                      {filteredAnalyses.map((analysis) => {
                        const isDisabled = analysis.status !== 'completed';
                        const isSelected = selectedAnalysisId === analysis.id;
                        return (
                          <button
                            key={analysis.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            disabled={isDisabled}
                            onClick={() =>
                              !isDisabled && handleSelectAnalysis(analysis.id)
                            }
                            className={`relative w-full rounded-xl border transition-all text-left ${
                              isSelected
                                ? 'border-blue-600  bg-white shadow-sm'
                                : 'border-[#e6e6e6] bg-white hover:border-[#cfcfcf]'
                            } ${
                              isDisabled
                                ? 'opacity-60 cursor-not-allowed'
                                : 'cursor-pointer'
                            } p-4 focus:outline-none `}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`mt-1 grid place-items-center h-9 w-9 rounded-full border ${
                                  isSelected
                                    ? 'border-[#4b2eef] bg-[#4b2eef]/5'
                                    : 'border-[#e6e6e6]'
                                }`}
                              >
                                {isSelected ? (
                                  <CheckIcon className="h-5 w-5 text-[#4b2eef]" />
                                ) : (
                                  <div className="h-2.5 w-2.5 rounded-full bg-[#cfcfcf]" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      {getMediaTypeIcon(analysis.mediaType)}
                                      <h4 className="truncate text-[15px] font-medium text-zinc-900 [font-family:'Avenir_LT_Pro-Medium',Helvetica]">
                                        {analysis.fileName}
                                      </h4>
                                    </div>
                                    <p className="mt-1 text-xs text-[#5c5c5c] [font-family:'Avenir_LT_Pro-Medium',Helvetica] truncate">
                                      Predicted: {analysis.predictedClass}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge
                                      className={`px-2 py-0.5 rounded border ${getStatusColor(
                                        analysis.status
                                      )}`}
                                    >
                                      <span className="text-[10px] font-medium [font-family:'Avenir_LT_Pro-Medium',Helvetica] uppercase">
                                        {analysis.status}
                                      </span>
                                    </Badge>
                                    <span
                                      className={`text-xs font-medium ${getConfidenceColor(
                                        analysis.confidenceScore
                                      )}`}
                                    >
                                      {analysis.confidenceScore}%
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center gap-3 text-xs text-[#7a7a7a]">
                                  <span>
                                    {new Date(
                                      analysis.uploadDate
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="h-1 w-1 rounded-full bg-[#d0d0d0]" />
                                  <span>{analysis.mediaType}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}

                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={
                                !data?.pagination.hasPrevPage || isFetching
                                  ? undefined
                                  : () => setPage((p) => p - 1)
                              }
                              aria-disabled={
                                !data?.pagination.hasPrevPage || isFetching
                              }
                              className={
                                !data?.pagination.hasPrevPage || isFetching
                                  ? 'pointer-events-none opacity-50'
                                  : undefined
                              }
                            />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={
                                !data?.pagination.hasNextPage || isFetching
                                  ? undefined
                                  : () => setPage((p) => p + 1)
                              }
                              aria-disabled={
                                !data?.pagination.hasNextPage || isFetching
                              }
                              className={
                                !data?.pagination.hasNextPage || isFetching
                                  ? 'pointer-events-none opacity-50'
                                  : undefined
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              </>
            )}{' '}
            <div className="mt-6 flex flex-col space-y-4">
              <button
                className={`inline-flex items-center justify-center self-end rounded-lg px-4 py-2 text-sm font-medium text-zinc-50 cursor-pointer ${
                  selectedAnalysisId
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-zinc-300 cursor-not-allowed'
                }`}
                type="submit"
                disabled={!selectedAnalysisId}
                onClick={handleGenerate}
              >
                Generate now
              </button>
            </div>
          </>
        )}

        {stage === 'progress' && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm text-[#5c5c5c]">
              We’re generating your report…
            </p>
          </div>
        )}

        {stage === 'completed' && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-base font-medium text-zinc-900">
              Your report is ready!
            </p>
            <div className="flex gap-3">
              <Button className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm text-white cursor-pointer">
                View Report
              </Button>
              <DialogClose>
                <Button className="rounded-lg bg-zinc-200 hover:bg-zinc-300 px-4 py-2 text-sm text-zinc-700 cursor-pointer">
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
