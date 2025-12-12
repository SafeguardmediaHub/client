import { MapPin, ExternalLink, Camera, Calendar, Mountain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { VerificationData } from '../VerificationRegistry';
import { formatCoordinates, generateGoogleMapsLink } from '@/lib/batch-utils';

interface GeolocationRendererProps {
  data: VerificationData;
}

export function GeolocationRenderer({ data }: GeolocationRendererProps) {
  const details = data.details as {
    coordinates?: {
      lat: number;
      lng: number;
      source: string;
    };
    address?: {
      address: string;
      components: {
        city?: string;
        state?: string;
        country?: string;
        country_code?: string;
      };
      provider: string;
    };
    metadata?: {
      cameraMake?: string;
      cameraModel?: string;
      datetimeOriginal?: string;
      gps?: {
        lat: number;
        lon: number;
        altitude?: number;
      };
    };
  } | undefined;

  const coordinates = details?.coordinates;
  const address = details?.address;
  const metadata = details?.metadata;

  if (!coordinates) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        No GPS coordinates found in file metadata
      </div>
    );
  }

  const { lat, lng, source } = coordinates;
  const mapsLink = generateGoogleMapsLink(lat, lng);

  return (
    <div className="space-y-4">
      {/* GPS Coordinates */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" />
            GPS Coordinates
          </h4>
          <Badge variant="secondary" className="text-xs">
            {source.toUpperCase()}
          </Badge>
        </div>
        <div className="bg-gray-50 rounded p-3 border border-gray-200">
          <p className="text-sm font-mono text-gray-900">
            {formatCoordinates(lat, lng)}
          </p>
          {metadata?.gps?.altitude && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
              <Mountain className="h-3 w-3" />
              <span>Altitude: {metadata.gps.altitude.toFixed(1)}m</span>
            </div>
          )}
        </div>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
        >
          View in Google Maps
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Reverse Geocoded Address */}
      {address && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900">Location</h4>
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <p className="text-sm text-gray-900">{address.address}</p>
          </div>
          {address.components && (
            <div className="flex flex-wrap gap-2">
              {address.components.city && (
                <Badge variant="outline" className="text-xs">
                  {address.components.city}
                </Badge>
              )}
              {address.components.state && (
                <Badge variant="outline" className="text-xs">
                  {address.components.state}
                </Badge>
              )}
              {address.components.country && (
                <Badge variant="outline" className="text-xs">
                  {address.components.country}
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {/* Camera Information */}
      {(metadata?.cameraMake || metadata?.cameraModel || metadata?.datetimeOriginal) && (
        <div className="space-y-2 border-t pt-3">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Camera className="h-4 w-4 text-gray-600" />
            Camera Information
          </h4>
          <div className="space-y-2 text-sm">
            {(metadata.cameraMake || metadata.cameraModel) && (
              <div className="flex justify-between">
                <span className="text-gray-600">Device:</span>
                <span className="font-medium text-gray-900">
                  {metadata.cameraMake} {metadata.cameraModel}
                </span>
              </div>
            )}
            {metadata.datetimeOriginal && (
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Date Taken:
                </span>
                <span className="font-medium text-gray-900">
                  {new Date(metadata.datetimeOriginal).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
