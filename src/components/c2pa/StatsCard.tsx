'use client';

import { ArrowDown, ArrowUp, Minus, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon?: LucideIcon;
  change?: number; // Percentage change
  changeLabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
  isLoading?: boolean;
  className?: string;
}

const variantStyles = {
  default: {
    icon: 'bg-blue-50 text-blue-600',
    text: 'text-blue-600',
  },
  success: {
    icon: 'bg-emerald-50 text-emerald-600',
    text: 'text-emerald-600',
  },
  warning: {
    icon: 'bg-amber-50 text-amber-600',
    text: 'text-amber-600',
  },
  danger: {
    icon: 'bg-red-50 text-red-600',
    text: 'text-red-600',
  },
  neutral: {
    icon: 'bg-gray-50 text-gray-600',
    text: 'text-gray-600',
  },
};

function AnimatedNumber({ value, duration = 500 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  variant = 'default',
  isLoading = false,
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant];

  if (isLoading) {
    return (
      <Card className={cn('transition-all duration-200', className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="size-10 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md animate-in fade-in slide-in-from-bottom-2',
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">
              <AnimatedNumber value={value} />
            </p>
            {change !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                {change > 0 ? (
                  <ArrowUp className="size-3 text-emerald-500" />
                ) : change < 0 ? (
                  <ArrowDown className="size-3 text-red-500" />
                ) : (
                  <Minus className="size-3 text-gray-400" />
                )}
                <span
                  className={cn(
                    'font-medium',
                    change > 0 && 'text-emerald-600',
                    change < 0 && 'text-red-600',
                    change === 0 && 'text-gray-500'
                  )}
                >
                  {Math.abs(change)}%
                </span>
                {changeLabel && (
                  <span className="text-gray-400">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn('rounded-lg p-2.5', styles.icon)}>
              <Icon className="size-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('transition-all duration-200', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="size-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
