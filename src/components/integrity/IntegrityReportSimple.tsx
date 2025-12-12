"use client";

import { AlertCircle, ChevronRight } from "lucide-react";
import { VerdictBadge } from "./VerdictBadge";
import { CategoryCard } from "./CategoryCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IntegrityReport } from "@/types/integrity";

interface IntegrityReportSimpleProps {
	report: IntegrityReport;
	onViewFull?: () => void;
}

export const IntegrityReportSimple = ({
	report,
	onViewFull,
}: IntegrityReportSimpleProps) => {
	return (
		<div className="space-y-6">
			{/* Verdict */}
			<div className="text-center">
				<VerdictBadge
					verdict={report.verdict.status}
					confidence={report.verdict.confidence}
					size="lg"
				/>
				<p className="mt-4 text-gray-600">{report.verdict.summary}</p>
			</div>

			{/* Categories Grid */}
			{report.categories && report.categories.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{report.categories.map((category, i) => (
						<CategoryCard key={i} category={category} />
					))}
				</div>
			)}

			{/* Flags */}
			{report.flags && report.flags.length > 0 && (
				<Card className="border-amber-200 bg-amber-50/50">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2 text-amber-800">
							<AlertCircle className="size-5" />
							Concerns Detected
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{report.flags.map((flag, i) => (
								<li
									key={i}
									className="text-sm text-amber-800 flex items-start gap-2"
								>
									<span className="text-amber-600">•</span>
									{flag}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}

			{/* Recommendations */}
			{report.recommendations && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Recommendation</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">{report.recommendations}</p>
					</CardContent>
				</Card>
			)}

			{/* View Full Report Button */}
			{onViewFull && (
				<Button onClick={onViewFull} className="w-full" variant="outline">
					View Full Detailed Report
					<ChevronRight className="size-4 ml-2" />
				</Button>
			)}
		</div>
	);
};
