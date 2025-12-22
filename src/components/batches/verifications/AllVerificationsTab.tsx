import type { BatchItemDetails } from '@/types/batch';
import { VerificationSection } from './VerificationSection';
import { getAvailableVerifications, getVerificationData } from './VerificationRegistry';
import {
  IntegrityAnalysisRenderer,
  C2PARenderer,
  TimelineRenderer,
  OCRRenderer,
  GeolocationRenderer,
  DeepfakeRenderer,
  FactCheckRenderer,
} from './renderers';

interface AllVerificationsTabProps {
  itemDetails: BatchItemDetails;
}

// Map verification IDs to their renderer components
const RENDERERS: Record<string, React.ComponentType<{ data: any }>> = {
  integrityAnalysis: IntegrityAnalysisRenderer,
  c2pa: C2PARenderer,
  timeline: TimelineRenderer,
  ocr: OCRRenderer,
  geolocation: GeolocationRenderer,
  deepfake: DeepfakeRenderer,
  factCheck: FactCheckRenderer,
};

export function AllVerificationsTab({ itemDetails }: AllVerificationsTabProps) {
  const availableVerifications = getAvailableVerifications(itemDetails);

  if (availableVerifications.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No verifications available for this item</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {availableVerifications.map((meta) => {
        const data = getVerificationData(itemDetails, meta.id);
        if (!data) return null;

        const Renderer = RENDERERS[meta.id];
        const hasRenderer = !!Renderer;

        return (
          <VerificationSection
            key={meta.id}
            meta={meta}
            data={data}
            defaultExpanded={false}
          >
            {hasRenderer ? <Renderer data={data} /> : null}
          </VerificationSection>
        );
      })}
    </div>
  );
}
