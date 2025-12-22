"use client";

import {
  AlertTriangle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { IntegrityVerdict } from "@/types/batch";

interface IntegrityScoreBadgeProps {
  score: number;
  compact?: boolean;
}

interface VerdictBadgeProps {
  verdict: IntegrityVerdict;
  showIcon?: boolean;
}

const VERDICT_CONFIG = {
  authentic: {
    icon: ShieldCheck,
    label: "Authentic",
    variant: "default" as const,
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  likely_authentic: {
    icon: ShieldCheck,
    label: "Likely Authentic",
    variant: "secondary" as const,
    className: "bg-lime-100 text-lime-700 hover:bg-lime-100",
  },
  suspicious: {
    icon: ShieldAlert,
    label: "Suspicious",
    variant: "outline" as const,
    className: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-300",
  },
  likely_manipulated: {
    icon: AlertTriangle,
    label: "Likely Manipulated",
    variant: "destructive" as const,
    className: "bg-orange-200 text-orange-900 hover:bg-orange-200",
  },
  manipulated: {
    icon: ShieldX,
    label: "Manipulated",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
};

const getScoreColor = (score: number): string => {
  if (score >= 85) return "text-green-600";
  if (score >= 60) return "text-lime-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
};

const getScoreIcon = (score: number) => {
  if (score >= 85) return "🟢";
  if (score >= 60) return "🟡";
  if (score >= 40) return "🟠";
  return "🔴";
};

export function IntegrityScoreBadge({
  score,
  compact = false,
}: IntegrityScoreBadgeProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs">{getScoreIcon(score)}</span>
        <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
          {Math.round(score)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`text-lg font-bold ${getScoreColor(score)}`}>
        {Math.round(score)}
      </span>
      <div className="w-16 h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            score >= 85
              ? "bg-green-500"
              : score >= 60
                ? "bg-lime-500"
                : score >= 40
                  ? "bg-orange-500"
                  : "bg-red-500"
          } transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function VerdictBadge({ verdict, showIcon = true }: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
}

interface IntegrityDisplayProps {
  score?: number;
  verdict?: IntegrityVerdict;
  compact?: boolean;
}

export function IntegrityDisplay({
  score,
  verdict,
  compact = false,
}: IntegrityDisplayProps) {
  if (!score && !verdict) {
    return (
      <span className="text-xs text-gray-400">
        No integrity data
      </span>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {score !== undefined && <IntegrityScoreBadge score={score} compact />}
        {verdict && <VerdictBadge verdict={verdict} showIcon={false} />}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {score !== undefined && (
        <div>
          <span className="text-xs text-gray-600 font-medium">
            Integrity Score:
          </span>
          <div className="mt-1">
            <IntegrityScoreBadge score={score} />
          </div>
        </div>
      )}
      {verdict && (
        <div>
          <span className="text-xs text-gray-600 font-medium">Verdict:</span>
          <div className="mt-1">
            <VerdictBadge verdict={verdict} />
          </div>
        </div>
      )}
    </div>
  );
}
