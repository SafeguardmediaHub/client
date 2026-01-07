import type { VerificationData } from '../VerificationRegistry';
import { ClaimList } from '../../../fact-check/ClaimList';
import type { Claim } from '@/types/fact-check';

interface FactCheckRendererProps {
  data: VerificationData;
}

export function FactCheckRenderer({ data }: FactCheckRendererProps) {
  // Safe cast for fullData
  const fullData = data.fullData as any;
  const claims = (fullData?.claims || []) as Claim[];
  const summary = fullData?.summary;

  return (
    <div className="space-y-3">
      {claims.length > 0 ? (
        <ClaimList
          claims={claims}
          summary={summary}
          onViewDetails={(id: string) => console.log('View detail', id)}
        />
      ) : (
        <div className="text-xs text-gray-500 text-center py-4">
          No fact-check claims available to display.
        </div>
      )}
    </div>
  );
}
