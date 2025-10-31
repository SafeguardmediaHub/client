"use client";

import { ArrowLeft, Clock, Search, Database, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type TimelineVerificationState } from "@/hooks/useTimeline";
import ProgressBar from "./ProgressBar";
import StatusIndicator from "./StatusIndicator";

interface ProcessingStatusProps {
  verificationState: TimelineVerificationState;
  onBack?: () => void;
}

export default function ProcessingStatus({
  verificationState,
  onBack,
}: ProcessingStatusProps) {
  const { progress, currentStage, startedAt } = verificationState;

  // Define the stages of verification
  const stages = [
    {
      id: "metadata",
      label: "Extracting Metadata",
      icon: Database,
      description: "Analyzing file metadata and timestamps",
    },
    {
      id: "search",
      label: "Searching Engines",
      icon: Search,
      description: "Checking Google Images, Bing, TinEye, and Yandex",
    },
    {
      id: "analysis",
      label: "Analyzing Results",
      icon: BarChart3,
      description: "Processing matches and calculating scores",
    },
  ];

  // Determine current stage based on progress
  const getCurrentStageIndex = () => {
    if (progress < 30) return 0;
    if (progress < 70) return 1;
    return 2;
  };

  const currentStageIndex = getCurrentStageIndex();

  const formatElapsedTime = (startTime?: string) => {
    if (!startTime) return "";

    const elapsed = Date.now() - new Date(startTime).getTime();
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-semibold">Timeline Verification</h2>
      </div>

      {/* Overall Progress */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-blue-900">
              Verification in Progress
            </h3>
            <p className="text-blue-700">{currentStage}</p>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formatElapsedTime(startedAt)}</span>
          </div>
        </div>

        <ProgressBar progress={progress} />

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-blue-600">{progress}% complete</span>
          <span className="text-sm text-blue-600">
            Est. 2-3 minutes remaining
          </span>
        </div>
      </div>

      {/* Stage Progress */}
      <div>
        <h3 className="text-lg font-medium mb-4">Processing Stages</h3>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            let status: "pending" | "processing" | "completed";

            if (index < currentStageIndex) {
              status = "completed";
            } else if (index === currentStageIndex) {
              status = "processing";
            } else {
              status = "pending";
            }

            return (
              <StatusIndicator
                key={stage.id}
                icon={stage.icon}
                label={stage.label}
                description={stage.description}
                status={status}
              />
            );
          })}
        </div>
      </div>

      {/* Search Engines Status */}
      <div>
        <h3 className="text-lg font-medium mb-4">Search Engines</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Google Images", "Bing Visual", "TinEye", "Yandex"].map(
            (engine, index) => {
              // Simulate different completion states based on progress
              let engineStatus: "pending" | "processing" | "completed";
              const engineProgress = Math.max(0, progress - index * 15);

              if (engineProgress >= 30) {
                engineStatus = "completed";
              } else if (engineProgress > 0) {
                engineStatus = "processing";
              } else {
                engineStatus = "pending";
              }

              return (
                <div
                  key={engine}
                  className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                    engineStatus === "completed"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : engineStatus === "processing"
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {engineStatus === "completed" && (
                      <div className="w-3 h-3 bg-green-600 rounded-full" />
                    )}
                    {engineStatus === "processing" && (
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                    )}
                    {engineStatus === "pending" && (
                      <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{engine}</span>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 mb-2">What's Happening?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Extracting metadata from your media file</li>
          <li>• Searching across multiple image databases</li>
          <li>• Finding similar or identical content</li>
          <li>• Analyzing timestamps and sources</li>
          <li>• Calculating authenticity scores</li>
        </ul>
      </div>
    </div>
  );
}
