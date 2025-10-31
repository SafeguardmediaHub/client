"use client";

import { Check, Clock, type LucideIcon } from "lucide-react";

interface StatusIndicatorProps {
  icon: LucideIcon;
  label: string;
  description: string;
  status: "pending" | "processing" | "completed";
}

export default function StatusIndicator({
  icon: Icon,
  label,
  description,
  status,
}: StatusIndicatorProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "completed":
        return {
          container: "bg-green-50 border-green-200",
          icon: "text-green-600 bg-green-100",
          text: "text-green-900",
          description: "text-green-700",
        };
      case "processing":
        return {
          container: "bg-blue-50 border-blue-200",
          icon: "text-blue-600 bg-blue-100",
          text: "text-blue-900",
          description: "text-blue-700",
        };
      case "pending":
        return {
          container: "bg-gray-50 border-gray-200",
          icon: "text-gray-400 bg-gray-100",
          text: "text-gray-600",
          description: "text-gray-500",
        };
    }
  };

  const styles = getStatusStyles();

  const StatusIcon = () => {
    switch (status) {
      case "completed":
        return <Check className="w-5 h-5" />;
      case "processing":
        return <Clock className="w-5 h-5 animate-pulse" />;
      case "pending":
        return <Icon className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${styles.container}`}
    >
      <div className={`p-2 rounded-full ${styles.icon}`}>
        <StatusIcon />
      </div>

      <div className="flex-1">
        <h4 className={`font-medium ${styles.text}`}>{label}</h4>
        <p className={`text-sm ${styles.description}`}>{description}</p>
      </div>

      {status === "processing" && (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      )}
    </div>
  );
}
