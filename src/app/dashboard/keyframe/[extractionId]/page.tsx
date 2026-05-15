"use client";

import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FeatureInfoDialog, FEATURE_INFO } from "@/components/FeatureInfoDialog";
import { ExtractionView } from "@/components/keyframe/ExtractionView";
import { Button } from "@/components/ui/button";

const KeyframeExtractionDetail = () => {
  const params = useParams();
  const router = useRouter();
  const extractionId = (params?.extractionId as string) || "";

  const [showInfoDialog, setShowInfoDialog] = useState(false);

  return (
    <section className="flex flex-1 flex-col gap-4 py-4 px-8">
      <header className="flex-col items-start gap-1 flex">
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/keyframe"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Keyframe Extraction
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">Extraction</span>
            </div>
            <h1 className="text-2xl font-medium text-black leading-9">
              Extraction Details
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/keyframe")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfoDialog(true)}
              className="cursor-pointer"
            >
              <Info className="size-4 mr-2" />
              How it works
            </Button>
          </div>
        </div>
      </header>

      <FeatureInfoDialog
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
        featureInfo={FEATURE_INFO.keyframe}
      />

      <ExtractionView
        extractionId={extractionId}
        onRetry={() => router.push("/dashboard/keyframe")}
      />
    </section>
  );
};

export default KeyframeExtractionDetail;
