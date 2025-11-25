'use client';

import {
  AlertCircle,
  Award,
  Building2,
  Calendar,
  CheckCircle,
  Hash,
  XCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Certificate } from '@/types/c2pa';

interface CertificateTimelineProps {
  certificates?: Certificate[];
  className?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function CertificateCard({
  certificate,
  index,
  total,
}: {
  certificate: Certificate;
  index: number;
  total: number;
}) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const isValid = certificate.isValid;
  const now = new Date();
  const validTo = new Date(certificate.validTo);
  const isExpired = validTo < now;

  return (
    <div
      className="relative animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-0 w-px bg-gray-200" />
      )}

      {/* Certificate card */}
      <div className="flex gap-4">
        {/* Timeline indicator */}
        <div className="flex-shrink-0">
          <div
            className={cn(
              'size-12 rounded-full flex items-center justify-center border-2',
              isValid && !isExpired
                ? 'bg-emerald-50 border-emerald-500'
                : 'bg-red-50 border-red-500'
            )}
          >
            {isFirst ? (
              <Award
                className={cn(
                  'size-5',
                  isValid && !isExpired ? 'text-emerald-600' : 'text-red-600'
                )}
              />
            ) : isValid && !isExpired ? (
              <CheckCircle className="size-5 text-emerald-600" />
            ) : (
              <XCircle className="size-5 text-red-600" />
            )}
          </div>
        </div>

        {/* Certificate content */}
        <Card className="flex-1 mb-4">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {isFirst ? 'End Entity' : isLast ? 'Root CA' : 'Intermediate CA'}
                  </span>
                  {isExpired && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      <AlertCircle className="size-3" />
                      Expired
                    </span>
                  )}
                </div>
                <h4 className="text-base font-semibold text-gray-900 mt-1">
                  {certificate.subject}
                </h4>
              </div>
              <div
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  isValid && !isExpired
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                )}
              >
                {isValid && !isExpired ? 'Valid' : isExpired ? 'Expired' : 'Invalid'}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="size-4 text-gray-400" />
                <span className="truncate">{certificate.issuer}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Hash className="size-4 text-gray-400" />
                <span className="font-mono text-xs truncate">
                  {certificate.serialNumber.slice(0, 16)}...
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="size-4 text-gray-400" />
                <span>From: {formatDate(certificate.validFrom)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="size-4 text-gray-400" />
                <span>To: {formatDate(certificate.validTo)}</span>
              </div>
            </div>

            {/* Fingerprint */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-medium">Fingerprint:</span>
                <code className="font-mono bg-gray-50 px-2 py-0.5 rounded">
                  {certificate.fingerprint.slice(0, 32)}...
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CertificateTimeline({
  certificates,
  className,
}: CertificateTimelineProps) {
  if (!certificates || certificates.length === 0) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <Award className="size-12 mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No certificate chain available</p>
      </div>
    );
  }

  return (
    <div className={cn('', className)}>
      {certificates.map((cert, index) => (
        <CertificateCard
          key={cert.id}
          certificate={cert}
          index={index}
          total={certificates.length}
        />
      ))}
    </div>
  );
}

export function CertificateTimelineSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="size-12 rounded-full bg-gray-200" />
          <div className="flex-1 p-4 border rounded-lg">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-48 bg-gray-200 rounded mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
