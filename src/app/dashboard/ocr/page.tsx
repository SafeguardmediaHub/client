"use client";

import { LinkIcon, Loader2, UploadIcon, Copy, Check } from "lucide-react";
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

const MAX_BYTES = 100_000_000;
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "bmp", "tiff", "webp"];

interface ExtractionResult {
    text: string;
    word_count: number;
    char_count: number;
    avg_confidence: number;
    processing_time: number;
    original_filename: string;
}

const TextExtractor: FC<DashboardProps> = ({
    userName = "there",
    onAnalyzeLink,
    onUploadSuccess,
}) => {
    const [url, setUrl] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLanguage, setSelectedLanguage] = useState("eng");
    const itemsPerPage = 9;
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadingFiles, setUploadingFiles] = useState<{
        name: string;
        size: number;
        progress: number;
        status: "uploading" | "completed" | "extracting";
        key?: string;
    }[]>([]);
    const [actualFile, setActualFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [extractionProgress, setExtractionProgress] = useState(0);
    const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [copied, setCopied] = useState(false);
    const isBusy = useMemo(() => uploadingFiles.length > 0, [uploadingFiles]);
    const [recentExtractions, setRecentExtractions] = useState<{
        id: number;
        fileName: string;
        wordCount: number;
        confidence: number;
        uploadDate: string;
    }[]>([]);

    const filteredExtractions = recentExtractions.filter((item) =>
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredExtractions.length / itemsPerPage);
    const paginatedExtractions = filteredExtractions.slice(
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
                    toast.success("File ready for extraction!");
                }
            }, 200);
        },
        [validateFile]
    );

    const handleExtractText = useCallback(async () => {
        const file = uploadingFiles[0];
        if (!file || !file.key || !actualFile) {
            toast.error("File not found");
            return;
        }

        setIsExtracting(true);
        setUploadingFiles([{ ...file, status: "extracting" }]);
        setExtractionProgress(0);

        try {
            const formData = new FormData();
            formData.append("image", actualFile);
            formData.append("languages", selectedLanguage);
            formData.append("preprocess", "true");
            formData.append("format", "json");

            const progressInterval = setInterval(() => {
                setExtractionProgress((prev) => Math.min(prev + 5, 90));
            }, 300);

            const response = await fetch(
                "https://mirackchuks-textextractor.hf.space/extract",
                {
                    method: "POST",
                    body: formData,
                }
            );

            clearInterval(progressInterval);

            if (!response.ok) throw new Error("Extraction failed");

            const result: ExtractionResult = await response.json();
            setExtractionProgress(100);
            setExtractionResult(result);
            setIsExtracting(false);

            // Add to recent extractions
            const newExtraction = {
                id: recentExtractions.length + 1,
                fileName: actualFile.name,
                wordCount: result.word_count,
                confidence: result.avg_confidence,
                uploadDate: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
            };
            setRecentExtractions([newExtraction, ...recentExtractions]);

            setUploadingFiles([]);
            setActualFile(null);
            toast.success("Text extraction completed!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to extract text");
            setIsExtracting(false);
            setUploadingFiles([]);
            setActualFile(null);
        }
    }, [uploadingFiles, actualFile, recentExtractions, selectedLanguage]);

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

    const getAccuracyColor = (score: number) => {
        if (score >= 70) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const getAccuracyBgColor = (score: number) => {
        if (score >= 70) return "bg-green-50 border-green-200";
        if (score >= 50) return "bg-yellow-50 border-yellow-200";
        return "bg-red-50 border-red-200";
    };

    const getAccuracyStatus = (score: number) => {
        if (score >= 80) return "Excellent";
        if (score >= 70) return "Good";
        if (score >= 50) return "Fair";
        return "Poor";
    };

    const getAccuracyStatusColor = (score: number) => {
        if (score >= 70) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const resetExtraction = () => {
        setExtractionResult(null);
        setImagePreview(null);
        setUploadingFiles([]);
        setCopied(false);
    };

    const copyToClipboard = async () => {
        if (extractionResult?.text) {
            await navigator.clipboard.writeText(extractionResult.text);
            setCopied(true);
            toast.success("Text copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <section className="flex flex-1 flex-col gap-4 py-4 px-8">
            <header className="flex-col items-start gap-1 flex">
                <h1 className="text-2xl font-medium text-black leading-9">
                    Text Extraction (OCR)
                </h1>
                <p className="text-sm text-muted-foreground">
                    Extract text from images using advanced Optical Character Recognition
                </p>
            </header>

            {!extractionResult ? (
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
                                                placeholder="Paste a link to an image file to extract text"
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
                                            Extract Text
                                        </Button>
                                    </form>

                                    <div className="mb-4">
                                        <label className="text-sm font-medium mb-2 block">Language</label>
                                        <select
                                            value={selectedLanguage}
                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                            className="w-full md:w-64 px-3 py-2 border rounded-lg bg-background"
                                        >
                                            <option value="eng">English</option>
                                            <option value="spa">Spanish</option>
                                            <option value="fra">French</option>
                                            <option value="deu">German</option>
                                            <option value="ara">Arabic</option>
                                            <option value="chi_sim">Chinese (Simplified)</option>
                                            <option value="jpn">Japanese</option>
                                            <option value="kor">Korean</option>
                                            <option value="eng+ara">English + Arabic</option>
                                            <option value="eng+fra">English + French</option>
                                        </select>
                                    </div>

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
                                    {uploadingFiles[0].status === "extracting" ? (
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
                                                    <p className="text-lg font-semibold">Extracting Text...</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Running OCR and text recognition
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 bg-muted/50 rounded-lg p-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium">Processing Image</span>
                                                    <span className="text-muted-foreground">{extractionProgress}%</span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-background">
                                                    <div
                                                        className="h-2 rounded-full bg-primary transition-all"
                                                        style={{ width: `${extractionProgress}%` }}
                                                    />
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full mt-2"
                                                    onClick={() => {
                                                        setIsExtracting(false);
                                                        setUploadingFiles([]);
                                                        setActualFile(null);
                                                        setImagePreview(null);
                                                        toast.info("Extraction cancelled");
                                                    }}
                                                >
                                                    Cancel Extraction
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
                                                <div className="flex gap-3">
                                                    <Button onClick={handleExtractText} className="flex-1" disabled={isExtracting}>
                                                        {isExtracting ? "Extracting..." : "Extract Text"}
                                                    </Button>
                                                    <Button variant="outline" onClick={() => { setUploadingFiles([]); setImagePreview(null); }} disabled={isExtracting}>
                                                        Upload another file
                                                    </Button>
                                                    <Button variant="outline" onClick={() => { setUploadingFiles([]); setImagePreview(null); }} disabled={isExtracting}>
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
                                <h3 className="text-lg font-semibold">Recent Extractions</h3>
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
                                            <th className="text-left font-medium py-3 px-4">Words</th>
                                            <th className="text-left font-medium py-3 px-4">Confidence</th>
                                            <th className="text-left font-medium py-3 px-4">Upload date/time</th>
                                            <th className="w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {paginatedExtractions.length > 0 ? (
                                            paginatedExtractions.map((item) => (
                                                <tr key={item.id} className="hover:bg-muted/50">
                                                    <td className="py-3 px-4">
                                                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">{item.fileName}</td>
                                                    <td className="py-3 px-4 text-sm">{item.wordCount}</td>
                                                    <td className="py-3 px-4 text-sm">{item.confidence}%</td>
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
                                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredExtractions.length)} of {filteredExtractions.length} entries
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
                <Card className="p-4 md:p-6 w-full">
                    <CardContent className="p-0 space-y-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <p className="text-lg font-medium">{extractionResult.original_filename}</p>
                            <Button variant="outline" size="sm" onClick={resetExtraction}>
                                Re-do
                            </Button>
                        </div>

                        {/* Main content grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            {/* Left side - Image with text overlay */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="border rounded-lg overflow-hidden bg-muted relative">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Source" className="w-full h-auto" />
                                            <div className="absolute inset-0 bg-black/60 p-4 overflow-auto">
                                                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                                                    {extractionResult.text}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                                            No preview available
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right side - Extraction Accuracy */}
                            <div className={`p-6 rounded-lg border ${getAccuracyBgColor(extractionResult.avg_confidence)}`}>
                                <h3 className="text-lg font-semibold mb-4">Extraction Accuracy</h3>
                                
                                <div className="flex flex-col items-center justify-center py-4">
                                    {/* Circular progress */}
                                    <div className="relative w-40 h-40">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke={extractionResult.avg_confidence >= 70 ? "#ef4444" : extractionResult.avg_confidence >= 50 ? "#eab308" : "#22c55e"}
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${extractionResult.avg_confidence * 2.51} 251`}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className={`text-3xl font-bold ${getAccuracyColor(extractionResult.avg_confidence)}`}>
                                                {Math.round(extractionResult.avg_confidence)}%
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-lg font-semibold mt-4">
                                        Status: <span className={getAccuracyStatusColor(extractionResult.avg_confidence)}>
                                            {getAccuracyStatus(extractionResult.avg_confidence)}
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">
                                        Measured by how clearly text was recognized across OCR engines.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Extracted Text Section */}
                        <div className="border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Extracted Texts</h3>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? "Copied!" : "Copy"}
                                </Button>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-auto">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {extractionResult.text || "No text extracted"}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Words:</p>
                                <p className="font-medium">{extractionResult.word_count}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Characters:</p>
                                <p className="font-medium">{extractionResult.char_count}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Confidence:</p>
                                <p className="font-medium">{extractionResult.avg_confidence}%</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Processing Time:</p>
                                <p className="font-medium">{extractionResult.processing_time}s</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </section>
    );
};

export default TextExtractor;