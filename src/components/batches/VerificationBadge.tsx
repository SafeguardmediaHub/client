import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  MinusCircle,
  XCircle,
} from 'lucide-react';
import type { VerificationStatus } from '@/types/batch';

interface VerificationBadgeProps {
  status: VerificationStatus;
  label?: string;
  showLabel?: boolean;
}

export function VerificationBadge({
  status,
  label,
  showLabel = false,
}: VerificationBadgeProps) {
  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Verified',
        };
      case 'tampered':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: 'Tampered',
        };
      case 'no_data_found':
        return {
          icon: MinusCircle,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          text: 'No Data',
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: 'Failed',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-gray-400',
          bgColor: 'bg-gray-100',
          text: 'Pending',
        };
      case 'processing':
        return {
          icon: Loader2,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'Processing',
        };
      case 'skipped':
        return {
          icon: MinusCircle,
          color: 'text-gray-400',
          bgColor: 'bg-gray-100',
          text: 'Skipped',
        };
      default:
        return {
          icon: HelpCircle,
          color: 'text-gray-400',
          bgColor: 'bg-gray-100',
          text: 'Unknown',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  if (showLabel) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
      >
        <Icon
          className={`h-3 w-3 ${status === 'processing' ? 'animate-spin' : ''}`}
        />
        {label || config.text}
      </span>
    );
  }

  return (
    <span title={label || config.text}>
      <Icon
        className={`h-4 w-4 ${config.color} ${status === 'processing' ? 'animate-spin' : ''}`}
      />
    </span>
  );
}
