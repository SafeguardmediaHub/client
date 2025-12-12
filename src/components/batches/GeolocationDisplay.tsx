'use client';

import { ExternalLink, MapPin, Calendar, Camera } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { GeolocationFull } from '@/types/batch';
import {
  formatCoordinates,
  generateStaticMapUrl,
  generateGoogleMapsLink,
  formatDate,
} from '@/lib/batch-utils';

interface GeolocationDisplayProps {
  geolocation: GeolocationFull;
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
}

export function GeolocationDisplay({
  geolocation,
  metadata,
}: GeolocationDisplayProps) {
  const hasGpsData = !!geolocation.extractedCoordinates;

  if (!hasGpsData || !geolocation.extractedCoordinates) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">
            Geolocation Data
          </h3>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
          <p className="text-sm text-gray-600">
            No GPS coordinates found in file metadata
          </p>
        </div>
      </Card>
    );
  }

  const { lat, lng, source } = geolocation.extractedCoordinates;
  const address = geolocation.geocoding?.reverseGeocode?.address;
  const components = geolocation.geocoding?.reverseGeocode?.components;
  const mapUrl = generateStaticMapUrl(lat, lng, geolocation.mapData.zoom);
  const mapsLink = generateGoogleMapsLink(lat, lng);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Geolocation Data
        </h3>
        <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          GPS Found
        </span>
      </div>

      <div className="space-y-4">
        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Coordinates</p>
            <p className="text-sm text-gray-900 font-mono">
              {formatCoordinates(lat, lng)}
            </p>
            <p className="text-xs text-gray-500">
              Source: {source.toUpperCase()}
            </p>
          </div>

          {metadata?.gps?.altitude && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Altitude</p>
              <p className="text-sm text-gray-900">
                {metadata.gps.altitude.toFixed(1)} meters
              </p>
            </div>
          )}
        </div>

        {/* Address */}
        {address && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-sm text-gray-900">{address}</p>
            {components && (
              <div className="flex flex-wrap gap-2 mt-2">
                {components.city && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    {components.city}
                  </span>
                )}
                {components.state && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    {components.state}
                  </span>
                )}
                {components.country && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    {components.country}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Camera Info */}
        {(metadata?.cameraMake || metadata?.cameraModel || metadata?.datetimeOriginal) && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-500">Camera Information</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {(metadata.cameraMake || metadata.cameraModel) && (
                <div>
                  <p className="text-gray-500">Device</p>
                  <p className="text-gray-900">
                    {metadata.cameraMake} {metadata.cameraModel}
                  </p>
                </div>
              )}
              {metadata.datetimeOriginal && (
                <div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <p>Date Taken</p>
                  </div>
                  <p className="text-gray-900">
                    {new Date(metadata.datetimeOriginal).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Static Map */}
        {mapUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Map Location</p>
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={mapUrl}
                alt="Location map"
                className="w-full h-auto"
                loading="lazy"
              />
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 flex items-center gap-1 px-3 py-2 bg-white rounded-md shadow-md hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                View in Google Maps
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* Processing Info */}
        <div className="border-t pt-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            Processing time: {geolocation.processingTime}ms
          </span>
          {geolocation.geocoding?.reverseGeocode?.provider && (
            <span>
              Provider: {geolocation.geocoding.reverseGeocode.provider}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
