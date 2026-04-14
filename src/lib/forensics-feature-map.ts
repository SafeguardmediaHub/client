import { getFeatureById, type FeatureMetadata } from "@/lib/features";

export type ForensicsFeatureLink = {
  featureId: string;
  href?: string;
  status: "supported" | "coming_soon" | "unsupported";
  title: string;
  description?: string;
  metadata?: FeatureMetadata;
};

const UNSUPPORTED_FEATURES: Record<
  string,
  Omit<ForensicsFeatureLink, "featureId">
> = {
  "authenticity.metadata": {
    status: "unsupported",
    title: "Metadata verification",
    description: "This forensic follow-up does not have a dedicated frontend workflow yet.",
  },
  "ocr.image": {
    status: "coming_soon",
    title: "OCR extraction",
    description: "OCR is not available in this workflow yet.",
  },
};

const FEATURE_ID_TO_CLIENT_FEATURE: Record<string, string> = {
  "authenticity.c2pa": "c2pa_overview",
  "content_verification.reverse_lookup": "reverse_lookup",
  "content_verification.keyframe_extraction": "keyframe_extraction",
  "ai_detection.image": "ai_generated_media_detection",
  "ai_detection.audio": "ai_generated_media_detection",
  "ai_detection.video": "ai_generated_media_detection",
};

const FEATURE_ID_TO_HREF: Record<string, string> = {
  "authenticity.c2pa": "/dashboard/authenticity",
  "content_verification.reverse_lookup": "/dashboard/reverse",
  "content_verification.keyframe_extraction": "/dashboard/keyframe",
  "ai_detection.image": "/dashboard/ai-media-detection?media=image",
  "ai_detection.audio": "/dashboard/ai-media-detection?media=audio",
  "ai_detection.video": "/dashboard/ai-media-detection?media=video",
};

export function getForensicsFeatureLink(
  featureId?: string | null,
): ForensicsFeatureLink | null {
  if (!featureId) {
    return null;
  }

  const clientFeatureId = FEATURE_ID_TO_CLIENT_FEATURE[featureId];
  if (clientFeatureId) {
    const metadata = getFeatureById(clientFeatureId);

    return {
      featureId,
      href: FEATURE_ID_TO_HREF[featureId] || metadata?.url,
      status: metadata?.status === "available" ? "supported" : "coming_soon",
      title: metadata?.name || featureId,
      description: metadata?.description,
      metadata,
    };
  }

  const fallback = UNSUPPORTED_FEATURES[featureId];
  if (fallback) {
    return {
      featureId,
      ...fallback,
    };
  }

  return {
    featureId,
    status: "unsupported",
    title: featureId,
    description: "This forensic follow-up is not mapped to a frontend workflow yet.",
  };
}
