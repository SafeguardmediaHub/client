import type { Analysis } from "@/types/analysis";
import type { MediaFile } from "@/types/media";
import type { Report } from "@/types/report";
import type { DashboardOverviewData } from "@/types/dashboard";

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

// Mock Dashboard Data
export const mockDashboardData: DashboardOverviewData = {
  uploadQuota: {
    used: 5368709120, // 5 GB in bytes
    limit: 107374182400, // 100 GB in bytes
    usedGB: 5,
    limitGB: 100,
    percentage: 5,
    fileCount: 247,
    maxFiles: 1000,
    fileCountPercentage: 24.7,
  },
  monthlyUsage: {
    currentMonthFiles: 84,
    monthlyFileLimit: 500,
    filesPercentage: 16.8,
    currentMonthBatches: 12,
    monthlyBatchLimit: 50,
    batchesPercentage: 24,
    daysUntilReset: 4,
    resetDate: new Date(
      Date.now() + 4 * 24 * 60 * 60 * 1000
    ).toISOString(),
  },
  processingSummary: {
    totalFiles: 247,
    pending: 3,
    processing: 5,
    completed: 230,
    failed: 9,
    successRate: 96.2,
    averageProcessingTime: 3.45, // minutes
  },
  integrityBreakdown: {
    totalAnalyzed: 247,
    authentic: 145,
    likelyAuthentic: 52,
    suspicious: 28,
    likelyManipulated: 15,
    manipulated: 7,
    averageIntegrityScore: 78.5,
    tamperingDetected: 22,
    metadataMissing: 34,
    c2paVerified: 89,
  },
  recentActivity: [
    {
      mediaId: 'media_001',
      filename: 'press_conference_2024.mp4',
      uploadedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      status: 'processed',
      integrityScore: 92.5,
      verdict: 'authentic',
      mimeType: 'video/mp4',
      fileSize: 45234567,
    },
    {
      mediaId: 'media_002',
      filename: 'suspicious_edit.jpg',
      uploadedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      status: 'processed',
      integrityScore: 45.2,
      verdict: 'suspicious',
      mimeType: 'image/jpeg',
      fileSize: 2345678,
    },
    {
      mediaId: 'media_003',
      filename: 'analyzing_audio.mp3',
      uploadedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      status: 'processing',
      mimeType: 'audio/mp3',
      fileSize: 8234567,
    },
    {
      mediaId: 'media_004',
      filename: 'verified_document.pdf',
      uploadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      status: 'processed',
      integrityScore: 88.9,
      verdict: 'likely_authentic',
      mimeType: 'application/pdf',
      fileSize: 1234567,
    },
    {
      mediaId: 'media_005',
      filename: 'deepfake_detected.mp4',
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      status: 'processed',
      integrityScore: 15.3,
      verdict: 'manipulated',
      mimeType: 'video/mp4',
      fileSize: 67234567,
    },
  ],
  trends: {
    uploadsOverTime: [
      {
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        count: 12,
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        count: 18,
      },
      {
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        count: 15,
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        count: 22,
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        count: 19,
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        count: 25,
      },
      { date: new Date().toISOString(), count: 14 },
    ],
    filesProcessedOverTime: [
      {
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        count: 11,
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        count: 17,
      },
      {
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        count: 14,
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        count: 21,
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        count: 18,
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        count: 24,
      },
      { date: new Date().toISOString(), count: 13 },
    ],
    integrityScoreTrend: [
      {
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        averageScore: 79.2,
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        averageScore: 81.5,
      },
      {
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        averageScore: 77.8,
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        averageScore: 80.3,
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        averageScore: 82.1,
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        averageScore: 78.9,
      },
      { date: new Date().toISOString(), averageScore: 79.7 },
    ],
    tamperingDetectionTrend: [
      {
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        count: 2,
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        count: 1,
      },
      {
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        count: 3,
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        count: 0,
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        count: 2,
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        count: 1,
      },
      { date: new Date().toISOString(), count: 0 },
    ],
    totalUploadsLast30Days: 425,
    percentageChangeFromPrevious30Days: 23.5,
    mostCommonFileType: 'image',
    mostCommonVerdict: 'authentic',
  },
  subscription: {
    tier: 'premium',
    status: 'active',
    expiresAt: new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000
    ).toISOString(), // 1 year from now
    autoRenew: true,
  },
};
