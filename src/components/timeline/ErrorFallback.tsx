"use client";

import { ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error: Error | any;
  onRetry?: () => void;
  onBack?: () => void;
}

export default function ErrorFallback({
  error,
  onRetry,
  onBack,
}: ErrorFallbackProps) {
  const getErrorMessage = () => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return "An unexpected error occurred during verification";
  };

  const getErrorCode = () => {
    if (error?.response?.status) {
      return `Error ${error.response.status}`;
    }
    return "Verification Error";
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-semibold">Verification Failed</h2>
      </div>

      {/* Error Display */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-red-900 mb-2">
              {getErrorCode()}
            </h3>
            <p className="text-red-700 mb-4">{getErrorMessage()}</p>

            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="font-medium text-gray-900 mb-3">Troubleshooting</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Check your internet connection and try again</li>
          <li>• Ensure the media file is accessible and not corrupted</li>
          <li>• The file may be too large or in an unsupported format</li>
          <li>• Our servers may be experiencing high traffic</li>
          <li>• Contact support if the problem persists</li>
        </ul>
      </div>

      {/* Technical Details */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-2">
            Technical Details (Dev Only)
          </h4>
          <pre className="text-xs text-gray-700 overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
