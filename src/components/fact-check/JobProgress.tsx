"use client";

import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import type { JobStatus } from "@/types/fact-check";

interface JobProgressProps {
  status: JobStatus;
  progress: number;
  estimatedRemainingSeconds?: number;
  currentStep?: string;
}

export const JobProgress = ({
  status,
  progress,
  estimatedRemainingSeconds,
  currentStep,
}: JobProgressProps) => {
  const getStatusDisplay = () => {
    if (status === "processing") {
      return {
        icon: <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />,
        text: "Processing",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    } else if (status === "success") {
      return {
        icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
        text: "Completed",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    } else {
      return {
        icon: <Clock className="w-6 h-6 text-gray-400" />,
        text: "Failed",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    }
  };

  const statusDisplay = getStatusDisplay();

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div
      className={`p-6 border rounded-lg ${statusDisplay.bgColor} ${statusDisplay.borderColor}`}
    >
      <div className="flex items-center gap-4 mb-4">
        {statusDisplay.icon}
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${statusDisplay.color}`}>
            {statusDisplay.text}
          </h3>
          {currentStep && status === "processing" && (
            <p className="text-sm text-gray-600 mt-1">{currentStep}</p>
          )}
        </div>
        {estimatedRemainingSeconds !== undefined &&
          estimatedRemainingSeconds > 0 &&
          status === "processing" && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>~{formatTime(estimatedRemainingSeconds)} remaining</span>
            </div>
          )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 font-medium">Progress</span>
          <span className={`font-semibold ${statusDisplay.color}`}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              status === "success"
                ? "bg-green-600"
                : status === "failed"
                  ? "bg-red-600"
                  : "bg-blue-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
