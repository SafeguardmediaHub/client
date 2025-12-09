import { CheckCircle, XCircle, AlertCircle, Shield, Cpu, Code } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { C2PAFull } from '@/types/batch';
import { formatDate } from '@/lib/batch-utils';

interface C2PACertificateStatusProps {
  c2paFull?: C2PAFull;
}

export function C2PACertificateStatus({ c2paFull }: C2PACertificateStatusProps) {
  if (!c2paFull || !c2paFull.result) {
    return (
      <div className="text-center py-12 text-gray-500">
        No C2PA certificate data available
      </div>
    );
  }

  const { result } = c2paFull;

  const StatusIcon = ({ valid }: { valid: boolean | null }) => {
    if (valid === null) return <AlertCircle className="h-4 w-4 text-gray-400" />;
    return valid ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusColor = (valid: boolean | null) => {
    if (valid === null) return 'text-gray-600';
    return valid ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          C2PA Certificate Details
        </h3>

        <div className="space-y-3 text-sm">
          {/* Overall Status */}
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-gray-600">Overall Status:</span>
            <Badge
              variant={result.manifestPresent ? 'default' : 'secondary'}
              className="ml-2"
            >
              {result.status}
            </Badge>
          </div>

          {/* Manifest Present */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Manifest Present:</span>
            <div className="flex items-center gap-2">
              <StatusIcon valid={result.manifestPresent} />
              <span className={`font-medium ${getStatusColor(result.manifestPresent)}`}>
                {result.manifestPresent ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {/* Signature Valid */}
          {result.manifestPresent && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Signature Valid:</span>
                <div className="flex items-center gap-2">
                  <StatusIcon valid={result.signatureValid} />
                  <span className={`font-medium ${getStatusColor(result.signatureValid)}`}>
                    {result.signatureValid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
              </div>

              {/* Certificate Chain Valid */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Certificate Chain:</span>
                <div className="flex items-center gap-2">
                  <StatusIcon valid={result.certificateChainValid} />
                  <span
                    className={`font-medium ${getStatusColor(result.certificateChainValid)}`}
                  >
                    {result.certificateChainValid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
              </div>

              {/* Certificate Expired */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Certificate Status:</span>
                <div className="flex items-center gap-2">
                  <StatusIcon valid={!result.certificateExpired} />
                  <span
                    className={`font-medium ${getStatusColor(!result.certificateExpired)}`}
                  >
                    {result.certificateExpired ? 'Expired' : 'Active'}
                  </span>
                </div>
              </div>

              {/* Integrity */}
              {result.integrity && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Integrity:</span>
                  <span className="font-medium text-gray-900">{result.integrity}</span>
                </div>
              )}

              {/* Edited After Signing */}
              {result.editedAfterSigning !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Edited After Signing:</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon valid={!result.editedAfterSigning} />
                    <span
                      className={`font-medium ${getStatusColor(!result.editedAfterSigning)}`}
                    >
                      {result.editedAfterSigning ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Issuer Information */}
      {result.issuer && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Issuer Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Issuer:</span>
              <p className="font-medium text-gray-900 mt-1">{result.issuer}</p>
            </div>
            {result.signedAt && (
              <div>
                <span className="text-gray-600">Signed At:</span>
                <p className="font-medium text-gray-900 mt-1">{formatDate(result.signedAt)}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Device & Software */}
      {(result.device || result.software) && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Device & Software
          </h3>
          <div className="space-y-2 text-sm">
            {result.device && (
              <div>
                <span className="text-gray-600">Device:</span>
                <p className="font-medium text-gray-900 mt-1">{result.device}</p>
              </div>
            )}
            {result.software && (
              <div>
                <span className="text-gray-600">Software:</span>
                <p className="font-medium text-gray-900 mt-1">{result.software}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Processing Information */}
      {result.processingInfo && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Code className="h-4 w-4" />
            Processing Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tool Version:</span>
              <span className="font-medium text-gray-900">
                {result.processingInfo.toolVersion}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Media Type:</span>
              <span className="font-medium text-gray-900">
                {result.processingInfo.mediaType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Verified At:</span>
              <span className="font-medium text-gray-900">
                {formatDate(result.processingInfo.verifiedAt)}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Errors */}
      {result.errors && result.errors.length > 0 && (
        <Card className="p-4 border-red-200 bg-red-50">
          <h3 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Errors ({result.errors.length})
          </h3>
          <div className="space-y-2">
            {result.errors.map((error, index) => (
              <div key={index} className="text-sm text-red-700 bg-white rounded p-2">
                {error}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
