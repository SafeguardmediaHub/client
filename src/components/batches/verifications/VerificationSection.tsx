import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { VerificationData, VerificationMeta } from './VerificationRegistry';
import { getStatusVariant } from './VerificationRegistry';

interface VerificationSectionProps {
  meta: VerificationMeta;
  data: VerificationData;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
}

export function VerificationSection({
  meta,
  data,
  children,
  defaultExpanded = false,
}: VerificationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const Icon = meta.icon;
  const hasDetails = !!children;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
        className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
          hasDetails ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          {/* Icon */}
          <div className={`p-2 rounded-lg ${meta.color.bg}`}>
            <Icon className={`h-5 w-5 ${meta.color.text}`} />
          </div>

          {/* Title and Description */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">{meta.label}</h3>
            <p className="text-xs text-gray-500 truncate">{meta.description}</p>
          </div>

          {/* Status & Score */}
          <div className="flex items-center gap-3">
            {data.score !== undefined && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Score</p>
                <p className="text-sm font-semibold text-gray-900">
                  {(data.score * 100).toFixed(0)}%
                </p>
              </div>
            )}

            <Badge variant={getStatusVariant(data.status)} className="capitalize">
              {data.status.replace(/_/g, ' ')}
            </Badge>

            {hasDetails && (
              <div className="ml-2">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Expandable Details */}
      {hasDetails && isExpanded && (
        <div className="border-t bg-gray-50">
          <div className="p-4">{children}</div>
        </div>
      )}

      {/* Errors Display */}
      {data.errors && data.errors.length > 0 && (
        <div className="border-t bg-red-50 p-4">
          <p className="text-xs font-semibold text-red-900 mb-2">Errors:</p>
          <div className="space-y-1">
            {data.errors.map((error, index) => (
              <p key={index} className="text-xs text-red-700">
                • {error}
              </p>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
