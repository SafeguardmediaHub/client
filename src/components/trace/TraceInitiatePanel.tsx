"use client";

import { AlertCircle, Calendar as CalendarIcon, Info, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { InitiateTraceRequest, Platform, SearchDepth } from "@/types/trace";

interface TraceInitiatePanelProps {
  mediaId: string;
  onSubmit: (data: InitiateTraceRequest) => void;
  isLoading?: boolean;
}

const PLATFORMS: { value: Platform; label: string; disabled: boolean }[] = [
  { value: "youtube", label: "YouTube", disabled: false },
  { value: "twitter", label: "Twitter/X", disabled: true },
  { value: "facebook", label: "Facebook", disabled: true },
  { value: "instagram", label: "Instagram", disabled: true },
  { value: "tiktok", label: "TikTok", disabled: true },
  { value: "reddit", label: "Reddit", disabled: true },
];

const SEARCH_DEPTHS: { value: SearchDepth; label: string; description: string }[] = [
  {
    value: "shallow",
    label: "Shallow",
    description: "Surface-level scan of primary results.",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "Balanced search across multiple pages and metadata.",
  },
  {
    value: "deep",
    label: "Deep",
    description: "Exhaustive recursive search with historical analysis.",
  },
];

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
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["youtube"]);
  const [searchDepth, setSearchDepth] = useState<SearchDepth>("moderate");
  const [maxResults, setMaxResults] = useState<number>(100);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [enableVisualSearch, setEnableVisualSearch] = useState(true);
  const [visualThreshold, setVisualThreshold] = useState(0.75);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<{
    platforms?: string;
    maxResults?: string;
    timeRange?: string;
  }>({});

  const togglePlatform = (platform: Platform, disabled: boolean) => {
    if (disabled) return;
    
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
    if (errors.platforms) {
      setErrors((prev) => ({ ...prev, platforms: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (selectedPlatforms.length === 0) {
      newErrors.platforms = "Please select at least one platform";
    }

    if (maxResults < 1 || maxResults > 1000) {
      newErrors.maxResults = "Max results must be between 1 and 1000";
    }

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
      searchDepth: SEARCH_DEPTH_MAP[searchDepth],
      maxResults,
      includeDeleted,
      enableVisualSearch,
      visualVerificationThreshold: visualThreshold,
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Platforms Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          Source Platforms
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Currently only YouTube is available for tracing.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.value}
              type="button"
              onClick={() => togglePlatform(platform.value, platform.disabled)}
              className={cn(
                "px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2",
                platform.disabled
                  ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                  : selectedPlatforms.includes(platform.value)
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600",
              )}
              disabled={isLoading || platform.disabled}
            >
              <span className="text-sm font-medium">{platform.label}</span>
              {platform.disabled && <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 rounded uppercase font-bold">Soon</span>}
            </button>
          ))}
        </div>
        {errors.platforms && (
          <span className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.platforms}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Search Config */}
        <div className="space-y-6">
          {/* Search Depth */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-900">Search Intensity</Label>
            <div className="grid grid-cols-1 gap-2">
              {SEARCH_DEPTHS.map((depth) => (
                <label
                  key={depth.value}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                    searchDepth === depth.value
                      ? "bg-blue-50 border-blue-500 ring-2 ring-blue-100"
                      : "bg-white border-gray-100 hover:border-gray-300",
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
                    <div className="font-semibold text-gray-900 text-sm">{depth.label}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{depth.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Max Results */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="maxResults" className="text-sm font-semibold text-gray-900">
                Max Results
              </Label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {maxResults}
              </span>
            </div>
            <Slider
              value={[maxResults]}
              min={10}
              max={1000}
              step={10}
              onValueChange={(vals: number[]) => setMaxResults(vals[0])}
              disabled={isLoading}
              className="py-4"
            />
            <p className="text-[11px] text-gray-500">
              Higher limits provide more comprehensive results but take longer to process.
            </p>
          </div>
        </div>

        {/* Right Column: Advanced Options */}
        <div className="space-y-6">
          {/* Visual Search Section */}
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                  Visual Search Fallback
                </Label>
                <p className="text-xs text-blue-700 opacity-80">
                  Use AI vision to find content without direct platform API matches.
                </p>
              </div>
              <Switch
                checked={enableVisualSearch}
                onCheckedChange={setEnableVisualSearch}
                disabled={isLoading}
              />
            </div>

            {enableVisualSearch && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium text-blue-800">
                    Verification Confidence
                  </Label>
                  <span className="text-xs font-bold text-blue-700">
                    {Math.round(visualThreshold * 100)}%
                  </span>
                </div>
                <Slider
                  value={[visualThreshold]}
                  min={0.1}
                  max={0.99}
                  step={0.01}
                  onValueChange={(vals: number[]) => setVisualThreshold(vals[0])}
                  disabled={isLoading}
                />
                <div className="flex justify-between text-[10px] text-blue-600 font-medium">
                  <span>BROAD</span>
                  <span>STRICT</span>
                </div>
              </div>
            )}
          </div>

          {/* Time Range */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-900">Historical Window</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium text-gray-500 uppercase tracking-tight">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-200 rounded-xl h-11",
                        !startDate && "text-muted-foreground",
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
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
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium text-gray-500 uppercase tracking-tight">To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-200 rounded-xl h-11",
                        !endDate && "text-muted-foreground",
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
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
              </div>
            </div>
            {(startDate || endDate) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                }}
                className="text-xs h-7 text-gray-500 hover:text-red-500"
              >
                <X className="w-3 h-3 mr-1" /> Clear Date Range
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6 mt-4 border-t border-gray-100">
        <Button
          type="submit"
          disabled={isLoading || selectedPlatforms.length === 0}
          className="flex-1 py-6 bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Networks...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Search className="w-5 h-5" />
              <span>Initiate Deep Trace</span>
            </div>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSelectedPlatforms(["youtube"]);
            setSearchDepth("moderate");
            setMaxResults(100);
            setIncludeDeleted(false);
            setEnableVisualSearch(true);
            setVisualThreshold(0.75);
            setStartDate(undefined);
            setEndDate(undefined);
            setErrors({});
          }}
          disabled={isLoading}
          className="px-8 border-gray-200 text-gray-500 hover:bg-gray-50 rounded-2xl"
        >
          Reset
        </Button>
      </div>

      {/* Legend / Info */}
      <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
          <p className="text-[11px] text-gray-600">
            <strong>Cross-Platform Discovery:</strong> AI-powered matching across fragmented digital identifiers.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5" />
          <p className="text-[11px] text-gray-600">
            <strong>Chronological Mapping:</strong> Reconstructs the first appearance and subsequent spread velocity.
          </p>
        </div>
      </div>
    </form>
  );
};

