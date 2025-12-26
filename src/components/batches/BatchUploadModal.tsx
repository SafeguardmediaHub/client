"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBatch } from "@/hooks/batches/useCreateBatch";
import { formatFileSize, getFileIcon } from "@/lib/batch-utils";
import type { UploadProgress } from "@/types/batch";
import { FileDropzone } from "./FileDropzone";

interface BatchUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UploadStep = "details" | "files" | "uploading" | "complete";

export function BatchUploadModal({
  open,
  onOpenChange,
}: BatchUploadModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<UploadStep>("details");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [createdBatchId, setCreatedBatchId] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: [] as string[],
    tagInput: "",
    webhookUrl: "",
    options: {
      enableC2PA: true,
      enableOCR: true,
      enableReverseSearch: false,
      enableDeepfake: false,
      enableGeolocation: false,
      enableIntegrityAnalysis: false,
    },
  });

  const createBatchMutation = useCreateBatch({
    onUploadProgress: setUploadProgress,
    onSuccess: (batchId) => {
      setCreatedBatchId(batchId);
      setStep("complete");
    },
    onError: () => {
      // Close modal when error occurs
      handleClose();
    },
  });

  const handleAddTag = () => {
    if (
      formData.tagInput.trim() &&
      !formData.tags.includes(formData.tagInput.trim())
    ) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: "",
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleNext = () => {
    if (step === "details") {
      setStep("files");
    } else if (step === "files" && files.length > 0) {
      setStep("uploading");
      handleUpload();
    }
  };

  const handleUpload = () => {
    const batchData = {
      name: formData.name || undefined,
      description: formData.description || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      files: files.map((file) => ({
        filename: file.name,
        contentType: file.type,
        fileSize: file.size,
      })),
      options: formData.options,
      webhookUrl: formData.webhookUrl || undefined,
    };

    createBatchMutation.mutate({ batchData, files });
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after closing
    setTimeout(() => {
      setStep("details");
      setFiles([]);
      setUploadProgress([]);
      setCreatedBatchId("");
      setFormData({
        name: "",
        description: "",
        tags: [],
        tagInput: "",
        webhookUrl: "",
        options: {
          enableC2PA: true,
          enableOCR: true,
          enableReverseSearch: false,
          enableDeepfake: false,
          enableGeolocation: false,
          enableIntegrityAnalysis: false,
        },
      });
    }, 300);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center gap-2 mb-6">
      {["details", "files", "uploading"].map((s, idx) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              step === s
                ? "bg-blue-600"
                : ["details", "files"].indexOf(step as string) >
                    ["details", "files"].indexOf(s)
                  ? "bg-blue-600"
                  : "bg-gray-300"
            }`}
          />
          {idx < 2 && <div className="h-0.5 w-8 bg-gray-300" />}
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto">
        {step !== "complete" && renderStepIndicator()}

        {/* Step 1: Batch Details */}
        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
              <DialogDescription>
                Step 1 of 3: Enter batch details
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Batch Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Batch Name (optional)</Label>
                <Input
                  id="name"
                  placeholder="e.g., Event Photos - Nov 15"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  maxLength={200}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this batch..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  maxLength={1000}
                  rows={3}
                />
                <p className="text-xs text-gray-500 text-right">
                  {formData.description.length}/1000
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag..."
                    value={formData.tagInput}
                    onChange={(e) =>
                      setFormData({ ...formData, tagInput: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Processing Options */}
              <div className="space-y-3">
                <Label>Processing Options</Label>
                <div className="space-y-3">
                  {/* Integrity Analysis - FIRST */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="integrityAnalysis"
                      checked={formData.options.enableIntegrityAnalysis}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          options: {
                            ...formData.options,
                            enableIntegrityAnalysis: checked as boolean,
                          },
                        })
                      }
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="integrityAnalysis"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable Integrity Analysis (Authenticity Check)
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Analyze media authenticity and detect manipulation across metadata, C2PA, file integrity, and geolocation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="c2pa"
                      checked={formData.options.enableC2PA}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          options: {
                            ...formData.options,
                            enableC2PA: checked as boolean,
                          },
                        })
                      }
                    />
                    <label
                      htmlFor="c2pa"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable C2PA Verification
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ocr"
                      checked={formData.options.enableOCR}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          options: {
                            ...formData.options,
                            enableOCR: checked as boolean,
                          },
                        })
                      }
                    />
                    <label
                      htmlFor="ocr"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable OCR Text Extraction
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reverse"
                      checked={formData.options.enableReverseSearch}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          options: {
                            ...formData.options,
                            enableReverseSearch: checked as boolean,
                          },
                        })
                      }
                    />
                    <label
                      htmlFor="reverse"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable Reverse Image Search
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="geolocation"
                      checked={formData.options.enableGeolocation}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          options: {
                            ...formData.options,
                            enableGeolocation: checked as boolean,
                          },
                        })
                      }
                    />
                    <label
                      htmlFor="geolocation"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable Geolocation Verification
                    </label>
                  </div>

                  {/* Deepfake - DISABLED */}
                  <div className="flex items-center space-x-2 opacity-50">
                    <Checkbox
                      id="deepfake"
                      checked={false}
                      disabled
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="deepfake"
                        className="text-sm font-medium leading-none cursor-not-allowed text-gray-400"
                      >
                        Enable Deepfake Detection
                      </label>
                      <p className="text-xs text-gray-400 mt-1">
                        Coming soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Webhook URL */}
              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook URL (optional)</Label>
                <Input
                  id="webhook"
                  type="url"
                  placeholder="https://example.com/webhook"
                  value={formData.webhookUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, webhookUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </DialogFooter>
          </>
        )}

        {/* Step 2: File Selection */}
        {step === "files" && (
          <>
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
              <DialogDescription>
                Step 2 of 3: Select files to upload
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <FileDropzone files={files} onFilesChange={setFiles} />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={files.length === 0}>
                Upload Files
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 3: Uploading */}
        {step === "uploading" && (
          <>
            <DialogHeader>
              <DialogTitle>Uploading Files</DialogTitle>
              <DialogDescription>
                Step 3 of 3: Uploading to secure storage
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Overall Progress</span>
                  <span className="font-bold">
                    {
                      uploadProgress.filter((p) => p.status === "completed")
                        .length
                    }
                    /{uploadProgress.length}
                  </span>
                </div>
                <Progress
                  value={
                    (uploadProgress.filter((p) => p.status === "completed")
                      .length /
                      uploadProgress.length) *
                    100
                  }
                />
              </div>

              {/* File Progress */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {uploadProgress.map((progress) => (
                  <div
                    key={progress.filename}
                    className="p-3 bg-gray-50 rounded-md border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-lg">
                          {getFileIcon(
                            files.find((f) => f.name === progress.filename)
                              ?.type || "",
                          )}
                        </span>
                        <p className="text-sm font-medium truncate">
                          {progress.filename}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {progress.status === "uploading" && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        )}
                        {progress.status === "completed" && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        {progress.status === "failed" && (
                          <span className="text-red-600 text-xs">Failed</span>
                        )}
                      </div>
                    </div>
                    {progress.status === "uploading" && (
                      <Progress value={progress.progress} className="h-1" />
                    )}
                    {progress.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {progress.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                ⚠️ Do not close this window while uploading
              </div>
            </div>
          </>
        )}

        {/* Step 4: Complete */}
        {step === "complete" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Upload Complete!
              </DialogTitle>
            </DialogHeader>

            <div className="py-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  {files.length} files uploaded successfully
                </p>
                <p className="text-sm text-gray-600">
                  Processing will begin shortly
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-left text-sm text-gray-700">
                <p className="font-semibold mb-2">What happens next?</p>
                <ul className="space-y-1">
                  <li>• Files are being verified and processed</li>
                  <li>• You'll see real-time progress updates</li>
                  <li>• Results will be available when complete</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  router.push(`/dashboard/batches/${createdBatchId}`);
                  handleClose();
                }}
              >
                View Batch Details
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
