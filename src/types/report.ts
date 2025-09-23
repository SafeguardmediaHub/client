export interface Report {
  id: string;
  title: string;
  type:
    | 'Deepfake Analysis'
    | 'Forensics Report'
    | 'Batch Analysis'
    | 'Custom Report';
  status: 'Completed' | 'Processing' | 'Failed' | 'Draft';
  createdBy: string;
  createdDate: string;
  fileSize: string;
  description: string;
}
