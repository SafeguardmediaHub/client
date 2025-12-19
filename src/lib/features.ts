import type { LucideIcon } from "lucide-react";

export type FeatureStatus =
  | "available"
  | "coming_soon"
  | "in_development"
  | "beta";

export interface FeatureMetadata {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  url?: string;
  icon?: LucideIcon;
  category:
    | "detection"
    | "verification"
    | "reporting"
    | "overview"
    | "authenticity";
  estimatedRelease?: string; // e.g., "Q1 2025", "March 2025"
  benefits?: string[];
  comingSoonMessage?: string;
}

export const FEATURES: Record<string, FeatureMetadata> = {
  // Overview
  dashboard: {
    id: "dashboard",
    name: "Dashboard",
    description:
      "Your central hub for media verification activities and insights.",
    status: "available",
    url: "/dashboard",
    category: "overview",
  },
  library: {
    id: "library",
    name: "Library",
    description: "Manage and organize your uploaded media files.",
    status: "available",
    url: "/dashboard/library",
    category: "overview",
  },
  authenticity_check: {
    id: "authenticity_check",
    name: "Authenticity Check",
    description:
      "Comprehensive media integrity verification including metadata analysis, cryptographic verification, and forensic examination.",
    status: "available",
    url: "/dashboard/authenticity-check",
    category: "overview",
    benefits: [
      "Multi-layered integrity verification",
      "Metadata and EXIF analysis",
      "Cryptographic signature validation",
      "Forensic tampering detection",
      "Comprehensive findings report",
    ],
  },

  // Detection Tools
  deepfake_detection: {
    id: "deepfake_detection",
    name: "Deepfake Detection",
    description:
      "Detect AI-generated faces, voice cloning, and manipulated videos using advanced neural network analysis.",
    status: "coming_soon",
    category: "detection",
    estimatedRelease: "Q2 2025",
    benefits: [
      "Detect AI-generated faces and deepfake videos",
      "Identify voice cloning and audio manipulation",
      "Advanced neural network-based analysis",
      "Frame-by-frame deepfake probability scoring",
    ],
    comingSoonMessage:
      "Our AI research team is training advanced models to detect the latest deepfake techniques. This feature will launch in Q2 2025.",
  },
  cheapfake_detection: {
    id: "cheapfake_detection",
    name: "Cheapfake Detection",
    description:
      "Identify low-tech manipulations like speed changes, selective editing, and out-of-context media.",
    status: "coming_soon",
    category: "detection",
    estimatedRelease: "Q2 2025",
    benefits: [
      "Detect speed manipulation and slow-motion edits",
      "Identify selective editing and context removal",
      "Find out-of-context or misattributed content",
      "Audio-video synchronization analysis",
    ],
    comingSoonMessage:
      "Cheapfake detection focuses on low-tech but effective manipulation techniques. Coming Q2 2025.",
  },
  visual_forensics: {
    id: "visual_forensics",
    name: "Visual Forensics",
    description:
      "Advanced image forensics including JPEG analysis, noise patterns, and pixel-level manipulation detection.",
    status: "in_development",
    category: "detection",
    estimatedRelease: "March 2025",
    benefits: [
      "JPEG compression analysis",
      "Noise pattern inconsistency detection",
      "Copy-move and clone detection",
      "Metadata extraction and validation",
      "Error Level Analysis (ELA)",
    ],
    comingSoonMessage:
      "Visual forensics is currently in development. Our team is implementing state-of-the-art forensic algorithms. Expected launch: March 2025.",
  },
  audio_forensics: {
    id: "audio_forensics",
    name: "Audio Forensics",
    description:
      "Advanced audio forensic analysis including noise profiling, authenticity verification, and manipulation detection.",
    status: "in_development",
    category: "detection",
    estimatedRelease: "April 2025",
    benefits: [
      "ENF (Electric Network Frequency) analysis for timestamp/location verification",
      "Background noise consistency and profiling",
      "Compression artifact detection (MP3, AAC, etc.)",
      "Audio tampering/splicing detection",
      "Metadata extraction and validation",
      "Voice activity and silence pattern analysis",
    ],
    comingSoonMessage:
      "Audio forensics is currently in development. Our team is building robust algorithms for authenticity and manipulation detection. Expected launch: April 2025.",
  },
  tamper_detection: {
    id: "tamper_detection",
    name: "Tamper Detection",
    description:
      "Detect image splicing, copy-paste manipulation, and content-aware editing using forensic signatures.",
    status: "in_development",
    category: "detection",
    estimatedRelease: "March 2025",
    benefits: [
      "Image splicing and composition detection",
      "Copy-paste manipulation identification",
      "Content-aware fill detection",
      "Forensic signature analysis",
    ],
    comingSoonMessage:
      "Tamper detection uses cutting-edge forensic analysis. In active development for March 2025 release.",
  },
  keyframe_extraction: {
    id: "keyframe_extraction",
    name: "Keyframe Extraction",
    description:
      "Extract and analyze key frames from videos for efficient content review and verification.",
    status: "available",
    url: "/dashboard/keyframe",
    category: "detection",
  },

  // Verification Tools
  reverse_lookup: {
    id: "reverse_lookup",
    name: "Reverse Lookup",
    description:
      "Search for similar images and videos across the web to find original sources and previous uses.",
    status: "available",
    url: "/dashboard/reverse",
    category: "verification",
  },
  geolocation_verification: {
    id: "geolocation_verification",
    name: "Geolocation Verification",
    description:
      "Verify the location where media was captured using landmarks, shadows, and metadata analysis.",
    status: "available",
    url: "/dashboard/geolocation",
    category: "verification",
  },
  timeline_verification: {
    id: "timeline_verification",
    name: "Timeline Verification",
    description:
      "Verify when media was created using metadata, astronomical data, and temporal clues.",
    status: "available",
    url: "/dashboard/timeline",
    category: "verification",
  },
  ocr_extraction: {
    id: "ocr_extraction",
    name: "Text Extraction (OCR)",
    description:
      "Extract and analyze text from images and videos for fact-checking and content verification.",
    status: "coming_soon",
    category: "verification",
    estimatedRelease: "Q1 2025",
    benefits: [
      "Extract text from images and video frames",
      "Multi-language support (100+ languages)",
      "Handwriting recognition",
      "Text translation and analysis",
    ],
    comingSoonMessage:
      "OCR extraction will help you analyze text content in images and videos. Coming Q1 2025.",
  },
  fact_checking: {
    id: "fact_checking",
    name: "Fact Checking",
    description:
      "Verify claims and statements using trusted fact-checking databases and sources.",
    status: "available",
    url: "/dashboard/fact-check",
    category: "verification",
  },
  social_media_tracing: {
    id: "social_media_tracing",
    name: "Social Media Source Tracing",
    description:
      "Track how media spreads across social platforms and identify distribution patterns.",
    status: "available",
    url: "/dashboard/trace",
    category: "verification",
  },

  // Reporting
  reports_generation: {
    id: "reports_generation",
    name: "Reports Generation",
    description:
      "Create comprehensive verification reports with evidence and analysis.",
    status: "available",
    url: "/dashboard/reporting",
    category: "reporting",
  },
  team_collaboration: {
    id: "team_collaboration",
    name: "Team Collaboration",
    description:
      "Collaborate with your team on verification projects, share findings, and manage workflows.",
    status: "coming_soon",
    category: "reporting",
    estimatedRelease: "Q2 2025",
    benefits: [
      "Real-time collaboration on verification cases",
      "Team workspaces and project management",
      "Role-based access control",
      "Shared evidence library",
      "Activity tracking and audit logs",
    ],
    comingSoonMessage:
      "Team collaboration features are being designed for newsrooms and verification teams. Coming Q2 2025.",
  },

  // Authenticity (C2PA)
  c2pa_overview: {
    id: "c2pa_overview",
    name: "Authenticity Overview",
    description:
      "View and manage all C2PA content authenticity verifications with detailed status tracking.",
    status: "available",
    url: "/dashboard/authenticity",
    category: "authenticity",
  },
  c2pa_verify: {
    id: "c2pa_verify",
    name: "Manual Verification",
    description:
      "Manually verify media files for C2PA content credentials and authenticity markers.",
    status: "available",
    url: "/dashboard/authenticity/verify",
    category: "authenticity",
  },
  c2pa_badges: {
    id: "c2pa_badges",
    name: "Authenticity Badges",
    description:
      "Browse and manage C2PA authenticity badges for verified content.",
    status: "available",
    url: "/dashboard/authenticity/badges",
    category: "authenticity",
  },
  c2pa_admin: {
    id: "c2pa_admin",
    name: "Admin Panel",
    description:
      "Administrative dashboard for C2PA verification system monitoring and management.",
    status: "available",
    url: "/dashboard/authenticity/admin",
    category: "authenticity",
  },
};

export const getFeatureById = (id: string): FeatureMetadata | undefined => {
  return FEATURES[id];
};

export const getFeaturesByCategory = (
  category: FeatureMetadata["category"]
): FeatureMetadata[] => {
  return Object.values(FEATURES).filter((f) => f.category === category);
};

export const getFeaturesByStatus = (
  status: FeatureStatus
): FeatureMetadata[] => {
  return Object.values(FEATURES).filter((f) => f.status === status);
};

export const isFeatureAvailable = (id: string): boolean => {
  const feature = getFeatureById(id);
  return feature?.status === "available" || feature?.status === "beta";
};
