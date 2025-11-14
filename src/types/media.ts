export interface MediaFile {
  id: string;
  fileName: string;
  mediaType: "image" | "video" | "audio" | "document";
  fileSize: string;
  uploadDate: string;
  status: "analyzed" | "processing" | "pending" | "error";
  thumbnailUrl: string;
  analysisResult?: {
    classification: string;
    confidence: number;
  };
  tags: string[];
}
