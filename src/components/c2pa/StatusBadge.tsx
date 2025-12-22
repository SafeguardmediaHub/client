'use client';

import {
  AlertTriangle,
  CheckCircle,
  CircleDashed,
  Loader2,
  ShieldAlert,
  ShieldX,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { VerificationStatus } from '@/types/c2pa';

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

const statusConfig: Record<
  VerificationStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
    dotColor: string;
  }
> = {
  verified: {
    label: 'Verified',
    icon: CheckCircle,
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    dotColor: 'bg-emerald-500',
  },
  tampered: {
    label: 'Tampered',
    icon: ShieldAlert,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    dotColor: 'bg-red-500',
  },
  invalid_signature: {
    label: 'Invalid Signature',
    icon: ShieldX,
    className:
      'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    dotColor: 'bg-orange-500',
  },
  invalid_certificate: {
    label: 'Invalid Certificate',
    icon: AlertTriangle,
    className:
      'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    dotColor: 'bg-yellow-500',
  },
  no_c2pa_found: {
    label: 'No C2PA',
    icon: CircleDashed,
    className: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
    dotColor: 'bg-gray-400',
  },
  processing: {
    label: 'Processing',
    icon: Loader2,
    className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    dotColor: 'bg-blue-500',
  },
  error: {
    label: 'Error',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    dotColor: 'bg-red-500',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const iconSizes = {
  sm: 'size-3',
  md: 'size-3.5',
  lg: 'size-4',
};

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  showLabel = true,
  className,
}: StatusBadgeProps) {
  // Fallback config for unknown statuses
  const config = statusConfig[status] || {
    label: status?.toString() || 'Unknown',
    icon: CircleDashed,
    className: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
    dotColor: 'bg-gray-400',
  };
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium transition-colors inline-flex items-center gap-1.5',
        sizeClasses[size],
        config.className,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            iconSizes[size],
            status === 'processing' && 'animate-spin'
          )}
        />
      )}
      {showLabel && <span>{config.label}</span>}
    </Badge>
  );
}

export function StatusDot({
  status,
  size = 'md',
  pulse = false,
  className,
}: {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}) {
  // Fallback config for unknown statuses
  const config = statusConfig[status] || {
    label: status?.toString() || 'Unknown',
    icon: CircleDashed,
    className: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
    dotColor: 'bg-gray-400',
  };

  const dotSizes = {
    sm: 'size-2',
    md: 'size-2.5',
    lg: 'size-3',
  };

  return (
    <span className={cn('relative inline-flex', className)}>
      <span
        className={cn(
          'rounded-full',
          dotSizes[size],
          config.dotColor,
          pulse && 'animate-pulse'
        )}
      />
      {status === 'processing' && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            config.dotColor
          )}
        />
      )}
    </span>
  );
}
