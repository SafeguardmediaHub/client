import type { VerificationStatuses } from '@/types/batch';
import { VerificationBadge } from './VerificationBadge';

interface VerificationBadgesProps {
  verifications: VerificationStatuses;
  showLabels?: boolean;
}

const verificationLabels = {
  c2pa: 'C2PA',
  timeline: 'Timeline',
  geolocation: 'Location',
  factCheck: 'Fact Check',
  deepfake: 'Deepfake',
};

export function VerificationBadges({
  verifications,
  showLabels = false,
}: VerificationBadgesProps) {
  if (!verifications || Object.keys(verifications).length === 0) {
    return (
      <span className="text-xs text-gray-500">No verifications available</span>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Object.entries(verifications).map(([type, status]) => {
        if (!status) return null;
        return (
          <VerificationBadge
            key={type}
            status={status}
            label={
              verificationLabels[type as keyof typeof verificationLabels] || type
            }
            showLabel={showLabels}
          />
        );
      })}
    </div>
  );
}
