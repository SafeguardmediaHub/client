import type {
  IntegrityVerdict,
  ProcessingStatus,
  SubscriptionTier,
} from '@/types/dashboard';

/**
 * Format bytes to human-readable format (GB, MB, KB)
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

/**
 * Format relative time (e.g., "2 days ago", "in 5 days")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 1) return 'Yesterday';
    return `${absDays} days ago`;
  }
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `in ${diffDays} days`;
};

/**
 * Get color classes for integrity verdict
 */
export const getVerdictColor = (
  verdict: IntegrityVerdict
): {
  bg: string;
  text: string;
  border: string;
} => {
  switch (verdict) {
    case 'authentic':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      };
    case 'likely_authentic':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
      };
    case 'suspicious':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
      };
    case 'likely_manipulated':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
      };
    case 'manipulated':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
      };
  }
};

/**
 * Get verdict label for display
 */
export const getVerdictLabel = (verdict: IntegrityVerdict): string => {
  const labels: Record<IntegrityVerdict, string> = {
    authentic: 'Authentic',
    likely_authentic: 'Likely Authentic',
    suspicious: 'Suspicious',
    likely_manipulated: 'Likely Manipulated',
    manipulated: 'Manipulated',
  };
  return labels[verdict] || verdict;
};

/**
 * Get badge variant for processing status
 */
export const getStatusBadge = (status: ProcessingStatus): {
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  label: string;
  icon: string;
} => {
  switch (status) {
    case 'processed':
      return { variant: 'default', label: 'Completed', icon: '✓' };
    case 'processing':
      return { variant: 'secondary', label: 'Processing', icon: '⏳' };
    case 'failed':
      return { variant: 'destructive', label: 'Failed', icon: '✗' };
    case 'pending':
      return { variant: 'outline', label: 'Pending', icon: '○' };
    case 'uploaded':
      return { variant: 'outline', label: 'Uploaded', icon: '↑' };
    default:
      return { variant: 'outline', label: status, icon: '?' };
  }
};

/**
 * Get severity for tampering detection
 */
export const getTamperingSeverity = (
  count: number,
  total: number
): {
  severity: 'low' | 'medium' | 'high' | 'critical';
  color: string;
} => {
  if (total === 0) return { severity: 'low', color: 'text-gray-600' };

  const percentage = (count / total) * 100;

  if (percentage >= 75) return { severity: 'critical', color: 'text-red-600' };
  if (percentage >= 50) return { severity: 'high', color: 'text-orange-600' };
  if (percentage >= 25)
    return { severity: 'medium', color: 'text-yellow-600' };
  return { severity: 'low', color: 'text-green-600' };
};

/**
 * Format subscription tier for display
 */
export const formatSubscriptionTier = (tier: SubscriptionTier): string => {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
};

/**
 * Get subscription tier badge color
 */
export const getSubscriptionBadgeColor = (tier: SubscriptionTier): string => {
  switch (tier) {
    case 'enterprise':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'premium':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'standard':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'free':
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
