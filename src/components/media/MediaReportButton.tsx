'use client';

import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGenerateMediaReport } from '@/hooks/useMediaReport';

interface MediaReportButtonProps {
  mediaId: string;
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive';
  className?: string;
}

export function MediaReportButton({
  mediaId,
  variant = 'default',
  className,
}: MediaReportButtonProps) {
  const { mutate: generateReport, isPending } = useGenerateMediaReport();

  const handleGenerateReport = () => {
    generateReport(mediaId);
  };

  return (
    <Button
      onClick={handleGenerateReport}
      disabled={isPending}
      variant={variant}
      className={className}
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </>
      )}
    </Button>
  );
}
