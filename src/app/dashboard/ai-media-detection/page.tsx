import { Suspense } from "react";
import { AIMediaDetectionWorkspace } from "@/components/ai-media-detection/AIMediaDetectionWorkspace";

export default function AIMediaDetectionPage() {
  return (
    <Suspense>
      <AIMediaDetectionWorkspace />
    </Suspense>
  );
}
