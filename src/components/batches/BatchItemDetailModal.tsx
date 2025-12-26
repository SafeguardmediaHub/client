import { AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBatchItemDetails } from '@/hooks/batches/useBatchItemDetails';
import { formatDate, formatFileSize, getFileIcon } from '@/lib/batch-utils';
import { PerformanceMetrics } from './PerformanceMetrics';
import { VerificationBadges } from './VerificationBadges';
import { VerificationScoresComponent } from './VerificationScores';
import { AllVerificationsTab } from './verifications/AllVerificationsTab';
import { getAvailableVerifications } from './verifications/VerificationRegistry';

interface BatchItemDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchId: string;
  itemId: string;
  filename: string;
}

export function BatchItemDetailModal({
  open,
  onOpenChange,
  batchId,
  itemId,
  filename,
}: BatchItemDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedMediaId, setCopiedMediaId] = useState(false);

  const { data: itemDetails, isLoading } = useBatchItemDetails(
    batchId,
    itemId,
    open
  );

  const copyMediaId = (mediaId: string) => {
    navigator.clipboard.writeText(mediaId);
    setCopiedMediaId(true);
    setTimeout(() => setCopiedMediaId(false), 2000);
  };

  // Get count of available verifications for badge
  const verificationsCount = itemDetails
    ? getAvailableVerifications(itemDetails).length
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <span className="text-xl sm:text-2xl flex-shrink-0">
              {getFileIcon(itemDetails?.mimeType || '')}
            </span>
            <span className="truncate">{filename}</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Detailed verification results and analysis
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : !itemDetails ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-gray-600">Failed to load item details</p>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="w-full overflow-x-auto mb-4">
              <TabsList className="inline-flex sm:grid sm:w-full sm:grid-cols-4 w-max sm:w-full">
                <TabsTrigger value="overview" className="whitespace-nowrap">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="verifications" className="whitespace-nowrap">
                  Verifications
                  {verificationsCount > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {verificationsCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="metadata" className="whitespace-nowrap">
                  Metadata
                </TabsTrigger>
                <TabsTrigger value="raw" className="whitespace-nowrap">
                  Raw Data
                </TabsTrigger>
              </TabsList>
            </div>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-4">
              {/* File Information */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  File Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Filename:</span>
                    <p className="font-medium text-gray-900 truncate">
                      {itemDetails.originalFilename || itemDetails.filename}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">File Size:</span>
                    <p className="font-medium text-gray-900">
                      {formatFileSize(itemDetails.fileSize)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">MIME Type:</span>
                    <p className="font-medium text-gray-900">
                      {itemDetails.mimeType}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge
                      variant={
                        itemDetails.status === 'COMPLETED'
                          ? 'default'
                          : itemDetails.status === 'FAILED'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {itemDetails.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Uploaded:</span>
                    <p className="font-medium text-gray-900">
                      {formatDate(itemDetails.uploadedAt)}
                    </p>
                  </div>
                  {itemDetails.processingCompletedAt && (
                    <div>
                      <span className="text-gray-600">Completed:</span>
                      <p className="font-medium text-gray-900">
                        {formatDate(itemDetails.processingCompletedAt)}
                      </p>
                    </div>
                  )}
                  {itemDetails.mediaId && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Media ID:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-900 truncate">
                          {itemDetails.mediaId}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyMediaId(itemDetails.mediaId!)}
                          className="h-7 px-2"
                        >
                          {copiedMediaId ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Performance Metrics */}
              <PerformanceMetrics
                processingStartedAt={itemDetails.processingStartedAt}
                processingCompletedAt={itemDetails.processingCompletedAt}
                c2paMetrics={itemDetails.c2paFull?.metrics}
              />

              {/* Verification Status Summary */}
              {itemDetails.verifications && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Verification Status
                  </h3>
                  <VerificationBadges
                    verifications={itemDetails.verifications}
                    showLabels={true}
                  />
                </Card>
              )}

              {/* Verification Scores Summary */}
              {itemDetails.scores && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Verification Scores
                  </h3>
                  <VerificationScoresComponent scores={itemDetails.scores} />
                </Card>
              )}
            </TabsContent>

            {/* VERIFICATIONS TAB - New Dynamic System */}
            <TabsContent value="verifications" className="space-y-4">
              <AllVerificationsTab itemDetails={itemDetails} />
            </TabsContent>

            {/* METADATA TAB */}
            <TabsContent value="metadata" className="space-y-4">
              {itemDetails.metadata &&
              Object.keys(itemDetails.metadata).length > 0 ? (
                <>
                  {/* Extraction Information */}
                  {itemDetails.metadata.extractedAt && (
                    <Card className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Extraction Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Extracted At:</span>
                          <span className="font-medium">
                            {formatDate(itemDetails.metadata.extractedAt)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* General Information */}
                  {itemDetails.metadata.general && (
                    <Card className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        General Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        {itemDetails.metadata.general.mimeType && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">MIME Type:</span>
                            <span className="font-medium">
                              {itemDetails.metadata.general.mimeType}
                            </span>
                          </div>
                        )}
                        {itemDetails.metadata.general.format && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Format:</span>
                            <span className="font-medium uppercase">
                              {itemDetails.metadata.general.format}
                            </span>
                          </div>
                        )}
                        {itemDetails.metadata.general.size && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Size:</span>
                            <span className="font-medium">
                              {formatFileSize(itemDetails.metadata.general.size)}
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Image Information */}
                  {itemDetails.metadata.image && (
                    <Card className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Image Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        {itemDetails.metadata.image.width && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Width:</span>
                            <span className="font-medium">
                              {itemDetails.metadata.image.width} px
                            </span>
                          </div>
                        )}
                        {itemDetails.metadata.image.height && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Height:</span>
                            <span className="font-medium">
                              {itemDetails.metadata.image.height} px
                            </span>
                          </div>
                        )}
                        {itemDetails.metadata.image.width &&
                          itemDetails.metadata.image.height && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Dimensions:</span>
                              <span className="font-medium">
                                {itemDetails.metadata.image.width} ×{' '}
                                {itemDetails.metadata.image.height}
                              </span>
                            </div>
                          )}
                      </div>
                    </Card>
                  )}

                  {/* Metadata Analysis */}
                  {itemDetails.metadata.analysis && (
                    <Card className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Metadata Analysis
                      </h3>
                      <div className="space-y-3 text-sm">
                        {/* Scores */}
                        <div className="grid grid-cols-3 gap-3">
                          {itemDetails.metadata.analysis.integrityScore !==
                            undefined && (
                            <div>
                              <span className="text-gray-600 text-xs block mb-1">
                                Integrity Score
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500"
                                    style={{
                                      width: `${itemDetails.metadata.analysis.integrityScore * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="font-medium text-xs">
                                  {(
                                    itemDetails.metadata.analysis.integrityScore *
                                    100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                            </div>
                          )}
                          {itemDetails.metadata.analysis.completenessScore !==
                            undefined && (
                            <div>
                              <span className="text-gray-600 text-xs block mb-1">
                                Completeness
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500"
                                    style={{
                                      width: `${itemDetails.metadata.analysis.completenessScore * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="font-medium text-xs">
                                  {(
                                    itemDetails.metadata.analysis
                                      .completenessScore * 100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                            </div>
                          )}
                          {itemDetails.metadata.analysis.authenticityScore !==
                            undefined && (
                            <div>
                              <span className="text-gray-600 text-xs block mb-1">
                                Authenticity
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-purple-500"
                                    style={{
                                      width: `${itemDetails.metadata.analysis.authenticityScore * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="font-medium text-xs">
                                  {(
                                    itemDetails.metadata.analysis
                                      .authenticityScore * 100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Overall Confidence */}
                        {itemDetails.metadata.analysis.confidence !==
                          undefined && (
                          <div className="pt-2 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">
                                Analysis Confidence:
                              </span>
                              <span className="font-medium">
                                {(
                                  itemDetails.metadata.analysis.confidence * 100
                                ).toFixed(0)}
                                %
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Tampering Indicators */}
                        {(itemDetails.metadata.analysis.strippedMetadata !==
                          undefined ||
                          itemDetails.metadata.analysis.possibleTampering !==
                            undefined) && (
                          <div className="pt-2 border-t space-y-2">
                            <span className="text-gray-600 font-medium">
                              Tampering Indicators:
                            </span>
                            <div className="space-y-1">
                              {itemDetails.metadata.analysis.strippedMetadata && (
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                                  <span className="text-yellow-700 text-sm">
                                    Metadata has been stripped
                                  </span>
                                </div>
                              )}
                              {itemDetails.metadata.analysis.possibleTampering && (
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-orange-600" />
                                  <span className="text-orange-700 text-sm">
                                    Possible tampering detected
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Reasons */}
                        {itemDetails.metadata.analysis.reasons &&
                          itemDetails.metadata.analysis.reasons.length > 0 && (
                            <div className="pt-2 border-t">
                              <span className="text-gray-600 font-medium block mb-2">
                                Analysis Findings:
                              </span>
                              <ul className="space-y-1 list-disc list-inside">
                                {itemDetails.metadata.analysis.reasons.map(
                                  (reason: string, index: number) => (
                                    <li
                                      key={index}
                                      className="text-gray-700 text-sm"
                                    >
                                      {reason}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Missing Fields */}
                        {itemDetails.metadata.analysis.missingFields &&
                          itemDetails.metadata.analysis.missingFields.length >
                            0 && (
                            <div className="pt-2 border-t">
                              <span className="text-gray-600 font-medium block mb-2">
                                Missing Metadata Fields:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {itemDetails.metadata.analysis.missingFields.map(
                                  (field: string, index: number) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {field}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </Card>
                  )}

                  {/* Legacy camera/GPS metadata */}
                  {(itemDetails.metadata.cameraMake ||
                    itemDetails.metadata.cameraModel ||
                    itemDetails.metadata.datetimeOriginal ||
                    itemDetails.metadata.gps) && (
                    <Card className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Camera Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        {itemDetails.metadata.cameraMake && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Camera Make:</span>
                            <span className="font-medium">
                              {itemDetails.metadata.cameraMake}
                            </span>
                          </div>
                        )}
                        {itemDetails.metadata.cameraModel && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Camera Model:</span>
                            <span className="font-medium">
                              {itemDetails.metadata.cameraModel}
                            </span>
                          </div>
                        )}
                        {itemDetails.metadata.datetimeOriginal && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date Taken:</span>
                            <span className="font-medium">
                              {formatDate(itemDetails.metadata.datetimeOriginal)}
                            </span>
                          </div>
                        )}
                        {itemDetails.metadata.gps && (
                          <div>
                            <span className="text-gray-600">
                              GPS Coordinates:
                            </span>
                            <p className="font-medium text-gray-900">
                              {itemDetails.metadata.gps.lat.toFixed(6)},{' '}
                              {itemDetails.metadata.gps.lon.toFixed(6)}
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No metadata available
                </div>
              )}
            </TabsContent>

            {/* RAW DATA TAB */}
            <TabsContent value="raw" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Raw Item Data
                </h3>
                <div className="bg-gray-50 rounded p-3 max-h-96 overflow-y-auto overflow-x-hidden">
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words">
                    {JSON.stringify(itemDetails, null, 2)}
                  </pre>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
