/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
"use client";

import {
  AlertCircle,
  CheckCircle,
  FileImage,
  FileText,
  Film,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface FeatureInfo {
  title: string;
  description: string;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  supportedMedia: {
    label: string;
    formats: string[];
  }[];
  howItWorks: string[];
  useCases: string[];
  tips?: string[];
}

interface FeatureInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureInfo: FeatureInfo;
  onGetStarted?: () => void;
}

export function FeatureInfoDialog({
  open,
  onOpenChange,
  featureInfo,
  onGetStarted,
}: FeatureInfoDialogProps) {
  const handleGetStarted = () => {
    onOpenChange(false);
    onGetStarted?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto px-5 py-4 sm:px-8 sm:py-6">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-2">
            <div
              className={`flex-shrink-0 size-12 sm:size-14 rounded-xl ${featureInfo.iconBgColor} flex items-center justify-center`}
            >
              <div className={featureInfo.iconColor}>{featureInfo.icon}</div>
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl sm:text-2xl mb-1 sm:mb-2">
                {featureInfo.title}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                {featureInfo.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-3 sm:py-4">
          {/* Supported Media */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
              <FileImage className="size-3.5 sm:size-4" />
              Supported Media Types
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {featureInfo.supportedMedia.map((media, index) => (
                <div
                  key={index}
                  className="p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-xs sm:text-sm font-medium text-blue-900 mb-1.5 sm:mb-2">
                    {media.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {media.formats.map((format, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-200/50 text-blue-900 text-xs font-medium rounded"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
              <CheckCircle className="size-3.5 sm:size-4" />
              How It Works
            </h3>
            <ol className="space-y-2">
              {featureInfo.howItWorks.map((step, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700"
                >
                  <span className="flex-shrink-0 size-5 sm:size-6 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
              <FileText className="size-3.5 sm:size-4" />
              Use Cases
            </h3>
            <ul className="space-y-2">
              {featureInfo.useCases.map((useCase, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-xs sm:text-sm text-gray-700"
                >
                  <CheckCircle className="size-3.5 sm:size-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          {featureInfo.tips && featureInfo.tips.length > 0 && (
            <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="text-xs sm:text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <AlertCircle className="size-3.5 sm:size-4" />
                Pro Tips
              </h3>
              <ul className="space-y-1">
                {featureInfo.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="text-xs sm:text-sm text-amber-800 pl-3 sm:pl-4 leading-relaxed"
                  >
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer w-full sm:w-auto"
          >
            Close
          </Button>
          {onGetStarted && (
            <Button
              onClick={handleGetStarted}
              className="cursor-pointer w-full sm:w-auto"
            >
              Get Started
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Pre-defined feature info for all features
export const FEATURE_INFO: Record<string, FeatureInfo> = {
  keyframe: {
    title: "Keyframe Extraction",
    description:
      "Intelligently extract the most important frames from videos for focused analysis and verification.",
    icon: <Film className="size-7" />,
    iconBgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    supportedMedia: [
      {
        label: "Video Files",
        formats: [
          "MP4",
          "MOV",
          "AVI",
          "MKV",
          "WebM",
          "FLV",
          "OGV",
          "WMV",
          "3GP",
          "MPG",
          "MPEG",
          "F4V",
        ],
      },
    ],
    howItWorks: [
      "Upload a video file from your device (up to 1GB)",
      "Our AI analyzes the video for significant visual changes",
      "Keyframes are extracted based on motion, lighting, and composition",
      "Preview all extracted frames in your browser",
      "Upload selected keyframes to your library for further analysis",
    ],
    useCases: [
      "Extract frames from video footage for reverse image lookup",
      "Analyze specific moments in video content for verification",
      "Create thumbnails and previews from long videos",
      "Identify scene changes and important visual moments",
      "Prepare video content for geolocation or C2PA verification",
    ],
    tips: [
      "Longer videos may take more time to process",
      "Extracted keyframes can be used with other verification features",
      "You can upload individual frames or all frames at once",
      "Keyframes are saved as high-quality JPEG images",
    ],
  },
  reverseLookup: {
    title: "Reverse Image Lookup",
    description:
      "Trace the origin and history of images across the internet to find original sources and detect manipulations.",
    icon: <ImageIcon className="size-7" />,
    iconBgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    supportedMedia: [
      {
        label: "Image Files Only",
        formats: ["JPG", "JPEG", "PNG", "WebP", "GIF"],
      },
    ],
    howItWorks: [
      "Select an image from your library",
      "The image is searched across multiple databases",
      "Matches are analyzed for similarity and context",
      "Results show where and when the image appeared online",
      "View detailed analysis with sources, dates, and similarity scores",
    ],
    useCases: [
      "Verify if an image has been manipulated or is from a different context",
      "Find the original source of viral images",
      "Detect if old images are being presented as new",
      "Identify instances of image misattribution",
      "Track the spread of misinformation through images",
    ],
    tips: [
      "Higher resolution images typically yield better results",
      "Videos must be converted to keyframes first",
      "Results may take 30-60 seconds depending on database size",
      "Check multiple matches for context verification",
    ],
  },
  geolocation: {
    title: "Geolocation Verification",
    description:
      "Verify claimed locations by analyzing GPS metadata and cross-referencing coordinates with real-world data.",
    icon: <FileImage className="size-7" />,
    iconBgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    supportedMedia: [
      {
        label: "Images with GPS Metadata",
        formats: ["JPG with EXIF", "PNG", "HEIC"],
      },
    ],
    howItWorks: [
      "Select an image from your library",
      "Enter the claimed location you want to verify",
      "GPS coordinates are extracted from image metadata (EXIF data)",
      "Coordinates are compared with the claimed location",
      "View results with map visualization and confidence score",
    ],
    useCases: [
      "Verify if photos were actually taken at claimed locations",
      "Detect location spoofing or metadata manipulation",
      "Confirm eyewitness accounts with photo evidence",
      "Validate user-generated content claims",
      "Cross-reference multiple photos from the same event",
    ],
    tips: [
      "Not all images contain GPS metadata - check EXIF data first",
      "Images from social media often have metadata stripped",
      "Screenshots and edited images typically lose GPS data",
      "Use keyframe extraction for videos to analyze specific moments",
    ],
  },
  factCheck: {
    title: "Fact-Check Analysis",
    description:
      "Extract and verify claims from text content using trusted fact-checking sources and databases.",
    icon: <FileText className="size-7" />,
    iconBgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    supportedMedia: [
      {
        label: "Text Content",
        formats: [
          "Pasted text (minimum 50 characters)",
          "Articles",
          "Social media posts",
          "News content",
        ],
      },
    ],
    howItWorks: [
      "Paste or type the text content you want to fact-check",
      "Our AI extracts verifiable claims from the text",
      "Each claim is cross-referenced with fact-checking databases",
      "Results show verdicts from trusted sources like PolitiFact, Snopes",
      "View detailed analysis with source links and confidence ratings",
    ],
    useCases: [
      "Verify claims in news articles and social media posts",
      "Check the accuracy of viral statements and quotes",
      "Analyze political speeches and debates",
      "Validate information before sharing",
      "Identify misinformation patterns across content",
    ],
    tips: [
      "Longer text with specific claims yields better results",
      "Vague or opinion-based content may not have verifiable claims",
      "Processing time depends on the number of claims extracted",
      "Check source credibility in the detailed results",
    ],
  },
  c2pa: {
    title: "C2PA Verification",
    description:
      "Verify media authenticity using C2PA (Coalition for Content Provenance and Authenticity) content credentials.",
    icon: <Video className="size-7" />,
    iconBgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    supportedMedia: [
      {
        label: "Images",
        formats: ["JPG", "PNG", "WebP"],
      },
      {
        label: "Videos",
        formats: ["MP4", "MOV", "WebM"],
      },
      {
        label: "Audio",
        formats: ["MP3", "WAV", "AAC"],
      },
    ],
    howItWorks: [
      "Select media from your library",
      "System scans for C2PA content credentials",
      "Certificate chain is validated for authenticity",
      "Content integrity is verified against the manifest",
      "View detailed provenance information and download reports",
    ],
    useCases: [
      "Verify if media has been created or edited by trusted sources",
      "Detect if content has been manipulated after creation",
      "Check the complete edit history and provenance chain",
      "Validate content from news organizations and verified creators",
      "Ensure media meets authenticity standards for journalism",
    ],
    tips: [
      "Only media with C2PA credentials can be verified",
      "Not all media files contain C2PA metadata",
      "C2PA adoption is growing among professional creators",
      "Check the certificate issuer for source credibility",
    ],
  },
  tamperDetection: {
    title: "Tamper Detection",
    description:
      "Analyze media files for signs of manipulation, metadata tampering, and integrity issues using forensic analysis.",
    icon: <FileImage className="size-7" />,
    iconBgColor: "bg-red-50",
    iconColor: "text-red-600",
    supportedMedia: [
      {
        label: "All Media Types",
        formats: ["Images", "Videos", "Audio"],
      },
    ],
    howItWorks: [
      "Select any media file from your library",
      "View automatically generated tamper detection analysis",
      "Review metadata integrity and completeness",
      "Check for signs of manipulation or tampering",
      "Examine detailed findings and suspicious indicators",
    ],
    useCases: [
      "Verify media file integrity and authenticity",
      "Detect metadata stripping or manipulation",
      "Identify missing or suspicious metadata fields",
      "Validate media before publishing or sharing",
      "Investigate potential content manipulation",
    ],
    tips: [
      "Analysis is performed automatically when media is uploaded",
      "Results are instant - no processing time required",
      "Works with all media types including images, videos, and audio",
      "Check the detailed reasons for any tampering flags",
    ],
  },
};
