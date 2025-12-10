import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { VerificationData } from '../VerificationRegistry';

interface GeolocationRendererProps {
  data: VerificationData;
}

export function GeolocationRenderer({ data }: GeolocationRendererProps) {
  const summary = data.summary as { lat?: number; lon?: number } | undefined;

  return (
    <div className="space-y-3">
      {/* GPS Coordinates */}
      {summary?.lat && summary?.lon && (
        <Card className="p-3 bg-white">
          <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            GPS Coordinates
          </h4>
          <div className="text-sm">
            <p className="font-mono text-gray-900">
              {summary.lat.toFixed(6)}, {summary.lon.toFixed(6)}
            </p>
          </div>
        </Card>
      )}

      {/* Placeholder for future geolocation details */}
      <div className="text-xs text-gray-500 text-center py-4">
        Full geolocation verification details will be displayed here when available
      </div>
    </div>
  );
}
