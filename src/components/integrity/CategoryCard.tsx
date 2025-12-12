import { AlertCircle, CheckCircle, Info, Minus, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/types/integrity";

interface CategoryCardProps {
	category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
	const statusConfig = {
		pass: {
			icon: CheckCircle,
			className: "bg-green-50 border-green-200 text-green-700",
		},
		warning: {
			icon: AlertCircle,
			className: "bg-yellow-50 border-yellow-200 text-yellow-700",
		},
		alert: {
			icon: AlertCircle,
			className: "bg-orange-50 border-orange-200 text-orange-700",
		},
		fail: {
			icon: XCircle,
			className: "bg-red-50 border-red-200 text-red-700",
		},
		info: {
			icon: Info,
			className: "bg-blue-50 border-blue-200 text-blue-700",
		},
		not_available: {
			icon: Minus,
			className: "bg-gray-50 border-gray-200 text-gray-500",
		},
		pending: {
			icon: Info,
			className: "bg-gray-50 border-gray-200 text-gray-500",
		},
	};

	const { icon: Icon, className } = statusConfig[category.status];

	return (
		<Card className={`border ${className.split("text-")[0]}`}>
			<CardContent className="p-4">
				<div className="flex items-start justify-between mb-2">
					<div className="flex items-center gap-2">
						<Icon className="size-5" />
						<h4 className="font-semibold">{category.name}</h4>
					</div>
					{category.score !== null && (
						<span className="text-sm font-medium">{category.score}/100</span>
					)}
				</div>
				<div className="text-sm">
					{category.findings.length} finding
					{category.findings.length !== 1 ? "s" : ""}
				</div>
			</CardContent>
		</Card>
	);
};
