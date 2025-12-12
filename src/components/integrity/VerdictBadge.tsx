import { AlertTriangle, ShieldCheck, XCircle } from "lucide-react";
import type { VerdictStatus } from "@/types/integrity";

interface VerdictBadgeProps {
	verdict: VerdictStatus;
	confidence: number;
	size?: "sm" | "md" | "lg";
	showConfidence?: boolean;
}

export const VerdictBadge = ({
	verdict,
	confidence,
	size = "md",
	showConfidence = true,
}: VerdictBadgeProps) => {
	const config = {
		authentic: {
			label: "Authentic",
			icon: ShieldCheck,
			className: "bg-green-50 border-green-200 text-green-700",
		},
		likely_authentic: {
			label: "Likely Authentic",
			icon: ShieldCheck,
			className: "bg-green-50/70 border-green-200 text-green-600",
		},
		suspicious: {
			label: "Suspicious",
			icon: AlertTriangle,
			className: "bg-yellow-50 border-yellow-200 text-yellow-700",
		},
		likely_manipulated: {
			label: "Likely Manipulated",
			icon: XCircle,
			className: "bg-orange-50 border-orange-200 text-orange-700",
		},
		manipulated: {
			label: "Manipulated",
			icon: XCircle,
			className: "bg-red-50 border-red-200 text-red-700",
		},
	};

	const { label, icon: Icon, className } = config[verdict] || config.suspicious;

	return (
		<div
			className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${className}`}
		>
			<Icon className="size-5" />
			<div>
				<div className="font-semibold">{label}</div>
				{showConfidence && (
					<div className="text-xs opacity-80">{confidence}% confidence</div>
				)}
			</div>
		</div>
	);
};
