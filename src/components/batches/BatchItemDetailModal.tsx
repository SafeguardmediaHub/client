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
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">
              {getFileIcon(itemDetails?.mimeType || '')}
            </span>
            <span className="truncate">{filename}</span>
          </DialogTitle>
          <DialogDescription>
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
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="verifications">
                Verifications
                {verificationsCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {verificationsCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>

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
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    File Metadata
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
                        <span className="text-gray-600">GPS Coordinates:</span>
                        <p className="font-medium text-gray-900">
                          {itemDetails.metadata.gps.lat.toFixed(6)},{' '}
                          {itemDetails.metadata.gps.lon.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
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
                <div className="bg-gray-50 rounded p-3 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-gray-800">
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
