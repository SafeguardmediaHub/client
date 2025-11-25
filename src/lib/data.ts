import type { Analysis } from "@/types/analysis";
import type { MediaFile } from "@/types/media";
import type { Report } from "@/types/report";

export const chartData = [
  { label: "1000", value: "1000" },
  { label: "800", value: "800" },
  { label: "600", value: "600" },
  { label: "400", value: "400" },
  { label: "200", value: "200" },
  { label: "0", value: "0" },
];

export const chartCategories = [
  { label: "Authentic" },
  { label: "Suspects" },
  { label: "Deepfake" },
];

export const statisticsData = [
  { label: "AI Detection Tools", percent: 72 },
  { label: "Verification Tools", percent: 40 },
  { label: "Report Generation", percent: 18 },
  { label: "Advanced Activities", percent: 63 },
];

export const recentActivities = [
  {
    icon: "/icon-3.svg",
    title: "Deepfake analysis",
    status: "Completed",
    statusColor: "bg-[#e1feea] border-[#049d35] text-[#049d35]",
    dotColor: "bg-[#049d35]",
    description: "video_sample_2024.mp4",
    time: "2 minutes ago.",
  },
  {
    icon: "/icon-2.svg",
    title: "Generating forensics report",
    status: "Processing",
    statusColor: "bg-[#fdfbe1] border-[#d5c70a] text-[#d5c70a]",
    dotColor: "bg-[#d5c70a]",
    description: "Case #2024-1413",
    time: "2 hours ago.",
  },
  {
    icon: "/icon.svg",
    title: "Shared analysis with team",
    status: null,
    statusColor: "",
    dotColor: "",
    description: "National Forensics Team",
    time: "3 hours ago.",
  },
  {
    icon: "/icon-1.svg",
    title: "Uploaded batch files",
    status: null,
    statusColor: "",
    dotColor: "",
    description: "12 media files uploaded for verification",
    time: "4 hours ago.",
  },
];

export const batchProcessingData = [
  {
    title: "Uploading video_sample_112",
    time: "2 mins remaining",
    percent: 62,
  },
  {
    title: "Extracting keyframe from PIS.pdf",
    time: "8 mins remaining",
    percent: 74,
  },
  {
    title: "Generating forensics report from case #2024...",
    time: "2 hrs remaining",
    percent: 46,
  },
  {
    title: "Running custom AI models",
    time: "3 hrs remaining",
    percent: 23,
  },
];

export const mediaFiles: MediaFile[] = [
  {
    id: "1",
    fileName: "suspicious_video_2024.mp4",
    mediaType: "video",
    fileSize: "45.2 MB",
    uploadDate: "2024-01-15T10:30:00Z",
    status: "analyzed",
    thumbnailUrl:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
    analysisResult: {
      classification: "Deepfake",
      confidence: 94.7,
    },
    tags: ["deepfake", "high-risk", "facial-manipulation"],
  },
  {
    id: "2",
    fileName: "news_interview_clip.mp4",
    mediaType: "video",
    fileSize: "78.9 MB",
    uploadDate: "2024-01-14T15:45:00Z",
    status: "analyzed",
    thumbnailUrl:
      "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
    analysisResult: {
      classification: "Authentic",
      confidence: 87.3,
    },
    tags: ["authentic", "news", "interview"],
  },
  {
    id: "3",
    fileName: "profile_image_suspect.jpg",
    mediaType: "image",
    fileSize: "2.4 MB",
    uploadDate: "2024-01-13T09:20:00Z",
    status: "analyzed",
    thumbnailUrl:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
    analysisResult: {
      classification: "Manipulated",
      confidence: 76.8,
    },
    tags: ["manipulated", "face-swap", "medium-risk"],
  },
  {
    id: "4",
    fileName: "social_media_post.png",
    mediaType: "image",
    fileSize: "1.8 MB",
    uploadDate: "2024-01-12T14:10:00Z",
    status: "processing",
    thumbnailUrl:
      "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
    tags: ["social-media", "processing"],
  },
  {
    id: "5",
    fileName: "evidence_video_001.mov",
    mediaType: "video",
    fileSize: "156.7 MB",
    uploadDate: "2024-01-11T11:30:00Z",
    status: "analyzed",
    thumbnailUrl:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
    analysisResult: {
      classification: "Authentic",
      confidence: 92.1,
    },
    tags: ["authentic", "evidence", "legal"],
  },
  {
    id: "6",
    fileName: "document_scan_altered.jpg",
    mediaType: "document",
    fileSize: "3.2 MB",
    uploadDate: "2024-01-10T16:45:00Z",
    status: "error",
    thumbnailUrl:
      "https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
    tags: ["document", "error", "failed-analysis"],
  },
];
