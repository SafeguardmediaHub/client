"use client";

import { LinkIcon, Loader2, UploadIcon } from "lucide-react";
import type { FC } from "react";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

type DashboardProps = {
    userName?: string;
    onAnalyzeLink?: (url: string) => void;
    onUploadSuccess?: (key: string) => void;
};

const MAX_BYTES = 100_000_000; // 100MB
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "bmp", "tiff", "webp"];

interface AnalysisResult {
    analysis_timestamp: string;
    image_file: string;
    metadata: {
        filename: string;
        file_size_bytes: number;
        file_size_mb: number;
        format: string;
        dimensions: string;
        mode: string;
        created: string;
        modified: string;
        exif: Record<string, unknown>;
        md5: string;
        sha256: string;
    };
    manipulation_detection: {
        ela: {
            ela_score: number;
            ela_image: string;
            interpretation: string;
        };
        noise: {
            noise_inconsistency_score: number;
            noise_heatmap: string;
            interpretation: string;
        };
        copy_move: {
            clone_score: number;
            matches_found: number;
            clone_heatmap: string;
            interpretation: string;
        };
        jpeg_compression: {
            format: string;
            quality_estimate?: string;
            compression_level?: string;
            bytes_per_pixel?: number;
            block_artifacts?: number;
            artifact_score?: number;
            quantization_tables_present?: boolean;
            double_compression_likelihood?: string;
            interpretation?: string;
            message?: string;
        };
        ai_generated?: {
            ai_generation_score: number;
            verdict: string;
            confidence: string;
            indicators?: string[];
            faces_detected?: number;
            analysis_details?: {
                frequency_ratio?: number;
                saturation_std?: number;
                texture_variance?: number;
                edge_density?: number;
                lbp_entropy?: number;
            };
            heatmap?: string;
        };
    };
    overall_assessment: {
        tampering_likelihood: number;
        verdict: string;
        confidence: string;
    };
    user_friendly_summary: {
        status: string;
        trust_level: string;
        tampering_probability: string;
        issues_found: string[];
        positive_findings: string[];
        recommendation: string;
        image_info: {
            format: string;
            dimensions: string;
            file_size: number;
            has_gps: boolean;
        };
    };
}

const VisualForensics: FC<DashboardProps> = ({
    userName = "there",
    onAnalyzeLink,
    onUploadSuccess,
}) => {
    const [url, setUrl] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadingFiles, setUploadingFiles] = useState<{
        name: string;
        size: number;
        progress: number;
        status: "uploading" | "completed" | "analyzing";
        key?: string;
    }[]>([]);
    const [actualFile, setActualFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [combinedHeatmap, setCombinedHeatmap] = useState<string | null>(null);
    const [elaHeatmap, setElaHeatmap] = useState<string | null>(null);
    const [noiseHeatmap, setNoiseHeatmap] = useState<string | null>(null);
    const [cloneHeatmap, setCloneHeatmap] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeHeatmap, setActiveHeatmap] = useState<"combined" | "ela" | "noise" | "clone">("combined");
    const isBusy = useMemo(() => uploadingFiles.length > 0, [uploadingFiles]);
    const [mockAnalyses, setMockAnalyses] = useState<{
        id: number;
        fileName: string;
        dimensions: string;
        tamperingScore: number;
        uploadDate: string;
    }[]>([]);

    const filteredAnalyses = mockAnalyses.filter((item) =>
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage);
    const paginatedAnalyses = filteredAnalyses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const validateFile = useCallback((file: File) => {
        if (file.size > MAX_BYTES) {
            return "File is too large. Max size is 100MB.";
        }
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return "Unsupported file type. Use JPG, PNG, BMP, TIFF, or WebP.";
        }
        return null;
    }, []);

    const handleFiles = useCallback(
        async (files: FileList | null) => {
            if (!files || files.length === 0) return;
            const file = files[0];

            const validationError = validateFile(file);
            if (validationError) {
                toast.error(validationError);
                return;
            }

            setActualFile(file);
            setImagePreview(URL.createObjectURL(file));

            setUploadingFiles([
                {
                    name: file.name,
                    size: file.size,
                    progress: 0,
                    status: "uploading",
                },
            ]);

            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadingFiles([
                    {
                        name: file.name,
                        size: file.size,
                        progress,
                        status: "uploading",
                    },
                ]);

                if (progress >= 100) {
                    clearInterval(interval);
                    setUploadingFiles([
                        {
                            name: file.name,
                            size: file.size,
                            progress: 100,
                            status: "completed",
                            key: file.name,
                        },
                    ]);
                    toast.success("File ready for analysis!");
                }
            }, 200);
        },
        [validateFile]
    );

    const handleAnalyzeImage = useCallback(async () => {
        const file = uploadingFiles[0];
        if (!file || !file.key || !actualFile) {
            toast.error("File not found");
            return;
        }

        setIsAnalyzing(true);
        setUploadingFiles([{ ...file, status: "analyzing" }]);
        setAnalysisProgress(0);

        try {
            const formData = new FormData();
            formData.append("image", actualFile);

            const progressInterval = setInterval(() => {
                setAnalysisProgress((prev) => Math.min(prev + 5, 90));
            }, 500);

            const response = await fetch(
                "https://mirackchuks-visualforensics.hf.space/analyze",
                {
                    method: "POST",
                    body: formData,
                }
            );

            clearInterval(progressInterval);

            if (!response.ok) throw new Error("Analysis failed");

            const blob = await response.blob();
            setAnalysisProgress(95);

            const JSZip = (await import("jszip")).default;
            const zip = await JSZip.loadAsync(blob);

            let result: AnalysisResult | null = null;

            // Extract forensic_report.json
            const resultFile = zip.file("forensic_report.json");
            if (resultFile) {
                const resultText = await resultFile.async("text");
                result = JSON.parse(resultText);
                setAnalysisResult(result);
            }

            // Extract combined_heatmap.png
            const combinedFile = zip.file("combined_heatmap.png");
            if (combinedFile) {
                const heatmapBlob = await combinedFile.async("blob");
                setCombinedHeatmap(URL.createObjectURL(heatmapBlob));
            }

            // Extract ela_heatmap.png
            const elaFile = zip.file("ela_heatmap.png");
            if (elaFile) {
                const elaBlob = await elaFile.async("blob");
                setElaHeatmap(URL.createObjectURL(elaBlob));
            }

            // Extract noise_heatmap.png
            const noiseFile = zip.file("noise_heatmap.png");
            if (noiseFile) {
                const noiseBlob = await noiseFile.async("blob");
                setNoiseHeatmap(URL.createObjectURL(noiseBlob));
            }

            // Extract clone_detection.png
            const cloneFile = zip.file("clone_detection.png");
            if (cloneFile) {
                const cloneBlob = await cloneFile.async("blob");
                setCloneHeatmap(URL.createObjectURL(cloneBlob));
            }

            setAnalysisProgress(100);
            setIsAnalyzing(false);

            // Add to mockAnalyses
            if (result?.overall_assessment) {
                const newAnalysis = {
                    id: mockAnalyses.length + 1,
                    fileName: actualFile.name,
                    dimensions: result.metadata.dimensions,
                    tamperingScore: result.overall_assessment.tampering_likelihood,
                    uploadDate: new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    }),
                };
                setMockAnalyses([newAnalysis, ...mockAnalyses]);
            }

            setUploadingFiles([]);
            setActualFile(null);
            toast.success("Image analysis completed!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to analyze image");
            setIsAnalyzing(false);
            setUploadingFiles([]);
            setActualFile(null);
        }
    }, [uploadingFiles, actualFile, mockAnalyses]);

    const onDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (isBusy) return;
            const dt = e.dataTransfer;
            handleFiles(dt.files);
        },
        [handleFiles, isBusy]
    );

    const onBrowseClick = useCallback(() => {
        if (isBusy) return;
        fileInputRef.current?.click();
    }, [isBusy]);

    const analyzeSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            onAnalyzeLink?.(url);
        },
        [onAnalyzeLink, url]
    );
    const inputId = useId();

    const getRiskColor = (score: number) => {
        if (score <= 30) return "text-green-500";
        if (score <= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getRiskBgColor = (score: number) => {
        if (score <= 30) return "bg-green-50 border-green-200";
        if (score <= 60) return "bg-yellow-50 border-yellow-200";
        return "bg-red-50 border-red-200";
    };

    const getRiskLabel = (score: number) => {
        if (score <= 30) return "Low";
        if (score <= 60) return "Medium";
        return "High";
    };

    const getInterpretationColor = (interpretation: string) => {
        if (interpretation === "Low") return "bg-green-100 text-green-800";
        if (interpretation === "Medium") return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    const getSyntheticColor = (score: number) => {
        if (score <= 30) return "bg-green-100 text-green-800";
        if (score <= 60) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    const resetAnalysis = () => {
        setAnalysisResult(null);
        setCombinedHeatmap(null);
        setElaHeatmap(null);
        setNoiseHeatmap(null);
        setCloneHeatmap(null);
        setImagePreview(null);
        setUploadingFiles([]);
        setActiveHeatmap("combined");
    };

    const getCurrentHeatmap = () => {
        switch (activeHeatmap) {
            case "ela": return elaHeatmap;
            case "noise": return noiseHeatmap;
            case "clone": return cloneHeatmap;
            default: return combinedHeatmap;
        }
    };

    return (
        <section className="flex flex-1 flex-col gap-4 py-4 px-8">
            <header className="flex-col items-start gap-1 flex">
                <h1 className="text-2xl font-medium text-black leading-9">
                    Visual Forensic Analysis
                </h1>
                <p className="text-sm text-muted-foreground">
                    Advanced image forensic analysis for detecting manipulation and verifying authenticity
                </p>
            </header>

            {!analysisResult ? (
                <>
                    <Card className="flex flex-col items-start gap-6 p-6 relative self-stretch w-full">
                        <CardContent className="p-0 w-full">
                            {uploadingFiles.length === 0 ? (
                                <>
                                    <form
                                        onSubmit={analyzeSubmit}
                                        className="flex items-center gap-0 bg-muted rounded-xl mb-6"
                                    >
                                        <div className="flex items-center gap-3 flex-1 px-3">
                                            <LinkIcon className="w-5 h-5 text-muted-foreground" />
                                            <Input
                                                aria-label="Image URL"
                                                className="flex-1 border-0 bg-transparent p-0 focus-visible:ring-0"
                                                placeholder="Paste a link to an image file to start forensic analysis"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                disabled={isBusy}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            className="rounded-l-none cursor-pointer"
                                            disabled={true}
                                        >
                                            Upload Image
                                        </Button>
                                    </form>

                                    <section
                                        className="relative w-full rounded-lg border border-dashed bg-muted"
                                        aria-label="Upload dropzone"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                onBrowseClick();
                                            }
                                        }}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDrop={onDrop}
                                    >
                                        <label
                                            htmlFor={inputId}
                                            className="flex flex-col items-center gap-4 w-full py-6 cursor-pointer"
                                        >
                                            <UploadIcon className="w-10 h-10 text-muted-foreground" />
                                            <div className="flex flex-col items-center gap-1 w-full">
                                                <p className="text-base text-center">
                                                    Drag and drop to upload or click to browse files
                                                </p>
                                                <p className="text-sm text-primary text-center">
                                                    Supports JPG, PNG, BMP, TIFF, WebP (100 MB)
                                                </p>
                                            </div>

                                            <input
                                                id={inputId}
                                                ref={fileInputRef}
                                                type="file"
                                                className="sr-only"
                                                onChange={(e) => handleFiles(e.target.files)}
                                                accept=".jpg,.jpeg,.png,.bmp,.tiff,.webp,image/*"
                                                disabled={isBusy}
                                            />

                                            <Button
                                                type="button"
                                                onClick={onBrowseClick}
                                                disabled={isBusy}
                                            >
                                                {isBusy ? "Please wait…" : "Select Files to Upload"}
                                            </Button>
                                        </label>
                                    </section>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    {uploadingFiles[0].status === "analyzing" ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 py-2">
                                                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {uploadingFiles[0].name} (1 file)
                                                </span>
                                            </div>
                                            <div className="text-center py-12 space-y-4">
                                                <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
                                                <div>
                                                    <p className="text-lg font-semibold">Analyzing Image...</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Performing forensic analysis and tampering detection
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 bg-muted/50 rounded-lg p-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium">Processing Image File</span>
                                                    <span className="text-muted-foreground">Processing...</span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-background">
                                                    <div
                                                        className="h-2 rounded-full bg-primary transition-all"
                                                        style={{ width: `${analysisProgress}%` }}
                                                    />
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full mt-2"
                                                    onClick={() => {
                                                        setIsAnalyzing(false);
                                                        setUploadingFiles([]);
                                                        setActualFile(null);
                                                        setImagePreview(null);
                                                        toast.info("Analysis cancelled");
                                                    }}
                                                >
                                                    Cancel Analysis
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between py-2">
                                                <h3 className="text-sm font-medium">Upload progress</h3>
                                                <span className="text-xs text-green-600 font-medium">
                                                    {uploadingFiles[0].status === "completed" ? "1/1 Completed" : "0/1 Completed"}
                                                </span>
                                            </div>

                                            <div className="border rounded-lg">
                                                <div className="flex items-center justify-between p-4">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center overflow-hidden">
                                                            {imagePreview ? (
                                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{uploadingFiles[0].name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {(uploadingFiles[0].size / (1024 * 1024)).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {uploadingFiles[0].status === "completed" && (
                                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                                <span className="text-green-600 text-xs">✓</span>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setUploadingFiles([]);
                                                                setImagePreview(null);
                                                            }}
                                                            className="text-muted-foreground hover:text-foreground"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>

                                                {uploadingFiles[0].status === "uploading" && (
                                                    <div className="px-4 pb-4">
                                                        <div className="h-1.5 w-full rounded-full bg-muted">
                                                            <div
                                                                className="h-1.5 rounded-full bg-primary transition-all"
                                                                style={{ width: `${uploadingFiles[0].progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {uploadingFiles[0].status === "completed" && (
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <Button onClick={handleAnalyzeImage} className="flex-1" disabled={isAnalyzing}>
                                                        {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                                                    </Button>
                                                    <Button variant="outline" className="flex-1" onClick={() => { setUploadingFiles([]); setImagePreview(null); }} disabled={isAnalyzing}>
                                                        Upload another file
                                                    </Button>
                                                    <Button variant="outline" className="flex-1" onClick={() => { setUploadingFiles([]); setImagePreview(null); }} disabled={isAnalyzing}>
                                                        Clear all
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="p-6 w-full">
                        <CardContent className="p-0 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Recent Image Analyses</h3>
                            </div>

                            <div className="relative">
                                <Input
                                    placeholder="Search here..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-sm text-muted-foreground">
                                            <th className="text-left font-medium py-3 px-4">Media</th>
                                            <th className="text-left font-medium py-3 px-4">File name</th>
                                            <th className="text-left font-medium py-3 px-4">Dimensions</th>
                                            <th className="text-left font-medium py-3 px-4">Tampering Score</th>
                                            <th className="text-left font-medium py-3 px-4">Upload date/time</th>
                                            <th className="w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {paginatedAnalyses.length > 0 ? (
                                            paginatedAnalyses.map((item) => (
                                                <tr key={item.id} className="hover:bg-muted/50">
                                                    <td className="py-3 px-4">
                                                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">{item.fileName}</td>
                                                    <td className="py-3 px-4 text-sm">{item.dimensions}</td>
                                                    <td className="py-3 px-4 text-sm">{item.tamperingScore}%</td>
                                                    <td className="py-3 px-4 text-sm text-muted-foreground">{item.uploadDate}</td>
                                                    <td className="py-3 px-4">
                                                        <button className="text-muted-foreground hover:text-foreground">⋮</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                                                    No results found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAnalyses.length)} of {filteredAnalyses.length} entries
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                            Previous
                                        </Button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="w-9">
                                                {page}
                                            </Button>
                                        ))}
                                        <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            ) : (
                <Card className="p-4 md:p-6 w-full max-w-5xl mx-auto">
                    <CardContent className="p-0 space-y-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetAnalysis}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? "Analyzing..." : "Re-analyze"}
                            </Button>
                        </div>

                        <p className="text-lg font-medium">{analysisResult.metadata.filename}</p>

                        {/* Main content grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left side - Image */}
                            <div className="space-y-4">
                                <div className="border rounded-lg overflow-hidden bg-muted">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Analyzed" className="w-full h-auto max-h-[400px] object-contain" />
                                    ) : (
                                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                                            No preview available
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-center gap-2">
                                    <button className="w-8 h-8 rounded border flex items-center justify-center hover:bg-muted">‹</button>
                                    <button className="w-8 h-8 rounded border flex items-center justify-center hover:bg-muted">›</button>
                                </div>
                            </div>

                            {/* Right side - Overall Tampering Score */}
                            <div className={`p-6 rounded-lg border ${getRiskBgColor(analysisResult.overall_assessment.tampering_likelihood)} h-fit`}>
                                <h3 className="text-lg font-semibold mb-2">Overall Tampering Probability</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Based on all forensic analyses combined
                                </p>

                                <div className="flex flex-col items-center justify-center py-6">
                                    <div className="relative w-40 h-40">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke={analysisResult.overall_assessment.tampering_likelihood <= 30 ? "#22c55e" : analysisResult.overall_assessment.tampering_likelihood <= 60 ? "#eab308" : "#ef4444"}
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${analysisResult.overall_assessment.tampering_likelihood * 2.51} 251`}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className={`text-4xl font-bold ${getRiskColor(analysisResult.overall_assessment.tampering_likelihood)}`}>
                                                {analysisResult.overall_assessment.tampering_likelihood}%
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-lg font-semibold mt-4">
                                        Risk Level: <span className={getRiskColor(analysisResult.overall_assessment.tampering_likelihood)}>
                                            {getRiskLabel(analysisResult.overall_assessment.tampering_likelihood)}
                                        </span>
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2 text-center">
                                        {analysisResult.user_friendly_summary.recommendation}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Detection Results */}
                        <div className="border rounded-lg p-6 space-y-6">
                            <h3 className="text-lg font-semibold">Detection Results</h3>

                            {/* ELA */}
                            <div className="border-b pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-medium">Error Level Analysis (ELA)</h4>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getInterpretationColor(analysisResult.manipulation_detection.ela.interpretation)}`}>
                                            {Math.round(analysisResult.manipulation_detection.ela.ela_score * 100 / 20)}% Anomaly
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    <strong>What this means:</strong> Checks if different parts of the image were saved at different quality levels
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {analysisResult.manipulation_detection.ela.interpretation === "Low"
                                        ? "✓ All parts saved consistently"
                                        : analysisResult.manipulation_detection.ela.interpretation === "Medium"
                                            ? "⚠ Some areas show different compression"
                                            : "⚠ Multiple areas show mismatched quality"}
                                </p>
                            </div>

                            {/* Noise Analysis */}
                            <div className="border-b pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-medium">Noise Pattern Analysis</h4>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getInterpretationColor(analysisResult.manipulation_detection.noise.interpretation)}`}>
                                            {Math.round(100 - analysisResult.manipulation_detection.noise.noise_inconsistency_score)}% Consistent
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    <strong>What this means:</strong> Examines if image grain/texture is uniform throughout
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {analysisResult.manipulation_detection.noise.interpretation === "Low"
                                        ? "✓ Natural texture throughout"
                                        : analysisResult.manipulation_detection.noise.interpretation === "Medium"
                                            ? "⚠ Some texture differences detected"
                                            : "⚠ Unnatural texture patterns found"}
                                </p>
                            </div>

                            {/* Compression Analysis */}
                            <div className="border-b pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">Compression Analysis</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    <strong>What this means:</strong> Detects if image was edited and re-saved multiple times
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {analysisResult.manipulation_detection.jpeg_compression.interpretation}
                                </p>
                            </div>

                            {/* Copy-Move Detection */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-medium">Copy-Move Detection</h4>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getInterpretationColor(analysisResult.manipulation_detection.copy_move.interpretation)}`}>
                                            {analysisResult.manipulation_detection.copy_move.clone_score}% Clone Score
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    <strong>What this means:</strong> Looks for duplicated/copied regions within the same image
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {analysisResult.manipulation_detection.copy_move.interpretation === "Low"
                                        ? "✓ No copied regions detected"
                                        : `⚠ ${analysisResult.manipulation_detection.copy_move.matches_found} duplicate regions found`}
                                </p>
                            </div>
                        </div>

                        {/* Image Info */}
                        <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Format:</p>
                                <p className="font-medium">{analysisResult.metadata.format}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Dimensions:</p>
                                <p className="font-medium">{analysisResult.metadata.dimensions}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">File Size:</p>
                                <p className="font-medium">{analysisResult.metadata.file_size_mb} MB</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">MD5 Hash:</p>
                                <p className="font-medium truncate">{analysisResult.metadata.md5.slice(0, 16)}...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            )}
        </section>
    );
};

export default VisualForensics;