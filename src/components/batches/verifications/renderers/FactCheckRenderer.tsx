import type { VerificationData } from '../VerificationRegistry';

interface FactCheckRendererProps {
  data: VerificationData;
}

export function FactCheckRenderer({ data }: FactCheckRendererProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-500 text-center py-4">
        Fact-check results will be displayed here when available
      </div>

      {data.fullData ? (
        <div className="text-xs text-gray-400">
          <pre className="bg-white p-3 rounded border overflow-auto max-h-48">
            {JSON.stringify(data.fullData, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
