'use client';

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  FileSearch,
  Loader2,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  MediaInfoBlock,
  VerificationSteps,
} from '@/components/c2pa';
import MediaSelector from '@/components/media/MediaSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVerifyMedia, useVerificationStream } from '@/hooks/useC2PA';
import type { Media } from '@/hooks/useMedia';
import type { VerificationStreamUpdate } from '@/types/c2pa';

type VerificationState = 'idle' | 'selecting' | 'processing' | 'completed' | 'error';

export default function ManualVerificationPage() {
  const router = useRouter();
  const verifyMutation = useVerifyMedia();

  const [state, setState] = useState<VerificationState>('idle');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [streamUpdates, setStreamUpdates] = useState<VerificationStreamUpdate[]>([]);
  const [currentStep, setCurrentStep] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  // Stream hook
  const stream = useVerificationStream(verificationId || '', {
    enabled: state === 'processing' && !!verificationId,
    onUpdate: (update) => {
      setStreamUpdates((prev) => [...prev, update]);
      setCurrentStep(update.step);
    },
    onComplete: () => {
      setState('completed');
      toast.success('Verification completed!');
    },
    onError: () => {
      setState('error');
      setError('Connection to verification stream lost');
      toast.error('Verification failed');
    },
  });

  const handleMediaSelect = (media: Media) => {
    setSelectedMedia(media);
    setState('selecting');
  };

  const handleConfirmVerification = () => {
    if (selectedMedia) {
      setState('processing');
      setError(null);
      setStreamUpdates([]);
      handleStartVerification(selectedMedia.id);
    }
  };

  const handleStartVerification = async (mediaId: string) => {
    setState('processing');
    setError(null);

    try {
      const result = await verifyMutation.mutateAsync({ mediaId });
      setVerificationId(result.data.verificationId);

      // Check if verification already existed
      const isAlreadyVerified = 'alreadyVerified' in result.data && result.data.alreadyVerified;

      if (isAlreadyVerified || result.data.status !== 'processing') {
        // Already completed or existing verification found
        setState('completed');

        if (isAlreadyVerified) {
          toast.info('This media was already verified. Showing existing results.');
        }

        // Navigate to details page
        setTimeout(() => {
          router.push(`/dashboard/authenticity/${result.data.verificationId}`);
        }, 1000);
      } else {
        // New verification started, wait for stream updates
        toast.info('Verification started. Processing...');
      }
    } catch (err) {
      setState('error');
      setError('Failed to start verification. Please try again.');
      toast.error('Verification failed to start');
      console.error('Verification error:', err);
    }
  };

  const handleReset = () => {
    setState('idle');
    setVerificationId(null);
    setStreamUpdates([]);
    setCurrentStep(undefined);
    setError(null);
    setSelectedMedia(null);
    stream.disconnect();
  };

  const handleBack = () => {
    setSelectedMedia(null);
    setState('idle');
    setError(null);
  };

  const handleViewDetails = () => {
    if (verificationId) {
      router.push(`/dashboard/authenticity/${verificationId}`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/authenticity')}
        >
          <ArrowLeft className="size-4 mr-1" />
          Back
        </Button>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-blue-50 mb-4">
            <ShieldCheck className="size-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Verify Media Authenticity
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Select media from your library to verify its C2PA content credentials
          </p>
        </div>

        {/* Main content */}
        {state === 'idle' && (
          <Card className="animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle className="text-lg">Select Media to Verify</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Media selector dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose from your library
                </label>
                <MediaSelector onSelect={handleMediaSelect} />
              </div>

              {/* How it works */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="size-4" />
                  How verification works
                </h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Select media from your library</li>
                  <li>We scan for C2PA content credentials</li>
                  <li>Certificate chain is validated for authenticity</li>
                  <li>Content integrity is verified against manifest</li>
                  <li>View detailed results and download reports</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {state === 'selecting' && selectedMedia && (
          <Card className="animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Confirm Verification</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-gray-500"
                >
                  <X className="size-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected media preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <MediaInfoBlock
                  fileName={selectedMedia.filename}
                  fileSize={Number.parseInt(selectedMedia.fileSize)}
                  mediaType={selectedMedia.mimeType.startsWith('image') ? 'image' :
                            selectedMedia.mimeType.startsWith('video') ? 'video' :
                            selectedMedia.mimeType.startsWith('audio') ? 'audio' : 'document'}
                  thumbnailUrl={selectedMedia.thumbnailUrl}
                  size="lg"
                />
              </div>

              {/* Confirmation */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  This will verify the C2PA content credentials for the selected media.
                  The verification process may take up to 30 seconds.
                </p>
                <Button
                  onClick={handleConfirmVerification}
                  className="w-full"
                  disabled={verifyMutation.isPending}
                >
                  <ShieldCheck className="size-4 mr-2" />
                  Start Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {state === 'processing' && selectedMedia && (
          <Card className="animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin text-blue-600" />
                  Verifying...
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-gray-500"
                >
                  <X className="size-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Media info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <MediaInfoBlock
                  fileName={selectedMedia.filename}
                  fileSize={Number.parseInt(selectedMedia.fileSize)}
                  mediaType={selectedMedia.mimeType.startsWith('image') ? 'image' :
                            selectedMedia.mimeType.startsWith('video') ? 'video' :
                            selectedMedia.mimeType.startsWith('audio') ? 'audio' : 'document'}
                  thumbnailUrl={selectedMedia.thumbnailUrl}
                  size="sm"
                />
              </div>

              {/* Progress steps */}
              <div className="py-4">
                <VerificationSteps
                  updates={streamUpdates}
                  currentStep={currentStep}
                />
                {stream.isConnected && (
                  <p className="text-xs text-blue-600 mt-4 flex items-center gap-2">
                    <span className="relative flex size-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex rounded-full size-2 bg-blue-500" />
                    </span>
                    Connected to live updates
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {state === 'completed' && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 border-emerald-200 bg-emerald-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
                <CheckCircle className="size-5 text-emerald-600" />
                Verification Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-emerald-700">
                Your media has been verified. View the full details to see the complete analysis.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleViewDetails} className="flex-1">
                  <FileSearch className="size-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Verify Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {state === 'error' && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                <AlertCircle className="size-5 text-red-600" />
                Verification Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-red-700">
                {error || 'An unexpected error occurred during verification.'}
              </p>
              <div className="flex gap-3">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard/authenticity')}
                >
                  Back to Overview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
