import { CheckCircle, XCircle, AlertCircle, Shield, Cpu, Code } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { C2PAFull } from '@/types/batch';
import { formatDate } from '@/lib/batch-utils';
import type { VerificationData } from '../VerificationRegistry';

interface C2PARendererProps {
  data: VerificationData;
}

export function C2PARenderer({ data }: C2PARendererProps) {
  const c2paFull = data.fullData as C2PAFull | undefined;
  const result = c2paFull?.result;

  if (!result) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        No detailed C2PA data available
      </div>
    );
  }

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
    <div className="space-y-3 sm:space-y-4">
      {/* Certificate Status */}
      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <span className="text-gray-600">Manifest Present:</span>
          <div className="flex items-center gap-2">
            <StatusIcon valid={result.manifestPresent} />
            <span className={`font-medium ${getStatusColor(result.manifestPresent)}`}>
              {result.manifestPresent ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {result.manifestPresent && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
              <span className="text-gray-600">Signature Valid:</span>
              <div className="flex items-center gap-2">
                <StatusIcon valid={result.signatureValid} />
                <span className={`font-medium ${getStatusColor(result.signatureValid)}`}>
                  {result.signatureValid ? 'Valid' : 'Invalid'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
              <span className="text-gray-600">Certificate Chain:</span>
              <div className="flex items-center gap-2">
                <StatusIcon valid={result.certificateChainValid} />
                <span className={`font-medium ${getStatusColor(result.certificateChainValid)}`}>
                  {result.certificateChainValid ? 'Valid' : 'Invalid'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
              <span className="text-gray-600">Certificate Status:</span>
              <div className="flex items-center gap-2">
                <StatusIcon valid={!result.certificateExpired} />
                <span className={`font-medium ${getStatusColor(!result.certificateExpired)}`}>
                  {result.certificateExpired ? 'Expired' : 'Active'}
                </span>
              </div>
            </div>

            {result.editedAfterSigning !== null && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <span className="text-gray-600">Edited After Signing:</span>
                <div className="flex items-center gap-2">
                  <StatusIcon valid={!result.editedAfterSigning} />
                  <span className={`font-medium ${getStatusColor(!result.editedAfterSigning)}`}>
                    {result.editedAfterSigning ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Issuer Information */}
      {result.issuer && (
        <Card className="p-2 sm:p-3 bg-white">
          <h4 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-2">
            Issuer Information
          </h4>
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
            <div>
              <span className="text-gray-600 text-[10px] sm:text-xs">Issuer:</span>
              <p className="font-medium text-gray-900 break-words">{result.issuer}</p>
            </div>
            {result.signedAt && (
              <div>
                <span className="text-gray-600 text-[10px] sm:text-xs">Signed At:</span>
                <p className="font-medium text-gray-900 break-words">
                  {formatDate(result.signedAt)}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Device & Software */}
      {(result.device || result.software) && (
        <Card className="p-2 sm:p-3 bg-white">
          <h4 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Cpu className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Device & Software
          </h4>
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
            {result.device && (
              <div>
                <span className="text-gray-600 text-[10px] sm:text-xs">Device:</span>
                <p className="font-medium text-gray-900 break-words">{result.device}</p>
              </div>
            )}
            {result.software && (
              <div>
                <span className="text-gray-600 text-[10px] sm:text-xs">Software:</span>
                <p className="font-medium text-gray-900 break-words">{result.software}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Processing Info */}
      {result.processingInfo && (
        <Card className="p-2 sm:p-3 bg-white">
          <h4 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Code className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Processing Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] sm:text-xs">
            <div>
              <span className="text-gray-600">Tool Version:</span>
              <p className="font-medium text-gray-900 break-words">
                {result.processingInfo.toolVersion}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Media Type:</span>
              <p className="font-medium text-gray-900 break-words">
                {result.processingInfo.mediaType}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
