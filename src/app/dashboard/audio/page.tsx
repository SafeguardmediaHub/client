'use client';

import { LinkIcon, Loader2, UploadIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';

type DashboardProps = {
  userName?: string;
  onAnalyzeLink?: (url: string) => void;
  onUploadSuccess?: (key: string) => void;
};

const MAX_BYTES = 200_000_000; // 200MB
const ALLOWED_EXTENSIONS = ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac', 'wma'];

interface AnalysisResult {
  user_friendly_summary: {
    status: string;
    authenticity_score: number;
    tampering_probability: string;
    spectral_analysis_summary: string;
    voice_activity_summary: string;
    tampering_summary: string;
    speaker_count: number;
    transcription: string;
    recommendation: string;
    splice_locations?: number[];
    audio_info: {
      format: string;
      duration: string;
      sample_rate: string;
      file_size: string;
      bitrate: string;
    };
  };
  ai_voice_detection?: {
    ai_voice_score: number;
    verdict: string;
    confidence: string;
    indicators: string[];
    spectral_flatness_mean: number;
    phase_variance: number;
    timing_jitter: number;
  };
}

const AudioForensics: FC<DashboardProps> = ({
  userName = 'there',
  onAnalyzeLink,
  onUploadSuccess,
}) => {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<
    {
      name: string;
      size: number;
      progress: number;
      status: 'uploading' | 'completed' | 'analyzing';
      key?: string;
    }[]
  >([]);
  const [actualFile, setActualFile] = useState<File | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [spectrogramImage, setSpectrogramImage] = useState<string | null>(null);
  const [voiceActivityImage, setVoiceActivityImage] = useState<string | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isBusy = useMemo(() => uploadingFiles.length > 0, [uploadingFiles]);
  const [mockAnalyses, setMockAnalyses] = useState<
    {
      id: number;
      fileName: string;
      duration: string;
      authenticityScore: number;
      uploadDate: string;
    }[]
  >([]);

  const filteredAnalyses = mockAnalyses.filter((item) =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage);
  const paginatedAnalyses = filteredAnalyses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const validateFile = useCallback((file: File) => {
    if (file.size > MAX_BYTES) {
      return 'File is too large. Max size is 200MB.';
    }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return 'Unsupported file type. Use MP3, WAV, FLAC, OGG, M4A, AAC, or WMA.';
    }
    return null;
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      setActualFile(file);

      setUploadingFiles([
        {
          name: file.name,
          size: file.size,
          progress: 0,
          status: 'uploading',
        },
      ]);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadingFiles([
          {
            name: file.name,
            size: file.size,
            progress,
            status: 'uploading',
          },
        ]);

        if (progress >= 100) {
          clearInterval(interval);
          setUploadingFiles([
            {
              name: file.name,
              size: file.size,
              progress: 100,
              status: 'completed',
              key: file.name,
            },
          ]);
          toast.success('File ready for analysis!');
        }
      }, 200);
    },
    [validateFile]
  );

  const handleAnalyzeAudio = useCallback(async () => {
    const file = uploadingFiles[0];
    if (!file || !file.key || !actualFile) {
      toast.error('File not found');
      return;
    }

    setIsAnalyzing(true);
    setUploadingFiles([{ ...file, status: 'analyzing' }]);
    setAnalysisProgress(0);

    try {
      const formData = new FormData();
      formData.append('audio', actualFile);

      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => Math.min(prev + 5, 90));
      }, 500);

      const response = await fetch(
        'https://mirackchuks-audioforensics.hf.space/analyze',
        {
          method: 'POST',
          body: formData,
        }
      );

      clearInterval(progressInterval);

      if (!response.ok) throw new Error('Analysis failed');

      const blob = await response.blob();
      setAnalysisProgress(95);

      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(blob);

      let result: AnalysisResult | null = null;

      // Extract result.json
      const resultFile = zip.file('result.json');
      if (resultFile) {
        const resultText = await resultFile.async('text');
        result = JSON.parse(resultText);
        setAnalysisResult(result);
      }

      // Extract spectrogram.png
      const spectrogramFile = zip.file('spectrogram.png');
      if (spectrogramFile) {
        const spectrogramBlob = await spectrogramFile.async('blob');
        setSpectrogramImage(URL.createObjectURL(spectrogramBlob));
      }

      // Extract voice_activity.png
      const voiceActivityFile = zip.file('voice_activity.png');
      if (voiceActivityFile) {
        const voiceActivityBlob = await voiceActivityFile.async('blob');
        setVoiceActivityImage(URL.createObjectURL(voiceActivityBlob));
      }

      setAnalysisProgress(100);
      setIsAnalyzing(false);

      // Add to mockAnalyses
      if (result?.user_friendly_summary) {
        const newAnalysis = {
          id: mockAnalyses.length + 1,
          fileName: actualFile.name,
          duration: result.user_friendly_summary.audio_info.duration,
          authenticityScore: result.user_friendly_summary.authenticity_score,
          uploadDate: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        };
        setMockAnalyses([newAnalysis, ...mockAnalyses]);
      }

      setUploadingFiles([]);
      setActualFile(null);
      toast.success('Audio analysis completed!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze audio');
      setIsAnalyzing(false);
      setUploadingFiles([]);
      setActualFile(null);
    }
  }, [uploadingFiles, actualFile, mockAnalyses]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isBusy) return;
      const dt = e.dataTransfer;
      handleFiles(dt.files);
    },
    [handleFiles, isBusy]
  );

  const onBrowseClick = useCallback(() => {
    if (isBusy) return;
    fileInputRef.current?.click();
  }, [isBusy]);

  const analyzeSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onAnalyzeLink?.(url);
    },
    [onAnalyzeLink, url]
  );
  const inputId = useId();

  const getStatusColor = (status: string) => {
    if (status.includes('LOW RISK')) return 'bg-green-100 text-green-800';
    if (status.includes('MEDIUM RISK')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 70) return 'bg-green-50 border-green-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };
  return (
    <section className="flex flex-1 flex-col gap-4 py-4 px-8">
      <header className="flex-col items-start gap-1 flex">
        <h1 className="text-2xl font-medium text-black leading-9">
          Audio Forensic Analysis
        </h1>
        <p className="text-sm text-muted-foreground">
          Advanced audio forensic analysis for detecting manipulation and
          verifying authenticity
        </p>
      </header>

      {!analysisResult ? (
        <>
          <Card className="flex flex-col items-start gap-6 p-6 relative self-stretch w-full">
            <CardContent className="p-0 w-full">
              {uploadingFiles.length === 0 ? (
                <>
                  <form
                    onSubmit={analyzeSubmit}
                    className="flex items-center gap-0 bg-muted rounded-xl mb-6"
                  >
                    <div className="flex items-center gap-3 flex-1 px-3">
                      <LinkIcon className="w-5 h-5 text-muted-foreground" />
                      <Input
                        aria-label="Audio URL"
                        className="flex-1 border-0 bg-transparent p-0 focus-visible:ring-0"
                        placeholder="Paste a link to an audio file to start forensic analysis"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                    <Button
                      type="button"
                      className="rounded-l-none cursor-pointer"
                      disabled={true}
                    >
                      Upload Audio
                    </Button>
                  </form>

                  <section
                    className="relative w-full rounded-lg border border-dashed bg-muted"
                    aria-label="Upload dropzone"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onBrowseClick();
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={onDrop}
                  >
                    <label
                      htmlFor={inputId}
                      className="flex flex-col items-center gap-4 w-full py-6 cursor-pointer"
                    >
                      <UploadIcon className="w-10 h-10 text-muted-foreground" />
                      <div className="flex flex-col items-center gap-1 w-full">
                        <p className="text-base text-center">
                          Drag and drop to upload or click to browse files
                        </p>
                        <p className="text-sm text-primary text-center">
                          Supports MP3, WAV, FLAC, OGG, M4A, AAC, WMA (200 MB)
                        </p>
                      </div>

                      <input
                        id={inputId}
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        onChange={(e) => handleFiles(e.target.files)}
                        accept=".mp3,.wav,.flac,.ogg,.m4a,.aac,.wma,audio/*"
                        disabled={isBusy}
                      />

                      <Button
                        type="button"
                        onClick={onBrowseClick}
                        disabled={isBusy}
                      >
                        {isBusy ? 'Please wait…' : 'Select Files to Upload'}
                      </Button>
                    </label>
                  </section>
                </>
              ) : (
                <div className="space-y-4">
                  {uploadingFiles[0].status === 'analyzing' ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">
                          {uploadingFiles[0].name} (1 file)
                        </span>
                      </div>
                      <div className="text-center py-12 space-y-4">
                        <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
                        <div>
                          <p className="text-lg font-semibold">
                            Analyzing Audio...
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Performing forensic analysis and tampering detection
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 bg-muted/50 rounded-lg p-4">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            Processing Audio File
                          </span>
                          <span className="text-muted-foreground">
                            Processing...
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-background">
                          <div
                            className="h-2 rounded-full bg-primary transition-all"
                            style={{ width: `${analysisProgress}%` }}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => {
                            setIsAnalyzing(false);
                            setUploadingFiles([]);
                            setActualFile(null);
                            toast.info('Analysis cancelled');
                          }}
                        >
                          Cancel Analysis
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between py-2">
                        <h3 className="text-sm font-medium">Upload progress</h3>
                        <span className="text-xs text-green-600 font-medium">
                          {uploadingFiles[0].status === 'completed'
                            ? '1/1 Completed'
                            : '0/1 Completed'}
                        </span>
                      </div>

                      <div className="border rounded-lg">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {uploadingFiles[0].name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                +
                                {(
                                  uploadingFiles[0].size /
                                  (1024 * 1024)
                                ).toFixed(2)}{' '}
                                MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {uploadingFiles[0].status === 'completed' && (
                              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 text-xs">
                                  ✓
                                </span>
                              </div>
                            )}
                            <button
                              onClick={() => setUploadingFiles([])}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {uploadingFiles[0].status === 'uploading' && (
                          <div className="px-4 pb-4">
                            <div className="h-1.5 w-full rounded-full bg-muted">
                              <div
                                className="h-1.5 rounded-full bg-primary transition-all"
                                style={{
                                  width: `${uploadingFiles[0].progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {uploadingFiles[0].status === 'completed' && (
                        <div className="flex gap-3">
                          <Button
                            onClick={handleAnalyzeAudio}
                            className="flex-1"
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setUploadingFiles([])}
                            disabled={isAnalyzing}
                          >
                            Upload another file
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setUploadingFiles([])}
                            disabled={isAnalyzing}
                          >
                            Clear all
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="p-6 w-full">
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Audio Analyses</h3>
              </div>

              <div className="relative">
                <Input
                  placeholder="Search here..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  🔍
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-sm text-muted-foreground">
                      <th className="text-left font-medium max-md:text-[12px] py-3 px-4">
                        Media
                      </th>
                      <th className="text-left font-medium py-3 max-md:text-[12px] px-4">
                        File name
                      </th>
                      <th className="text-left font-medium py-3 max-md:text-[12px] px-4">
                        Duration
                      </th>
                      <th className="text-left font-medium py-3 max-md:text-[12px] px-4">
                        Authenticity Score
                      </th>
                      <th className="text-left font-medium py-3 max-md:text-[12px] px-4">
                        Upload date/time
                      </th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paginatedAnalyses.length > 0 ? (
                      paginatedAnalyses.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                />
                              </svg>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{item.fileName}</td>
                          <td className="py-3 px-4 text-sm">{item.duration}</td>
                          <td className="py-3 px-4 text-sm">
                            {item.authenticityScore}%
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {item.uploadDate}
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-muted-foreground hover:text-foreground">
                              ⋮
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-sm text-muted-foreground"
                        >
                          No results found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredAnalyses.length
                    )}{' '}
                    of {filteredAnalyses.length} entries
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-9"
                        >
                          {page}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="p-4 md:p-6 w-full max-w-5xl mx-auto">
          <CardContent className="p-0 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  ← Go back
                </button>
              </div>
              <Button variant="outline" size="sm">
                Re-analyze
              </Button>
            </div>

            <p className="text-lg font-medium">
              Audio Forensic Analysis Results
            </p>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Spectrogram */}
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden bg-muted">
                  {spectrogramImage ? (
                    <img
                      src={spectrogramImage}
                      alt="Spectrogram"
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      No spectrogram available
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-2">
                  <button className="w-8 h-8 rounded border flex items-center justify-center hover:bg-muted">
                    ‹
                  </button>
                  <button className="w-8 h-8 rounded border flex items-center justify-center hover:bg-muted">
                    ›
                  </button>
                </div>
              </div>

              {/* Right side - Overall Authenticity Score */}
              <div
                className={`p-6 rounded-lg border ${getRiskBgColor(
                  analysisResult.user_friendly_summary.authenticity_score
                )} h-fit`}
              >
                <h3 className="text-lg font-semibold mb-2">
                  Overall Authenticity Score
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on all forensic analyses combined
                </p>

                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative w-40 h-40">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={
                          analysisResult.user_friendly_summary
                            .authenticity_score >= 70
                            ? '#22c55e'
                            : analysisResult.user_friendly_summary
                                .authenticity_score >= 40
                            ? '#eab308'
                            : '#ef4444'
                        }
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${
                          analysisResult.user_friendly_summary
                            .authenticity_score * 2.51
                        } 251`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className={`text-3xl font-bold ${
                          analysisResult.user_friendly_summary
                            .authenticity_score >= 70
                            ? 'text-green-500'
                            : analysisResult.user_friendly_summary
                                .authenticity_score >= 40
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`}
                      >
                        {
                          analysisResult.user_friendly_summary
                            .authenticity_score
                        }
                        %
                      </span>
                    </div>
                  </div>

                  <p className="text-lg font-semibold mt-4">
                    {analysisResult.user_friendly_summary.status}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    {analysisResult.user_friendly_summary.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Detection Results */}
            <div className="border rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold">Detection Results</h3>

              {/* Voice Activity Detection */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">Voice Activity Detection</h4>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {analysisResult.user_friendly_summary.speaker_count}{' '}
                      Speaker(s)
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  <strong>What this means:</strong> Identifies who is speaking
                  and when in the audio
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {analysisResult.user_friendly_summary.voice_activity_summary}
                </p>
                <p className="text-xs text-muted-foreground">
                  Transcription:{' '}
                  {analysisResult.user_friendly_summary.transcription}
                </p>
              </div>

              {/* Spectral Analysis */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Spectral Analysis</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  <strong>What this means:</strong> Examines sound frequencies
                  to detect unnatural patterns
                </p>
                <p className="text-sm text-muted-foreground">
                  {
                    analysisResult.user_friendly_summary
                      .spectral_analysis_summary
                  }
                </p>
              </div>

              {/* Tampering Detection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">Tampering Detection</h4>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        analysisResult.user_friendly_summary
                          .tampering_probability
                      )}`}
                    >
                      {
                        analysisResult.user_friendly_summary
                          .tampering_probability
                      }
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  <strong>What this means:</strong> Looks for cuts, splices, or
                  edited sections in the audio
                </p>
                <p className="text-sm text-muted-foreground">
                  {analysisResult.user_friendly_summary.tampering_summary}
                </p>
              </div>
            </div>

            {/* Audio Info */}
            <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Format:</p>
                <p className="font-medium">
                  {analysisResult.user_friendly_summary.audio_info.format}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration:</p>
                <p className="font-medium">
                  {analysisResult.user_friendly_summary.audio_info.duration}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Sample Rate:</p>
                <p className="font-medium">
                  {analysisResult.user_friendly_summary.audio_info.sample_rate}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Bitrate:</p>
                <p className="font-medium">
                  {analysisResult.user_friendly_summary.audio_info.bitrate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default AudioForensics;
