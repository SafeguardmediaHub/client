"use client";

import { useState } from "react";
import { VerdictBadge } from "./VerdictBadge";
import { CategoryCard } from "./CategoryCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IntegrityReport } from "@/types/integrity";

interface IntegrityReportFullProps {
	report: IntegrityReport;
}

export const IntegrityReportFull = ({ report }: IntegrityReportFullProps) => {
	const [activeTab, setActiveTab] = useState("overview");

	const severityColors = {
		critical: "bg-red-600 text-white",
		high: "bg-orange-500 text-white",
		medium: "bg-yellow-500 text-white",
		low: "bg-blue-500 text-white",
		info: "bg-gray-500 text-white",
	};

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

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="findings">Findings</TabsTrigger>
					<TabsTrigger value="rawdata">Raw Data</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6">
					{report.categories && report.categories.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{report.categories.map((category, i) => (
								<CategoryCard key={i} category={category} />
							))}
						</div>
					)}

					{report.verdict.scoreBreakdown && (
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Score Breakdown</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>Base Score:</span>
									<span className="font-medium">
										{report.verdict.scoreBreakdown.baseScore}
									</span>
								</div>
								{Object.entries(report.verdict.scoreBreakdown.deductions).map(
									([key, value]) => (
										<div key={key} className="flex justify-between text-red-600">
											<span>{key}:</span>
											<span className="font-medium">{value}</span>
										</div>
									),
								)}
								<div className="border-t pt-2 flex justify-between font-semibold">
									<span>Final Score:</span>
									<span>{report.verdict.scoreBreakdown.finalScore}</span>
								</div>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				{/* Findings Tab */}
				<TabsContent value="findings" className="space-y-4">
					{report.categories?.map((category) => (
						<Card key={category.name}>
							<CardHeader>
								<CardTitle className="text-base">{category.name}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{category.findings.map((finding, i) => (
									<div key={i} className="border-l-4 border-gray-200 pl-4">
										<div className="flex items-start gap-2 mb-2">
											<Badge className={severityColors[finding.severity]}>
												{finding.severity}
											</Badge>
											<span className="text-sm font-medium">{finding.type}</span>
										</div>
										<p className="text-sm text-gray-600 mb-2">
											{finding.explanation}
										</p>
										{finding.details && (
											<details className="text-xs">
												<summary className="cursor-pointer text-blue-600 hover:text-blue-700">
													Technical Details
												</summary>
												<pre className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">
													{JSON.stringify(finding.details, null, 2)}
												</pre>
											</details>
										)}
									</div>
								))}
							</CardContent>
						</Card>
					))}
				</TabsContent>

				{/* Raw Data Tab */}
				<TabsContent value="rawdata">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Raw Analysis Data</CardTitle>
						</CardHeader>
						<CardContent>
							<pre className="text-xs bg-gray-50 p-4 rounded overflow-x-auto max-h-96">
								{JSON.stringify(report.rawData, null, 2)}
							</pre>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};
