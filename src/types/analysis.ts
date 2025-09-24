export interface Analysis {
  id: string;
  fileName: string;
  mediaType: string;
  uploadDate: string;
  predictedClass: string;
  isDeepfake: boolean;
  confidenceScore: number;
  riskScore: number;
  thumbnailUrl: string;
  status: string;
  createdAt: string;
}
export interface AnalysisSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateReport: (selectedAnalyses: Analysis[]) => void;
}
