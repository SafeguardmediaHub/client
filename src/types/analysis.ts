export interface Analysis {
  _id: string;
  fileName: string;
  mediaType: 'image' | 'video' | 'audio';
  modelInfo: {
    name: string;
  };
  status: 'completed' | 'processing' | 'failed' | 'pending';
  uploadDate: string;
  predictedClass: string;
  confidenceScore: number;
  thumbnailUrl: string;
}

export interface AnalysisSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateReport: (selectedAnalyses: Analysis[]) => void;
}
