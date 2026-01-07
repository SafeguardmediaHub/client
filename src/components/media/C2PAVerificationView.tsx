'use client';

import {
  AlertTriangle,
  CheckCircle,
  FileTextIcon,
  Info,
  Shield,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Media } from '@/hooks/useMedia';

interface C2PAVerificationViewProps {
  c2paVerification?: Media['c2paVerification'];
}

export function C2PAVerificationView({
  c2paVerification,
}: C2PAVerificationViewProps) {
  if (!c2paVerification) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No C2PA Verification Available
          </h3>
          <p className="text-sm text-gray-600">
            This file has not been verified for C2PA content credentials yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { result, status, completedAt, error } = c2paVerification;

  const getStatusConfig = () => {
    switch (result.c2paStatus) {
      case 'verified':
        return {
          icon: CheckCircle,
          title: 'C2PA Verified',
          description: 'This file has valid C2PA content credentials.',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          badgeVariant: 'default' as const,
        };
      case 'error':
      case 'no_c2pa_found':
        return {
          icon: Info,
          title: 'No C2PA Found',
          description: 'This file does not contain C2PA content credentials.',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          badgeVariant: 'secondary' as const,
        };
      case 'tampered':
      case 'invalid_signature':
      case 'invalid_certificate':
        return {
          icon: AlertTriangle,
          title: 'C2PA Verification Failed',
          description:
            'This file has C2PA credentials but they could not be verified.',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badgeVariant: 'destructive' as const,
        };
      default:
        return {
          icon: Info,
          title: 'C2PA Status Unknown',
          description: 'The C2PA verification status is unknown.',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          badgeVariant: 'secondary' as const,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <Card className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2`}>
        <CardHeader className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
            <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
          </div>
          <div>
            <CardTitle className={`text-lg ${statusConfig.color}`}>
              {statusConfig.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {statusConfig.description}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant={statusConfig.badgeVariant} className="text-xs">
              Status: {result.c2paStatus}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Manifest: {result.manifestPresent ? 'Present' : 'Not Found'}
            </Badge>
            {result.signatureValid !== null && (
              <Badge variant="outline" className="text-xs">
                Signature: {result.signatureValid ? 'Valid' : 'Invalid'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verification Details */}
      {result.manifestPresent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Verification Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">Manifest Present:</span>
                <div className="flex items-center gap-2">
                  {result.manifestPresent ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={
                      result.manifestPresent
                        ? 'text-green-600 font-medium'
                        : 'text-red-600 font-medium'
                    }
                  >
                    {result.manifestPresent ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {result.signatureValid !== null && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Signature Valid:</span>
                  <div className="flex items-center gap-2">
                    {result.signatureValid ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={
                        result.signatureValid
                          ? 'text-green-600 font-medium'
                          : 'text-red-600 font-medium'
                      }
                    >
                      {result.signatureValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                </div>
              )}

              {result.integrity && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Integrity:</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {result.integrity}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issuer Information */}
      {result.issuer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Issuer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Issuer:</span>
                <p className="font-medium text-gray-900 mt-1">
                  {result.issuer}
                </p>
              </div>
              {result.signedAt && (
                <div>
                  <span className="text-gray-600">Signed At:</span>
                  <p className="font-medium text-gray-900 mt-1">
                    {formatDate(result.signedAt)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-gray-500" />
            Processing Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">Processing Status:</span>
              <Badge variant="outline" className="text-xs capitalize">
                {status}
              </Badge>
            </div>
            {completedAt && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Completed At:</span>
                <span className="text-gray-700">{formatDate(completedAt)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-medium">Attempts:</span>
              <span className="text-gray-700">{c2paVerification.attempts}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Information */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-red-900 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
