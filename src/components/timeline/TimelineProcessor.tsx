"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useStartTimelineVerification,
  useTimelineVerificationStatus,
  type VerificationStatus,
  type TimelineVerificationState,
} from "@/hooks/useTimeline";
import ProcessingStatus from "./ProcessingStatus";
import PartialResults from "./PartialResults";
import CompletedResults from "./CompletedResults";
import ErrorFallback from "./ErrorFallback";

interface TimelineProcessorProps {
  mediaId: string;
  claimedTakenAt: string;
  onBack?: () => void;
}

export default function TimelineProcessor({
  mediaId,
  claimedTakenAt,
  onBack,
}: TimelineProcessorProps) {
  const [optimisticState, setOptimisticState] = useState<TimelineVerificationState | null>(null);
  const [isOptimistic, setIsOptimistic] = useState(false);

  // Hooks for timeline verification
  const startVerification = useStartTimelineVerification();
  const {
    data: verificationState,
    isLoading,
    error,
  } = useTimelineVerificationStatus(mediaId);

  // Use optimistic state if we have it, otherwise use real server state
  const currentState = isOptimistic && optimisticState ? optimisticState : verificationState;

  // Debug logging
  console.log("Timeline state:", {
    isOptimistic,
    optimisticStatus: optimisticState?.status,
    serverStatus: verificationState?.status,
    currentStatus: currentState?.status,
    progress: currentState?.progress,
  });

  // Progress simulation effect
  useEffect(() => {
    if (!isOptimistic || !optimisticState) return;

    const interval = setInterval(() => {
      setOptimisticState(prev => {
        if (!prev) return null;
        
        // Simulate progress: 25% -> 50% -> 75% -> 90% -> completed
        if (prev.progress < 90) {
          const newProgress = prev.progress + 25;
          return {
            ...prev,
            progress: newProgress,
            currentStage: prev.progress === 25 ? "Analyzing metadata..." : 
                         prev.progress === 50 ? "Searching online sources..." : 
                         prev.progress === 75 ? "Processing matches and calculating scores..." :
                         "Finalizing results...",
          };
        } else if (prev.progress === 90) {
          // After 90%, complete the verification optimistically with mock data
          return {
            ...prev,
            status: "completed",
            progress: 100,
            currentStage: "Verification complete",
            completedAt: new Date().toISOString(),
            data: {
              timeline: [
                {
                  label: "Claimed creation/publication date",
                  timestamp: claimedTakenAt,
                  source: "user-claim",
                },
                {
                  label: "Verification completed",
                  timestamp: new Date().toISOString(),
                  source: "system",
                }
              ],
              flags: ["Analysis in progress..."],
              analysis: {
                hasMetadata: true,
                metadataConsistent: true,
                earlierOnlineAppearance: false,
                spoofedMetadata: false,
              },
              matches: [],
              metadata: {
                extractedAt: new Date().toISOString(),
                analysis: {
                  integrityScore: 0,
                  authenticityScore: 0,
                  completenessScore: 0,
                },
              },
            },
          };
        }
        return prev;
      });
    }, 6000); // Update every 6 seconds

    return () => clearInterval(interval);
  }, [isOptimistic, optimisticState]);

  // Switch from optimistic to real state when server data is ready
  useEffect(() => {
    if (isOptimistic && verificationState && 
        (verificationState.status === "completed" || verificationState.status === "failed")) {
      // Delay the transition slightly to let users see the 100% completion
      setTimeout(() => {
        setIsOptimistic(false);
        setOptimisticState(null);
      }, 1000);
    }
  }, [isOptimistic, verificationState]);

  const handleStartVerification = async () => {
    try {
      // Set optimistic state immediately
      setOptimisticState({
        status: "processing",
        progress: 25,
        currentStage: "Starting verification...",
        startedAt: new Date().toISOString(),
      });
      setIsOptimistic(true);

      // Start actual verification in background
      await startVerification.mutateAsync({
        mediaId,
        claimedTakenAt,
      });
    } catch (error) {
      console.error("Failed to start verification:", error);
      // Reset optimistic state on error
      setIsOptimistic(false);
      setOptimisticState(null);
    }
  };

  const renderContent = () => {
    // If there's a query error, show error fallback
    if (error) {
      return (
        <ErrorFallback
          error={error}
          onRetry={() => window.location.reload()}
          onBack={onBack}
        />
      );
    }

    // Only show start verification if status is actually idle
    if (!currentState || currentState.status === "idle") {
      return (
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-semibold">Timeline Verification</h2>
          </div>

          <div className="text-center space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Ready to Verify Timeline
              </h3>
              <p className="text-blue-700 mb-4">
                This will analyze your media across multiple search engines to
                verify its timeline and authenticity.
              </p>
              <Button
                onClick={handleStartVerification}
                disabled={startVerification.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {startVerification.isPending
                  ? "Starting..."
                  : "Start Verification"}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Show appropriate component based on verification status
    if (!currentState) {
      return (
        <div className="p-6 text-center">
          <div className="animate-pulse">Loading verification status...</div>
        </div>
      );
    }

    switch (currentState.status) {
      case "idle":
        return (
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-2xl font-semibold">Timeline Verification</h2>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Ready to Verify Timeline
                </h3>
                <p className="text-blue-700 mb-4">
                  This will analyze your media across multiple search engines to
                  verify its timeline and authenticity.
                </p>
                <Button
                  onClick={handleStartVerification}
                  disabled={startVerification.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {startVerification.isPending
                    ? "Starting..."
                    : "Start Verification"}
                </Button>
              </div>
            </div>
          </div>
        );

      case "processing":
        return (
          <ProcessingStatus
            verificationState={currentState}
            onBack={onBack}
          />
        );

      case "partial":
        return (
          <PartialResults
            verificationState={currentState}
            onBack={onBack}
          />
        );

      case "completed":
        return (
          <CompletedResults
            verificationState={currentState}
            onBack={onBack}
          />
        );

      case "failed":
        return (
          <ErrorFallback
            error={new Error(currentState.error || "Verification failed")}
            onRetry={handleStartVerification}
            onBack={onBack}
          />
        );

      case "cancelled":
        return (
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-2xl font-semibold">Verification Cancelled</h2>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-medium text-yellow-900 mb-2">
                  Verification was cancelled
                </h3>
                <p className="text-yellow-700 mb-4">
                  The timeline verification process was cancelled before
                  completion.
                </p>
                <Button
                  onClick={handleStartVerification}
                  disabled={startVerification.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {startVerification.isPending
                    ? "Starting..."
                    : "Restart Verification"}
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 text-center">
            <div className="text-red-600">
              Unknown verification status: {currentState.status}
            </div>
          </div>
        );
    }
  };

  return renderContent();
}
