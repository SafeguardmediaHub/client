'use client';

import {
  AlertTriangle,
  CheckCircle,
  CircleDashed,
  Copy,
  Info,
  ShieldAlert,
  ShieldX,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { C2PABadge, VerificationStatus } from '@/types/c2pa';

interface BadgePreviewProps {
  badge: C2PABadge;
  onClick?: () => void;
  className?: string;
}

const statusIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  verified: CheckCircle,
  tampered: ShieldAlert,
  invalid_signature: ShieldX,
  invalid_certificate: AlertTriangle,
  no_c2pa: CircleDashed,
  no_c2pa_found: CircleDashed,
  processing: Info,
  error: XCircle,
};

// Convert color name to hex or generate light background
const getBackgroundColor = (color: string): string => {
  const colorMap: Record<string, string> = {
    green: '#d1fae5',
    red: '#fee2e2',
    yellow: '#fef3c7',
    gray: '#f3f4f6',
    blue: '#dbeafe',
    orange: '#fed7aa',
  };
  return colorMap[color.toLowerCase()] || '#f3f4f6';
};

const getTextColor = (color: string): string => {
  const colorMap: Record<string, string> = {
    green: '#10b981',
    red: '#ef4444',
    yellow: '#f59e0b',
    gray: '#6b7280',
    blue: '#3b82f6',
    orange: '#f97316',
  };
  return colorMap[color.toLowerCase()] || '#6b7280';
};

export function BadgePreview({ badge, onClick, className }: BadgePreviewProps) {
  const Icon = statusIcons[badge.status] || Info;
  const backgroundColor = badge.backgroundColor || getBackgroundColor(badge.color);
  const textColor = getTextColor(badge.color);
  const displayName = badge.label || badge.name || 'Unknown';

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        'animate-in fade-in slide-in-from-bottom-2',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Badge icon */}
          <div
            className="size-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor }}
          >
            <Icon className="size-6" style={{ color: textColor }} />
          </div>

          {/* Badge info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">{displayName}</h3>
            <p className="text-xs text-gray-500 truncate">{badge.description}</p>
          </div>

          {/* Color indicator */}
          <div
            className="size-4 rounded-full border border-gray-200"
            style={{ backgroundColor: textColor }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface BadgeModalProps {
  badge: C2PABadge | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeModal({ badge, isOpen, onClose }: BadgeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!badge) return null;

  const Icon = statusIcons[badge.status] || Info;
  const backgroundColor = badge.backgroundColor || getBackgroundColor(badge.color);
  const textColor = getTextColor(badge.color);
  const displayName = badge.label || badge.name || 'Unknown';

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(badge, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Badge Details</SheetTitle>
          <SheetDescription>
            View badge configuration and display rules
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Badge preview */}
          <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
            <div
              className="size-20 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor }}
            >
              <Icon className="size-10" style={{ color: textColor }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              {badge.description}
            </p>
            {badge.tooltip && (
              <p className="text-xs text-gray-400 text-center mt-2 italic">
                {badge.tooltip}
              </p>
            )}
          </div>

          {/* Color scheme */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Color Scheme</h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="size-6 rounded border border-gray-200"
                  style={{ backgroundColor: textColor }}
                />
                <span className="text-xs font-mono text-gray-600">
                  {textColor}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="size-6 rounded border border-gray-200"
                  style={{ backgroundColor }}
                />
                <span className="text-xs font-mono text-gray-600">
                  {backgroundColor}
                </span>
              </div>
            </div>
          </div>

          {/* Display rules */}
          {badge.displayRules && badge.displayRules.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Display Rules</h4>
              <div className="space-y-2">
                {badge.displayRules.map((rule, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500">
                        Priority: {rule.priority}
                      </span>
                    </div>
                    <p className="text-gray-700">{rule.showWhen}</p>
                    <code className="text-xs font-mono text-blue-600 mt-1 block">
                      {rule.condition}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status and Icon */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Status Information</h4>
            <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-mono text-gray-900">{badge.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Icon:</span>
                <span className="font-mono text-gray-900">{badge.icon}</span>
              </div>
            </div>
          </div>

          {/* Copy JSON button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCopyJson}
          >
            <Copy className="size-4 mr-2" />
            {copied ? 'Copied!' : 'Copy Badge JSON'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function BadgePreviewSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('animate-pulse', className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
          <div className="size-4 rounded-full bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  );
}
