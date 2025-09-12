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
