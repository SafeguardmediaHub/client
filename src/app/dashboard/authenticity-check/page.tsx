/** biome-ignore-all lint/performance/noImgElement: <> */
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle,
	Loader2,
	ShieldCheck,
	Upload,
	X,
} from "lucide-react";
import MediaSelector from "@/components/media/MediaSelector";
import { IntegrityReportFull } from "@/components/integrity/IntegrityReportFull";
import { IntegrityReportSimple } from "@/components/integrity/IntegrityReportSimple";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Media, useGetMedia } from "@/hooks/useMedia";
import { useIntegrityReport } from "@/hooks/useIntegrityReport";
import { formatFileSize } from "@/lib/utils";

type PageState = "idle" | "selecting" | "processing" | "results" | "error";

const AuthenticityCheckContent = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [state, setState] = useState<PageState>("idle");
	const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
	const [reportType, setReportType] = useState<"simple" | "full">("simple");

	const { data } = useGetMedia();
	const media = data?.media || [];

	const {
		data: reportData,
		isLoading,
		error,
		refetch,
	} = useIntegrityReport(selectedMedia?.id, reportType, {
		enabled: state === "processing",
	});

	// Handle auto-run from query params
	useEffect(() => {
		const mediaId = searchParams.get("mediaId");
		const autoRun = searchParams.get("autoRun") === "true";

		if (mediaId && autoRun && media.length > 0) {
			const mediaItem = media.find((m) => m.id === mediaId);
			if (mediaItem) {
				setSelectedMedia(mediaItem);
				setState("processing");
			}
		}
	}, [searchParams, media]);

	// Handle loading completion
	useEffect(() => {
		if (state === "processing") {
			if (!isLoading && reportData) {
				setState("results");
			} else if (!isLoading && error) {
				const status = (error as any)?.response?.status;
				if (status === 202) {
					toast.info(
						"Report is still being generated. Please try again in a moment.",
					);
					setState("selecting");
				} else {
					setState("error");
				}
			}
		}
	}, [isLoading, reportData, error, state]);

	const handleMediaSelection = (mediaFile: Media) => {
		const selectedFile = media.find((file) => file.id === mediaFile.id);
		if (selectedFile) {
			setSelectedMedia(selectedFile);
			setState("selecting");
		}
	};

	const handleReset = () => {
		setState("idle");
		setSelectedMedia(null);
		setReportType("simple");
	};

	const handleRunCheck = () => {
		if (!selectedMedia) return;
		setState("processing");
	};

	const handleViewFull = () => {
		setReportType("full");
		setState("processing");
	};

	return (
		<div className="w-full flex flex-col gap-6 p-8">
			{/* Back Button */}
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => router.push("/dashboard")}
				>
					<ArrowLeft className="size-4 mr-1" />
					Back
				</Button>
			</div>

			{/* Main Content - Centered */}
			<div className="max-w-4xl mx-auto w-full">
				{/* Hero Section */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center size-16 rounded-2xl bg-blue-50 mb-4">
						<ShieldCheck className="size-8 text-blue-600" />
					</div>
					<h1 className="text-2xl font-semibold text-gray-900">
						Authenticity Check
					</h1>
					<p className="text-sm text-gray-500 mt-2">
						Comprehensive media integrity verification with detailed analysis
					</p>
				</div>

				{/* State: Idle */}
				{state === "idle" && (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
						{/* Info Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card className="border-blue-200 bg-blue-50/50">
								<CardContent className="p-6">
									<h3 className="font-semibold text-blue-900 mb-2">
										What We Check
									</h3>
									<ul className="text-sm text-blue-800 space-y-1">
										<li>• Metadata integrity</li>
										<li>• Content authenticity (C2PA)</li>
										<li>• File integrity</li>
										<li>• Geolocation verification</li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border-green-200 bg-green-50/50">
								<CardContent className="p-6">
									<h3 className="font-semibold text-green-900 mb-2">
										How It Works
									</h3>
									<ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
										<li>Select media from library</li>
										<li>Choose report type</li>
										<li>Run comprehensive analysis</li>
										<li>Review detailed findings</li>
									</ol>
								</CardContent>
							</Card>
						</div>

						{/* Media Selector */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Select Media to Verify</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Choose from your library
									</label>
									<MediaSelector onSelect={handleMediaSelection} />
								</div>

								<div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
									<AlertCircle className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
									<div className="text-sm text-blue-800">
										<span className="font-medium">Tip:</span> Only processed
										media files can be analyzed.
									</div>
								</div>

								{/* Upload Media Button */}
								<div className="pt-2">
									<Button asChild variant="outline" className="w-full">
										<Link href="/dashboard/library">
											<Upload className="size-4 mr-2" />
											Upload Media to Library
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* State: Selecting */}
				{state === "selecting" && selectedMedia && (
					<Card className="animate-in fade-in slide-in-from-bottom-4">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg">
									Configure Authenticity Check
								</CardTitle>
								<Button variant="ghost" size="sm" onClick={handleReset}>
									<X className="size-4 mr-1" />
									Cancel
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Selected media preview */}
							<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
								<div className="flex items-center gap-4">
									<div className="size-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
										<img
											src={selectedMedia.thumbnailUrl}
											alt={selectedMedia.filename}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-gray-900 truncate mb-1">
											{selectedMedia.filename}
										</p>
										<p className="text-sm text-gray-500">
											{formatFileSize(Number(selectedMedia.fileSize))}
										</p>
										<div className="flex items-center gap-2 mt-2">
											<CheckCircle className="size-4 text-green-600" />
											<span className="text-sm text-green-700 font-medium">
												Ready to analyze
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Report type selection */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-3">
									Report Detail Level
								</label>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<button
										onClick={() => setReportType("simple")}
										className={`p-4 border-2 rounded-lg text-left transition-all ${
											reportType === "simple"
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<div className="font-semibold text-gray-900 mb-1">
											Simple
										</div>
										<div className="text-sm text-gray-600">
											Quick overview with verdict and key issues
										</div>
									</button>

									<button
										onClick={() => setReportType("full")}
										className={`p-4 border-2 rounded-lg text-left transition-all ${
											reportType === "full"
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<div className="font-semibold text-gray-900 mb-1">Full</div>
										<div className="text-sm text-gray-600">
											Comprehensive analysis with all findings and raw data
										</div>
									</button>
								</div>
							</div>

							{/* Action buttons */}
							<div className="space-y-3">
								<Button onClick={handleRunCheck} className="w-full">
									<ShieldCheck className="size-4 mr-2" />
									Run Authenticity Check
								</Button>
								<Button
									variant="outline"
									onClick={handleReset}
									className="w-full"
								>
									Select Different File
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* State: Processing */}
				{state === "processing" && selectedMedia && (
					<Card className="animate-in fade-in slide-in-from-bottom-4">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg flex items-center gap-2">
									<Loader2 className="size-5 animate-spin text-blue-600" />
									Analyzing Media Integrity...
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
								<div className="flex items-center gap-4">
									<div className="size-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
										<img
											src={selectedMedia.thumbnailUrl}
											alt={selectedMedia.filename}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-gray-900 truncate">
											{selectedMedia.filename}
										</p>
										<p className="text-sm text-gray-500">
											{formatFileSize(Number(selectedMedia.fileSize))}
										</p>
									</div>
								</div>
							</div>

							<div className="py-8 text-center">
								<Loader2 className="size-12 animate-spin text-blue-600 mx-auto mb-4" />
								<p className="text-sm font-medium text-gray-700 mb-2">
									Running comprehensive integrity analysis
								</p>
								<p className="text-xs text-gray-500">
									This may take up to 30 seconds...
								</p>
							</div>

							<div className="flex items-center justify-center gap-2 text-xs text-blue-600">
								<span className="relative flex size-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
									<span className="relative inline-flex rounded-full size-2 bg-blue-500" />
								</span>
								Processing your request
							</div>
						</CardContent>
					</Card>
				)}

				{/* State: Results */}
				{state === "results" && reportData && (
					<div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">Integrity Report</CardTitle>
									<Button variant="outline" size="sm" onClick={handleReset}>
										Run Another Check
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{reportType === "simple" ? (
									<IntegrityReportSimple
										report={reportData.report}
										onViewFull={handleViewFull}
									/>
								) : (
									<IntegrityReportFull report={reportData.report} />
								)}
							</CardContent>
						</Card>

						{/* Media Info */}
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Media Information</CardTitle>
							</CardHeader>
							<CardContent className="text-sm space-y-2">
								<div className="flex justify-between">
									<span className="text-gray-600">Filename:</span>
									<span className="font-medium">
										{reportData.mediaInfo.originalFilename}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Type:</span>
									<span className="font-medium">
										{reportData.mediaInfo.mimeType}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Size:</span>
									<span className="font-medium">
										{formatFileSize(reportData.mediaInfo.fileSize)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Uploaded:</span>
									<span className="font-medium">
										{new Date(reportData.mediaInfo.uploadedAt).toLocaleString()}
									</span>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* State: Error */}
				{state === "error" && (
					<Card className="animate-in fade-in slide-in-from-bottom-4 border-red-200 bg-red-50">
						<CardContent className="p-6">
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
								<div className="flex-1">
									<h3 className="font-semibold text-red-900 mb-2">
										Failed to generate integrity report
									</h3>
									<p className="text-sm text-red-800 mb-4">
										{(error as any)?.response?.data?.message ||
											"An unexpected error occurred."}
									</p>
									<div className="flex gap-3">
										<Button
											onClick={() => setState("processing")}
											variant="outline"
											size="sm"
										>
											Try Again
										</Button>
										<Button onClick={handleReset} variant="outline" size="sm">
											Select Different File
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};

const AuthenticityCheckPage = () => {
	return (
		<Suspense fallback={<div className="w-full flex items-center justify-center p-8"><div>Loading...</div></div>}>
			<AuthenticityCheckContent />
		</Suspense>
	);
};

export default AuthenticityCheckPage;
