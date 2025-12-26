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
        className={`w-full p-2.5 sm:p-4 text-left transition-colors ${
          hasDetails ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
          {/* Top row on mobile: Icon + Title + Expand Icon */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Icon */}
            <div className={`p-1 sm:p-2 rounded-lg ${meta.color.bg} flex-shrink-0`}>
              <Icon className={`h-3.5 w-3.5 sm:h-5 sm:w-5 ${meta.color.text}`} />
            </div>

            {/* Title and Description */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">
                {meta.label}
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                {meta.description}
              </p>
            </div>

            {/* Expand icon on mobile */}
            {hasDetails && (
              <div className="sm:hidden flex-shrink-0">
                {isExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                )}
              </div>
            )}
          </div>

          {/* Status & Score row */}
          <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
            {data.score !== undefined && (
              <div className="text-left sm:text-right">
                <p className="text-[9px] sm:text-xs text-gray-500 leading-tight">Score</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                  {(data.score * 100).toFixed(0)}%
                </p>
              </div>
            )}

            <Badge
              variant={getStatusVariant(data.status)}
              className="capitalize text-[10px] sm:text-xs whitespace-nowrap px-2 py-0.5"
            >
              {data.status.replace(/_/g, ' ')}
            </Badge>

            {/* Expand icon on desktop */}
            {hasDetails && (
              <div className="hidden sm:block ml-2 flex-shrink-0">
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
          <div className="p-3 sm:p-4">{children}</div>
        </div>
      )}

      {/* Errors Display */}
      {data.errors && data.errors.length > 0 && (
        <div className="border-t bg-red-50 p-3 sm:p-4">
          <p className="text-xs font-semibold text-red-900 mb-2">Errors:</p>
          <div className="space-y-1">
            {data.errors.map((error, index) => (
              <p key={index} className="text-xs text-red-700 break-words">
                • {error}
              </p>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
