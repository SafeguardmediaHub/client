export interface Report {
  id: string;
  title: string;
  type:
    | 'Deepfake Analysis'
    | 'Forensics Report'
    | 'Batch Analysis'
    | 'Custom Report';
  status: 'completed' | 'processing' | 'failed' | 'draft';
  createdBy: string;
  createdAt: string;
  humanFileSize: string;
  description: string;
}
