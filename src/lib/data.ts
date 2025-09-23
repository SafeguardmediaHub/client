import type { Analysis } from '@/types/analysis';
import type { Report } from '@/types/report';

export const chartData = [
  { label: '1000', value: '1000' },
  { label: '800', value: '800' },
  { label: '600', value: '600' },
  { label: '400', value: '400' },
  { label: '200', value: '200' },
  { label: '0', value: '0' },
];

export const chartCategories = [
  { label: 'Authentic' },
  { label: 'Suspects' },
  { label: 'Deepfake' },
];

export const statisticsData = [
  { label: 'AI Detection Tools', percent: 72 },
  { label: 'Verification Tools', percent: 40 },
  { label: 'Report Generation', percent: 18 },
  { label: 'Advanced Activities', percent: 63 },
];

export const recentActivities = [
  {
    icon: '/icon-3.svg',
    title: 'Deepfake analysis',
    status: 'Completed',
    statusColor: 'bg-[#e1feea] border-[#049d35] text-[#049d35]',
    dotColor: 'bg-[#049d35]',
    description: 'video_sample_2024.mp4',
    time: '2 minutes ago.',
  },
  {
    icon: '/icon-2.svg',
    title: 'Generating forensics report',
    status: 'Processing',
    statusColor: 'bg-[#fdfbe1] border-[#d5c70a] text-[#d5c70a]',
    dotColor: 'bg-[#d5c70a]',
    description: 'Case #2024-1413',
    time: '2 hours ago.',
  },
  {
    icon: '/icon.svg',
    title: 'Shared analysis with team',
    status: null,
    statusColor: '',
    dotColor: '',
    description: 'National Forensics Team',
    time: '3 hours ago.',
  },
  {
    icon: '/icon-1.svg',
    title: 'Uploaded batch files',
    status: null,
    statusColor: '',
    dotColor: '',
    description: '12 media files uploaded for verification',
    time: '4 hours ago.',
  },
];

export const batchProcessingData = [
  {
    title: 'Uploading video_sample_112',
    time: '2 mins remaining',
    percent: 62,
  },
  {
    title: 'Extracting keyframe from PIS.pdf',
    time: '8 mins remaining',
    percent: 74,
  },
  {
    title: 'Generating forensics report from case #2024...',
    time: '2 hrs remaining',
    percent: 46,
  },
  {
    title: 'Running custom AI models',
    time: '3 hrs remaining',
    percent: 23,
  },
];

export const reports: Report[] = [
  {
    id: '1',
    title: 'Deepfake Analysis Report - Case #2024-1413',
    type: 'Deepfake Analysis',
    status: 'Completed',
    createdBy: 'Jane Doe',
    createdDate: '2024-01-15',
    fileSize: '2.4 MB',
    description:
      'Comprehensive analysis of video_sample_2024.mp4 with 98.7% confidence deepfake detection',
  },
  {
    id: '2',
    title: 'Forensics Investigation - Social Media Batch',
    type: 'Forensics Report',
    status: 'Processing',
    createdBy: 'John Smith',
    createdDate: '2024-01-14',
    fileSize: '5.1 MB',
    description:
      'Multi-file forensics analysis for social media verification project',
  },
  {
    id: '3',
    title: 'Weekly Batch Processing Summary',
    type: 'Batch Analysis',
    status: 'Completed',
    createdBy: 'Sarah Johnson',
    createdDate: '2024-01-13',
    fileSize: '1.8 MB',
    description:
      'Summary report of 47 files processed through automated batch analysis',
  },
  {
    id: '4',
    title: 'Custom AI Model Performance Report',
    type: 'Custom Report',
    status: 'Draft',
    createdBy: 'Mike Chen',
    createdDate: '2024-01-12',
    fileSize: '3.2 MB',
    description:
      'Performance metrics and accuracy analysis for custom trained models',
  },
  {
    id: '5',
    title: 'Tamper Detection Analysis - Evidence #4421',
    type: 'Forensics Report',
    status: 'Failed',
    createdBy: 'Lisa Wang',
    createdDate: '2024-01-11',
    fileSize: '0.9 MB',
    description:
      'Image tampering analysis with metadata extraction and timeline verification',
  },
];

export const mockAnalyses: Analysis[] = [
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j1',
    fileName: 'suspicious_video_2024.mp4',
    mediaType: 'video',
    modelInfo: { name: 'DeepfakeDetector' },
    status: 'completed',
    uploadDate: '2024-01-15T10:30:00Z',
    predictedClass: 'Deepfake',
    confidenceScore: 94.7,
    thumbnailUrl:
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j2',
    fileName: 'news_interview_clip.mp4',
    mediaType: 'video',
    modelInfo: { name: 'DeepfakeDetector' },
    status: 'completed',
    uploadDate: '2024-01-14T15:45:00Z',
    predictedClass: 'Authentic',
    confidenceScore: 87.3,
    thumbnailUrl:
      'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j3',
    fileName: 'profile_image_suspect.jpg',
    mediaType: 'image',
    modelInfo: { name: 'FaceForensics' },
    status: 'completed',
    uploadDate: '2024-01-13T09:20:00Z',
    predictedClass: 'Manipulated',
    confidenceScore: 76.8,
    thumbnailUrl:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j4',
    fileName: 'social_media_post.png',
    mediaType: 'image',
    modelInfo: { name: 'TamperDetector' },
    status: 'processing',
    uploadDate: '2024-01-12T14:10:00Z',
    predictedClass: 'Processing',
    confidenceScore: 0,
    thumbnailUrl:
      'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j5',
    fileName: 'evidence_video_001.mov',
    mediaType: 'video',
    modelInfo: { name: 'DeepfakeDetector' },
    status: 'completed',
    uploadDate: '2024-01-11T11:30:00Z',
    predictedClass: 'Authentic',
    confidenceScore: 92.1,
    thumbnailUrl:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j6',
    fileName: 'document_scan_altered.jpg',
    mediaType: 'image',
    modelInfo: { name: 'DocumentForensics' },
    status: 'failed',
    uploadDate: '2024-01-10T16:45:00Z',
    predictedClass: 'Error',
    confidenceScore: 0,
    thumbnailUrl:
      'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j7',
    fileName: 'celebrity_deepfake.mp4',
    mediaType: 'video',
    modelInfo: { name: 'DeepfakeDetector' },
    status: 'completed',
    uploadDate: '2024-01-09T13:20:00Z',
    predictedClass: 'Deepfake',
    confidenceScore: 98.9,
    thumbnailUrl:
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j8',
    fileName: 'forensic_sample_batch_01.jpg',
    mediaType: 'image',
    modelInfo: { name: 'FaceForensics' },
    status: 'completed',
    uploadDate: '2024-01-08T08:15:00Z',
    predictedClass: 'Authentic',
    confidenceScore: 84.6,
    thumbnailUrl:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j9',
    fileName: 'security_footage_enhanced.mp4',
    mediaType: 'video',
    modelInfo: { name: 'VideoForensics' },
    status: 'pending',
    uploadDate: '2024-01-07T12:00:00Z',
    predictedClass: 'Pending',
    confidenceScore: 0,
    thumbnailUrl:
      'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
  {
    _id: '64f1a2b3c4d5e6f7g8h9i0j0',
    fileName: 'comparison_analysis_set.png',
    mediaType: 'image',
    modelInfo: { name: 'ComparativeAnalysis' },
    status: 'completed',
    uploadDate: '2024-01-06T17:30:00Z',
    predictedClass: 'Suspicious',
    confidenceScore: 71.2,
    thumbnailUrl:
      'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  },
];
