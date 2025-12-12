import { LucideIcon, Shield, Clock, Globe, Brain, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import type { BatchItemDetails } from '@/types/batch';

// Generic verification metadata
export interface VerificationMeta {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: {
    primary: string;
    bg: string;
    text: string;
  };
  priority: number; // Lower number = higher priority (shows first)
  extractData: (item: BatchItemDetails) => VerificationData | null;
  isAvailable: (item: BatchItemDetails) => boolean;
}

// Generic verification data structure
export interface VerificationData {
  status: string;
  score?: number;
  summary?: unknown;
  details?: unknown;
  fullData?: unknown;
  errors?: string[];
}

// Registry of all verification types
export const VERIFICATION_REGISTRY: Record<string, VerificationMeta> = {
  c2pa: {
    id: 'c2pa',
    label: 'C2PA Verification',
    description: 'Content authenticity and provenance verification',
    icon: Shield,
    color: {
      primary: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
    },
    priority: 1,
    isAvailable: (item) => !!(item.c2paSummary || item.c2paFull),
    extractData: (item) => {
      if (!item.c2paSummary && !item.c2paFull) return null;

      return {
        status: item.c2paSummary?.status || item.c2paFull?.result?.status || 'unknown',
        score: item.scores?.c2pa,
        summary: item.c2paSummary,
        details: item.c2paFull?.result,
        fullData: item.c2paFull,
      };
    },
  },

  timeline: {
    id: 'timeline',
    label: 'Timeline Verification',
    description: 'Historical timeline and source verification',
    icon: Clock,
    color: {
      primary: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
    },
    priority: 2,
    isAvailable: (item) => !!(item.timelineSummary || item.timelineFull),
    extractData: (item) => {
      if (!item.timelineSummary && !item.timelineFull) return null;

      return {
        status: item.timelineSummary?.status || item.timelineFull?.status || 'unknown',
        score: item.timelineSummary?.score || item.scores?.timeline,
        summary: item.timelineSummary,
        details: item.timelineFull,
        fullData: item.timelineFull,
      };
    },
  },

  geolocation: {
    id: 'geolocation',
    label: 'Geolocation Verification',
    description: 'Location metadata and GPS verification',
    icon: Globe,
    color: {
      primary: 'green',
      bg: 'bg-green-50',
      text: 'text-green-700',
    },
    priority: 3,
    isAvailable: (item) => !!(item.geolocationFull || item.geolocation || item.metadata?.gps),
    extractData: (item) => {
      if (!item.geolocationFull && !item.geolocation && !item.metadata?.gps) return null;

      return {
        status: item.geolocation?.status || 'completed',
        score: item.scores?.geolocation,
        summary: item.geolocation,
        details: {
          coordinates: item.geolocationFull?.extractedCoordinates,
          address: item.geolocationFull?.geocoding?.reverseGeocode,
          metadata: item.metadata,
        },
        fullData: item.geolocationFull,
      };
    },
  },

  deepfake: {
    id: 'deepfake',
    label: 'Deepfake Detection',
    description: 'AI-generated content and manipulation detection',
    icon: Brain,
    color: {
      primary: 'red',
      bg: 'bg-red-50',
      text: 'text-red-700',
    },
    priority: 4,
    isAvailable: (item) => !!(item.deepfakeFull || item.scores?.deepfake !== undefined),
    extractData: (item) => {
      if (!item.deepfakeFull && item.scores?.deepfake === undefined) return null;

      const deepfakeData = item.deepfakeFull as { status?: string } | undefined;

      return {
        status: deepfakeData?.status || 'completed',
        score: item.scores?.deepfake,
        fullData: item.deepfakeFull,
      };
    },
  },

  ocr: {
    id: 'ocr',
    label: 'OCR Text Extraction',
    description: 'Optical character recognition and text analysis',
    icon: FileText,
    color: {
      primary: 'amber',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
    },
    priority: 5,
    isAvailable: (item) => !!(item.ocrText || item.ocr),
    extractData: (item) => {
      if (!item.ocrText && !item.ocr) return null;

      return {
        status: item.verifications?.ocr || 'completed',
        score: item.ocr?.confidence || item.ocrConfidence,
        summary: {
          text: item.ocrText,
          language: item.ocr?.language,
          confidence: item.ocr?.confidence || item.ocrConfidence,
        },
      };
    },
  },

  factCheck: {
    id: 'factCheck',
    label: 'Fact Check',
    description: 'Claims verification and fact-checking analysis',
    icon: CheckCircle,
    color: {
      primary: 'teal',
      bg: 'bg-teal-50',
      text: 'text-teal-700',
    },
    priority: 6,
    isAvailable: (item) => !!item.factCheckFull,
    extractData: (item) => {
      if (!item.factCheckFull) return null;

      const factCheckData = item.factCheckFull as { status?: string } | undefined;

      return {
        status: factCheckData?.status || 'unknown',
        fullData: item.factCheckFull,
      };
    },
  },
};

// Helper to get available verifications for an item
export function getAvailableVerifications(item: BatchItemDetails): VerificationMeta[] {
  return Object.values(VERIFICATION_REGISTRY)
    .filter((meta) => meta.isAvailable(item))
    .sort((a, b) => a.priority - b.priority);
}

// Helper to get verification data
export function getVerificationData(
  item: BatchItemDetails,
  verificationId: string
): VerificationData | null {
  const meta = VERIFICATION_REGISTRY[verificationId];
  if (!meta) return null;
  return meta.extractData(item);
}

// Helper to get status badge variant
export function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes('verified') || normalizedStatus.includes('completed')) {
    return 'default';
  }
  if (normalizedStatus.includes('failed') || normalizedStatus.includes('tampered')) {
    return 'destructive';
  }
  return 'secondary';
}
