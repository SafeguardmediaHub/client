import { Suspense } from "react";
import { FactCheckPageClient } from "@/components/fact-check/FactCheckPageClient";
import { LoadingState } from "@/components/fact-check/LoadingState";

export default function FactCheckPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading fact-check..." />}>
      <FactCheckPageClient />
    </Suspense>
  );
}
