"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, CheckCircle, MinusCircle } from "lucide-react";

interface ConfidencePillProps {
  confidence: number;
  sourceCount?: number;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ConfidencePill({ 
  confidence, 
  sourceCount, 
  showPercentage = false,
  size = "md" 
}: ConfidencePillProps) {
  const getConfidenceData = (score: number) => {
    if (score >= 70) {
      return {
        label: "High Confidence",
        color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
        icon: CheckCircle,
        iconColor: "text-emerald-600 dark:text-emerald-400",
        explanation: "Strong agreement across verified sources"
      };
    } else if (score >= 40) {
      return {
        label: "Mixed Evidence",
        color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
        icon: MinusCircle,
        iconColor: "text-amber-600 dark:text-amber-400",
        explanation: "Conflicting information found across sources"
      };
    } else {
      return {
        label: "Low Confidence",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900/50",
        icon: AlertTriangle,
        iconColor: "text-red-600 dark:text-red-400",
        explanation: "Limited or contradictory evidence"
      };
    }
  };

  const data = getConfidenceData(confidence);
  const Icon = data.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-semibold border ${data.color} cursor-help`}>
            <Icon className={`${iconSizes[size]} ${data.iconColor}`} />
            <span>{data.label}</span>
            {showPercentage && (
              <>
                <span className="opacity-50">•</span>
                <span>{confidence}%</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{confidence}% Confidence Score</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{data.explanation}</p>
            {sourceCount && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Based on {sourceCount} source{sourceCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
