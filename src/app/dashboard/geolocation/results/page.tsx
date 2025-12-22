/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import GeolocationMap from '@/components/maps/GeolocationMap';
import { Button } from '@/components/ui/button';
import { useGeoVerificationResult } from '@/hooks/useGeolocation';

const GeolocationResultContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationId = searchParams.get('verificationId');

  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

  const {
    data: verificationData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGeoVerificationResult(verificationId || '', {
    enabled: !!verificationId,
  });

  const verificationStatus = verificationData?.data?.verification?.status;

  useEffect(() => {
    if (verificationData) {
      setLastRefreshTime(new Date());
    }
  }, [verificationData]);

  useEffect(() => {
    if (
      verificationStatus === 'completed' ||
      verificationStatus === 'partial'
    ) {
      toast.success('Geolocation verification completed successfully!');
    } else if (verificationStatus === 'failed') {
      toast.error('Geolocation verification failed');
    }
  }, [verificationStatus]);

  const handleManualRefresh = () => {
    refetch();
    toast.info('Refreshing verification status...');
  };

  const handleBackToVerification = () => {
    router.push('/dashboard/geolocation');
  };

  if (isError) {
    const errorStatus = (error as any)?.response?.status;

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {errorStatus === 404
                ? 'Verification Not Found'
                : 'Error Loading Verification'}
            </h2>
            <p className="text-sm text-gray-600">
              {errorStatus === 404
                ? 'The requested verification could not be found. It may have been deleted or the link is invalid.'
                : 'An error occurred while loading the verification. Please try again.'}
            </p>
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={handleManualRefresh}
                className="cursor-pointer"
              >
                Try Again
              </Button>
              <Button
                onClick={handleBackToVerification}
                className="cursor-pointer"
              >
                Back to Verification
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!verificationId) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Missing Verification ID
            </h2>
            <p className="text-sm text-gray-600">
              No verification ID was provided. Please start a new verification.
            </p>
            <Button
              onClick={handleBackToVerification}
              className="mt-4 cursor-pointer"
            >
              Start New Verification
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900">
              Loading Verification
            </h2>
            <p className="text-sm text-gray-600">
              Please wait while we fetch your verification details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'queued' || verificationStatus === 'processing') {
    const estimatedTime = verificationData?.data
      ? (verificationData as any).data.estimatedTime
      : null;

    return (
      <div className="w-full flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Geolocation Verification
                </h1>
                <p className="text-sm text-gray-600">
                  Verification ID: {verificationId}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToVerification}
                className="cursor-pointer"
              >
                Back
              </Button>
            </div>
          </div>

          {/* Processing Status Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="w-10 h-10 text-blue-600" />
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {verificationStatus === 'queued'
                    ? 'Verification Queued'
                    : 'Processing Verification'}
                </h2>
                <p className="text-gray-600">
                  {verificationStatus === 'queued'
                    ? 'Your verification is in the queue and will start processing shortly.'
                    : 'Your geolocation verification is currently being processed.'}
                </p>
              </div>

              {estimatedTime && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Estimated time: </span>~
                    {estimatedTime} seconds remaining
                  </p>
                </div>
              )}

              {/* Auto-refresh indicator */}
              <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <RefreshCw
                    className={`w-4 h-4 ${
                      isFetching ? 'animate-spin text-blue-600' : ''
                    }`}
                  />
                  <span>
                    {isFetching
                      ? 'Checking status...'
                      : 'Auto-refreshing every 10 seconds'}
                  </span>
                </div>
                <p className="text-xs">
                  Last updated: {lastRefreshTime.toLocaleTimeString()}
                </p>
              </div>

              {/* Manual refresh button */}
              <Button
                variant="outline"
                onClick={handleManualRefresh}
                disabled={isFetching}
                className="cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`}
                />
                {isFetching ? 'Refreshing...' : 'Refresh Now'}
              </Button>
            </div>
          </div>

          {/* Info box */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              You can safely navigate away from this page. The verification will
              continue processing in the background.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'failed') {
    return (
      <div className="w-full flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Geolocation Verification
                </h1>
                <p className="text-sm text-gray-600">
                  Verification ID: {verificationId}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToVerification}
                className="cursor-pointer"
              >
                Back
              </Button>
            </div>
          </div>

          {/* Failed Status Card */}
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-600">
                  An error occurred during the verification process. Please try
                  again or contact support if the issue persists.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleBackToVerification}
                  className="cursor-pointer"
                >
                  Start New Verification
                </Button>
                <Button
                  onClick={handleManualRefresh}
                  className="cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    (verificationStatus === 'completed' || verificationStatus === 'partial') &&
    verificationData?.data
  ) {
    const result = verificationData.data;

    return (
      <div className="w-full flex flex-col gap-6 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-8xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Geolocation Verification Results
                </h1>
                <p className="text-sm text-gray-600">
                  Verification completed at{' '}
                  {new Date(result.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  className="cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToVerification}
                  className="cursor-pointer"
                >
                  Back
                </Button>
              </div>
            </div>
          </div>

          {/* Success Banner and Map - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Interactive Map - 2/3 width */}
            {result.mapData && (
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Interactive Map
                </h3>
                <GeolocationMap mapData={result.mapData} />
              </div>
            )}
            {/* Success Banner - 1/3 width */}
            <div
              className={`rounded-lg p-6 ${
                result.verification.match
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-8">
                {result.verification.match
                  ? 'Location Verified'
                  : 'Location Mismatch'}
              </h2>
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="55"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="55"
                      fill="none"
                      stroke={result.verification.match ? '#16a34a' : '#ca8a04'}
                      strokeWidth="8"
                      strokeDasharray={`${
                        result.verification.confidence * 3.456
                      } 345.6`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <div
                      className={`text-4xl font-bold ${
                        result.verification.match
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {result.verification.confidence}%
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center">
                  <span className="text-gray-600 text-sm">
                    Confidence level:{' '}
                  </span>
                  <span
                    className={`font-bold ${
                      result.verification.confidence >= 80
                        ? 'text-green-600'
                        : result.verification.confidence >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {result.verification.confidence >= 80
                      ? 'High'
                      : result.verification.confidence >= 60
                      ? 'Medium'
                      : 'Low'}
                  </span>
                </p>
                <p className="text-gray-600 text-sm mt-2 text-center px-4">
                  {result.verification.confidenceExplanation.summary}
                </p>
              </div>
            </div>

            {/* <div>
            <h2 className="text-lg font-bold text-gray-900 mb-8">Location Verified</h2>
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="55"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="55"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="8"
                    strokeDasharray={`${data.confidencePercentage * 3.456} 345.6`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-4xl font-bold text-green-600">
                    {data.confidencePercentage}%
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center">
                <span className="text-gray-600 text-sm">Confidence level: </span>
                <span className={`font-bold ${getConfidenceColor(data.confidenceLevel)}`}>
                  {data.confidenceLevel}
                </span>
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Distance from claimed location: {data.distanceFromClaimed}
              </p>
            </div>
          </div> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              {/* Media Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Media Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">File Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {result.mediaId.originalFilename}
                    </p>
                  </div>
                  {/* {result.mediaId.humanFileSize && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">File Size</p>
                      <p className="text-sm text-gray-900">
                        {result.mediaId.humanFileSize}
                      </p>
                    </div>
                  )} */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">File Type</p>
                    <p className="text-sm text-gray-900">
                      {result.mediaId.fileExtension.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Claimed Location */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Claimed Location
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Input</p>
                    <p className="text-sm font-medium text-gray-900">
                      {result.claimedLocation.raw}
                    </p>
                  </div>
                  {result.claimedLocation.parsed && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Region</p>
                        <p className="text-sm text-gray-900">
                          {result.claimedLocation.parsed.region}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Country</p>
                        <p className="text-sm text-gray-900">
                          {result.claimedLocation.parsed.country}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Coordinates
                        </p>
                        <p className="text-sm text-gray-900 font-mono">
                          {result.claimedLocation.parsed.coordinates.lat.toFixed(
                            6
                          )}
                          ,{' '}
                          {result.claimedLocation.parsed.coordinates.lng.toFixed(
                            6
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Verification Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Verification Analysis
                </h3>
                <div className="space-y-4">
                  {/* Confidence Reasons */}
                  {result.verification.confidenceExplanation.reasons.length >
                    0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Analysis</p>
                      <ul className="space-y-2">
                        {result.verification.confidenceExplanation.reasons.map(
                          (reason) => (
                            <li
                              key={reason}
                              className="text-sm text-gray-700 flex items-start gap-2"
                            >
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{reason}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Missing Data */}
                  {(result.verification.confidenceExplanation.missingData
                    .gpsCoordinates ||
                    result.verification.confidenceExplanation.missingData
                      .geocodedLocation) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-xs font-medium text-yellow-900 mb-2">
                        Missing Data
                      </p>
                      <ul className="space-y-1">
                        {result.verification.confidenceExplanation.missingData
                          .gpsCoordinates && (
                          <li className="text-sm text-yellow-800">
                            • GPS coordinates not found in metadata
                          </li>
                        )}
                        {result.verification.confidenceExplanation.missingData
                          .geocodedLocation && (
                          <li className="text-sm text-yellow-800">
                            • Geocoded location unavailable
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Discrepancies */}
                  {result.verification.discrepancies.addressMismatch && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-xs font-medium text-red-900 mb-1">
                        Discrepancy Detected
                      </p>
                      <p className="text-sm text-red-800">
                        Address mismatch found between claimed and actual
                        location
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Processing Metadata */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Processing Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Processing Time
                    </p>
                    <p className="text-sm text-gray-900">
                      {result.processingTime}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Verification ID
                    </p>
                    <p className="text-sm text-gray-900 font-mono break-all">
                      {result._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={handleBackToVerification}
              className="cursor-pointer"
            >
              New Verification
            </Button>
            <Button className="cursor-pointer">Download Report</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center text-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900">
            Loading Results
          </h2>
          <p className="text-sm text-gray-600">
            Please wait while we load the verification results...
          </p>
        </div>
      </div>
    </div>
  );
};

const GeolocationResultPage = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 min-h-screen">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center text-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900">
                Loading Results
              </h2>
              <p className="text-sm text-gray-600">
                Please wait while we load the verification results...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <GeolocationResultContent />
    </Suspense>
  );
};

export default GeolocationResultPage;
