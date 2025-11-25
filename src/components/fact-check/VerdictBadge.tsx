import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  MinusCircle,
  XCircle,
} from "lucide-react";

interface VerdictBadgeProps {
  status:
    | "verified_true"
    | "verified_false"
    | "mixed"
    | "inconclusive"
    | "no_verdict";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const VerdictBadge = ({
  status,
  size = "md",
  showIcon = true,
}: VerdictBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "verified_true":
        return {
          label: "Verified True",
          icon: CheckCircle2,
          color: "text-green-700",
          bgColor: "bg-green-100",
          borderColor: "border-green-300",
        };
      case "verified_false":
        return {
          label: "Verified False",
          icon: XCircle,
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
        };
      case "mixed":
        return {
          label: "Mixed Verdicts",
          icon: AlertCircle,
          color: "text-yellow-700",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-300",
        };
      case "inconclusive":
        return {
          label: "Inconclusive",
          icon: MinusCircle,
          color: "text-gray-700",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-300",
        };
      case "no_verdict":
        return {
          label: "No Verdict Found",
          icon: HelpCircle,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
      default:
        return {
          label: "Unknown",
          icon: HelpCircle,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full font-semibold border ${sizeClasses[size]} ${config.color} ${config.bgColor} ${config.borderColor}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </div>
  );
};
