import { Badge } from '@/components/ui/badge';
import type { BatchStatus } from '@/types/batch';
import { CheckCircle2, Clock, Loader2, XCircle, AlertTriangle } from 'lucide-react';

interface BatchStatusBadgeProps {
  status: BatchStatus;
  className?: string;
}

export function BatchStatusBadge({ status, className }: BatchStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'COMPLETED':
        return {
          label: 'Completed',
          variant: 'default' as const,
          icon: CheckCircle2,
          className: 'bg-green-100 text-green-700 border-green-200',
        };
      case 'PROCESSING':
        return {
          label: 'Processing',
          variant: 'secondary' as const,
          icon: Loader2,
          className: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      case 'UPLOADING':
        return {
          label: 'Uploading',
          variant: 'secondary' as const,
          icon: Loader2,
          className: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      case 'FAILED':
        return {
          label: 'Failed',
          variant: 'destructive' as const,
          icon: XCircle,
          className: 'bg-red-100 text-red-700 border-red-200',
        };
      case 'PARTIAL_FAILURE':
        return {
          label: 'Partial Failure',
          variant: 'outline' as const,
          icon: AlertTriangle,
          className: 'bg-orange-100 text-orange-700 border-orange-200',
        };
      case 'PENDING':
      default:
        return {
          label: 'Pending',
          variant: 'outline' as const,
          icon: Clock,
          className: 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const isAnimated = status === 'PROCESSING' || status === 'UPLOADING';

  return (
    <Badge variant={config.variant} className={`${config.className} ${className || ''}`}>
      <Icon className={`mr-1.5 h-3.5 w-3.5 ${isAnimated ? 'animate-spin' : ''}`} />
      {config.label}
    </Badge>
  );
}
