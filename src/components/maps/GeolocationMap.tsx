'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface Marker {
  type: string;
  coordinates: Coordinates;
  label: string;
}

interface MapData {
  centerCoordinates: Coordinates;
  zoom: number;
  markers: Marker[];
}

interface GeolocationMapProps {
  mapData: MapData;
  className?: string;
}

// Declare google as a global variable for TypeScript
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const GeolocationMap = ({ mapData, className = '' }: GeolocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Check if API key exists
    if (!apiKey) {
      setError('Google Maps API key not configured');
      setIsLoading(false);
      return;
    }

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeMap();
    };
    script.onerror = () => {
      setError('Failed to load Google Maps');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup markers
      markersRef.current.forEach((marker) => {
        if (marker.setMap) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
    };
  }, [apiKey, mapData]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      // Create map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: mapData.centerCoordinates,
        zoom: mapData.zoom || 12,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      googleMapRef.current = map;

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Add markers
      mapData.markers.forEach((markerData) => {
        const marker = new window.google.maps.Marker({
          position: markerData.coordinates,
          map: map,
          title: markerData.label,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor:
              markerData.type === 'claimed'
                ? '#3B82F6' // Blue for claimed
                : markerData.type === 'gps'
                ? '#EF4444' // Red for GPS
                : '#10B981', // Green for others
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
          label: {
            text: markerData.type === 'claimed' ? 'C' : markerData.type === 'gps' ? 'G' : 'M',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 'bold',
          },
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #111827;">
                ${markerData.label}
              </h3>
              <p style="margin: 0; font-size: 12px; color: #6B7280;">
                Lat: ${markerData.coordinates.lat.toFixed(6)}<br/>
                Lng: ${markerData.coordinates.lng.toFixed(6)}
              </p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          // Close all other info windows
          markersRef.current.forEach((m) => {
            if (m.infoWindow) {
              m.infoWindow.close();
            }
          });
          infoWindow.open(map, marker);
        });

        marker.infoWindow = infoWindow;
        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers if there are multiple
      if (mapData.markers.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        mapData.markers.forEach((marker) => {
          bounds.extend(marker.coordinates);
        });
        map.fitBounds(bounds);

        // Add some padding
        const listener = window.google.maps.event.addListener(map, 'idle', () => {
          if (map.getZoom() > mapData.zoom) {
            map.setZoom(mapData.zoom);
          }
          window.google.maps.event.removeListener(listener);
        });
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }
  };

  const handleOpenInGoogleMaps = () => {
    const { lat, lng } = mapData.centerCoordinates;
    const url = `https://www.google.com/maps?q=${lat},${lng}&z=${mapData.zoom}`;
    window.open(url, '_blank');
  };

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 ${className}`}>
        <div className="flex flex-col items-center text-center gap-3">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Map Unavailable
            </h3>
            <p className="text-xs text-gray-600">{error}</p>
            {!apiKey && (
              <p className="text-xs text-gray-500 mt-2">
                Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment
                variables
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-96 rounded-lg" />
      <button
        type="button"
        onClick={handleOpenInGoogleMaps}
        className="absolute bottom-3 left-3 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open in Google Maps
      </button>
    </div>
  );
};

export default GeolocationMap;
