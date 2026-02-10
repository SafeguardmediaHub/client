'use client';

import {
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGenerateMediaReport } from '@/hooks/useMediaReport';

interface MediaReportGeneratorProps {
  mediaId: string;
  mediaName: string;
}

export function MediaReportGenerator({
  mediaId,
  mediaName,
}: MediaReportGeneratorProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const {
    mutate: generateReport,
    isPending,
    isError,
  } = useGenerateMediaReport();

  const handleGenerate = () => {
    generateReport(mediaId, {
      onSuccess: (data) => {
        setDownloadUrl(data.downloadUrl);
      },
    });
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Forensics Report
          </h3>
          <p className="text-sm text-gray-600">
            Generate comprehensive analysis report
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4">
        Generate a comprehensive PDF report containing all analysis results for{' '}
        <strong>{mediaName}</strong>
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          Report includes:
        </h4>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            Metadata analysis (EXIF, GPS)
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            Tamper detection results
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            Content hashing (SHA-256, perceptual)
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            OCR extracted text
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            C2PA verification status
          </li>
        </ul>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">
              Failed to generate report
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              Please try again or contact support if the issue persists.
            </p>
          </div>
        </div>
      )}

      {downloadUrl && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-900">
              Report generated successfully!
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Download link expires in 15 minutes.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {!downloadUrl ? (
          <Button
            onClick={handleGenerate}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        ) : (
          <>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button
              onClick={() => {
                setDownloadUrl(null);
                handleGenerate();
              }}
              variant="outline"
            >
              Regenerate
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
