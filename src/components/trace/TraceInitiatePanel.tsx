"use client";

import { AlertCircle, Calendar as CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { InitiateTraceRequest, Platform, SearchDepth } from "@/types/trace";

interface TraceInitiatePanelProps {
  mediaId: string;
  onSubmit: (data: InitiateTraceRequest) => void;
  isLoading?: boolean;
}

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "twitter", label: "Twitter/X" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "reddit", label: "Reddit" },
];

const SEARCH_DEPTHS: { value: SearchDepth; label: string; description: string }[] = [
  {
    value: "shallow",
    label: "Shallow",
    description: "Quick scan of popular posts (~2-3 min)",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "Balanced search across platforms (~5-10 min)",
  },
  {
    value: "deep",
    label: "Deep",
    description: "Comprehensive analysis (~15-30 min)",
  },
];

// Map frontend search depth to backend expected values
const SEARCH_DEPTH_MAP: Record<SearchDepth, 1 | 2 | 3> = {
  shallow: 1,
  moderate: 2,
  deep: 3,
};

export const TraceInitiatePanel = ({
  mediaId,
  onSubmit,
  isLoading,
}: TraceInitiatePanelProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [searchDepth, setSearchDepth] = useState<SearchDepth>("moderate");
  const [maxResults, setMaxResults] = useState<number>(100);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<{
    platforms?: string;
    maxResults?: string;
    timeRange?: string;
  }>({});

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
    // Clear platform error when user selects
    if (errors.platforms) {
      setErrors((prev) => ({ ...prev, platforms: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate at least one platform selected
    if (selectedPlatforms.length === 0) {
      newErrors.platforms = "Please select at least one platform";
    }

    // Validate max results range
    if (maxResults < 1 || maxResults > 1000) {
      newErrors.maxResults = "Max results must be between 1 and 1000";
    }

    // Validate time range
    if (startDate && endDate && startDate > endDate) {
      newErrors.timeRange = "Start date must be before end date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: InitiateTraceRequest = {
      platforms: selectedPlatforms,
      searchDepth: SEARCH_DEPTH_MAP[searchDepth], // Map to backend expected value (1|2|3)
      maxResults,
      includeDeleted,
    };

    if (startDate || endDate) {
      payload.timeRange = {
        start: startDate?.toISOString(),
        end: endDate?.toISOString(),
      };
    }

    onSubmit(payload);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Pick a date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Platforms Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Platforms to Search <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.value}
              type="button"
              onClick={() => togglePlatform(platform.value)}
              className={cn(
                "px-4 py-2 rounded-lg border-2 transition-all cursor-pointer",
                selectedPlatforms.includes(platform.value)
                  ? "bg-blue-50 border-blue-500 text-blue-700 font-medium"
                  : "bg-white border-gray-300 text-gray-700 hover:border-gray-400",
              )}
              disabled={isLoading}
            >
              {platform.label}
            </button>
          ))}
        </div>
        {errors.platforms && (
          <span className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.platforms}
          </span>
        )}
        <p className="text-xs text-gray-500">
          Selected: {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search Depth */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Search Depth <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-3">
          {SEARCH_DEPTHS.map((depth) => (
            <label
              key={depth.value}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                searchDepth === depth.value
                  ? "bg-blue-50 border-blue-500"
                  : "bg-white border-gray-300 hover:border-gray-400",
              )}
            >
              <input
                type="radio"
                name="searchDepth"
                value={depth.value}
                checked={searchDepth === depth.value}
                onChange={(e) => setSearchDepth(e.target.value as SearchDepth)}
                className="mt-1 w-4 h-4 text-blue-600 cursor-pointer"
                disabled={isLoading}
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{depth.label}</div>
                <div className="text-sm text-gray-600">{depth.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Max Results and Include Deleted */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxResults" className="text-sm font-medium text-gray-700">
            Maximum Results
          </Label>
          <input
            type="number"
            id="maxResults"
            value={maxResults}
            onChange={(e) => {
              setMaxResults(Number.parseInt(e.target.value, 10));
              if (errors.maxResults) {
                setErrors((prev) => ({ ...prev, maxResults: undefined }));
              }
            }}
            min={1}
            max={1000}
            step={1}
            className={cn(
              "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
              errors.maxResults
                ? "border-red-300 focus:ring-red-200 bg-red-50"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-500",
            )}
            disabled={isLoading}
          />
          {errors.maxResults ? (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.maxResults}
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              Number of posts to retrieve (1-1000)
            </span>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Options</Label>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(e) => setIncludeDeleted(e.target.checked)}
              className="w-4 h-4 text-blue-600 cursor-pointer"
              disabled={isLoading}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                Include Deleted Posts
              </div>
              <div className="text-xs text-gray-600">
                Search for removed/deleted content
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Time Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Time Range (Optional)
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-xs text-gray-600">
              Start Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal cursor-pointer",
                    !startDate && "text-muted-foreground",
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(startDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  disabled={(date) =>
                    date > new Date() || (endDate ? date > endDate : false)
                  }
                />
              </PopoverContent>
            </Popover>
            {startDate && (
              <button
                type="button"
                onClick={() => setStartDate(undefined)}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                disabled={isLoading}
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-xs text-gray-600">
              End Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal cursor-pointer",
                    !endDate && "text-muted-foreground",
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(endDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) =>
                    date > new Date() || (startDate ? date < startDate : false)
                  }
                />
              </PopoverContent>
            </Popover>
            {endDate && (
              <button
                type="button"
                onClick={() => setEndDate(undefined)}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                disabled={isLoading}
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
        {errors.timeRange && (
          <span className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.timeRange}
          </span>
        )}
        <p className="text-xs text-gray-500">
          Leave empty to search all available time periods
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isLoading || selectedPlatforms.length === 0}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Initiating Trace..." : "Start Social Media Trace"}
        </Button>
        {selectedPlatforms.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedPlatforms([]);
              setSearchDepth("moderate");
              setMaxResults(100);
              setIncludeDeleted(false);
              setStartDate(undefined);
              setEndDate(undefined);
              setErrors({});
            }}
            disabled={isLoading}
            className="cursor-pointer"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          How Social Media Tracing Works
        </h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Select platforms and configure search parameters</li>
          <li>Our system searches for appearances of your media across platforms</li>
          <li>Track the spread and distribution of your content</li>
          <li>Analyze suspicious patterns and forensic indicators</li>
        </ol>
      </div>
    </form>
  );
};
