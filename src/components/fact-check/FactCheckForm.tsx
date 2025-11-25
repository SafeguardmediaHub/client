"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AnalyzeContentRequest, ContentType } from "@/types/fact-check";

interface FactCheckFormProps {
  onSubmit: (data: AnalyzeContentRequest) => void;
  isLoading?: boolean;
}

export const FactCheckForm = ({ onSubmit, isLoading }: FactCheckFormProps) => {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("text");
  const [mediaId, setMediaId] = useState("");
  const [errors, setErrors] = useState<{
    content?: string;
    contentType?: string;
    mediaId?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate content length
    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length < 50) {
      newErrors.content =
        "Content must be at least 50 characters long for accurate fact-checking";
    } else if (content.length > 5000) {
      newErrors.content = "Content must not exceed 5000 characters";
    }

    // Validate content type
    if (
      !["text", "ocr", "transcript", "user_submission"].includes(contentType)
    ) {
      newErrors.contentType = "Invalid content type";
    }

    // Validate media_id if provided (must be 24-char hex)
    if (mediaId && !/^[a-fA-F0-9]{24}$/.test(mediaId)) {
      newErrors.mediaId = "Media ID must be a 24-character hexadecimal string";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: AnalyzeContentRequest = {
      content: content.trim(),
      content_type: contentType,
    };

    if (mediaId.trim()) {
      payload.media_id = mediaId.trim();
    }

    onSubmit(payload);
  };

  const characterCount = content.length;
  const isValid = characterCount >= 50 && characterCount <= 5000;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-medium text-gray-700">
          Content to Fact-Check <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            // Clear content error on change
            if (errors.content) {
              setErrors((prev) => ({ ...prev, content: undefined }));
            }
          }}
          placeholder="Enter the text you want to fact-check. Minimum 50 characters, maximum 5000 characters."
          className={`w-full min-h-[200px] p-4 border rounded-lg resize-y focus:outline-none focus:ring-2 transition-colors ${
            errors.content
              ? "border-red-300 focus:ring-red-200 bg-red-50"
              : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
          }`}
          disabled={isLoading}
        />
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {errors.content ? (
              <span className="text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.content}
              </span>
            ) : (
              <span className="text-gray-500">
                Character count: {characterCount} / 5000
              </span>
            )}
          </div>
          <div
            className={`font-medium ${
              isValid ? "text-green-600" : "text-gray-400"
            }`}
          >
            {characterCount < 50
              ? `${50 - characterCount} more characters needed`
              : "Ready to submit"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="contentType"
            className="text-sm font-medium text-gray-700"
          >
            Content Type <span className="text-red-500">*</span>
          </Label>
          <select
            id="contentType"
            value={contentType}
            onChange={(e) => {
              setContentType(e.target.value as ContentType);
              if (errors.contentType) {
                setErrors((prev) => ({ ...prev, contentType: undefined }));
              }
            }}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.contentType
                ? "border-red-300 focus:ring-red-200 bg-red-50"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
            }`}
            disabled={isLoading}
          >
            <option value="text">Text (Direct Input)</option>
            <option value="ocr">OCR (Extracted from Image)</option>
            <option value="transcript">Transcript (Audio/Video)</option>
            <option value="user_submission">User Submission</option>
          </select>
          {errors.contentType && (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.contentType}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="mediaId"
            className="text-sm font-medium text-gray-700"
          >
            Media ID (Optional)
          </Label>
          <input
            type="text"
            id="mediaId"
            value={mediaId}
            onChange={(e) => {
              setMediaId(e.target.value);
              if (errors.mediaId) {
                setErrors((prev) => ({ ...prev, mediaId: undefined }));
              }
            }}
            placeholder="24-character hexadecimal ID"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.mediaId
                ? "border-red-300 focus:ring-red-200 bg-red-50"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
            }`}
            disabled={isLoading}
          />
          {errors.mediaId ? (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.mediaId}
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              Optional: Link this fact-check to a media file
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading || !isValid}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Analyzing..." : "Start Fact-Check"}
        </Button>
        {content && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setContent("");
              setMediaId("");
              setErrors({});
            }}
            disabled={isLoading}
            className="cursor-pointer"
          >
            Clear
          </Button>
        )}
      </div>
    </form>
  );
};
