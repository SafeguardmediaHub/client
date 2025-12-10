import type { VerificationData } from '../VerificationRegistry';

interface DeepfakeRendererProps {
  data: VerificationData;
}

export function DeepfakeRenderer({ data }: DeepfakeRendererProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-500 text-center py-4">
        Deepfake detection details will be displayed here when available
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
