'use client';

import L from 'leaflet';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapMarker {
  type: string;
  coordinates: Coordinates;
  label: string;
}

interface MapData {
  centerCoordinates: Coordinates;
  zoom: number;
  markers: MapMarker[];
}

interface GeolocationMapProps {
  mapData: MapData;
  className?: string;
}

// Fix for default marker icons in Leaflet
// biome-ignore lint/suspicious/noExplicitAny: Leaflet's internal property access
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component to handle fit bounds when markers change
function MapBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 1) {
      const bounds = L.latLngBounds(
        markers.map((marker) => [
          marker.coordinates.lat,
          marker.coordinates.lng,
        ])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, markers]);

  return null;
}

// Create custom marker icon
const createCustomIcon = (type: string, label: string) => {
  const color =
    type === 'claimed'
      ? '#3B82F6' // Blue for claimed
      : type === 'gps'
      ? '#EF4444' // Red for GPS
      : '#10B981'; // Green for others

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        font-size: 10px;
        font-weight: bold;
        color: #FFFFFF;
      ">
        ${label}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const GeolocationMap = ({ mapData, className = '' }: GeolocationMapProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for consistency
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Create marker icons
  const markerIcons = useMemo(() => {
    return mapData.markers.map((marker) => {
      const label =
        marker.type === 'claimed' ? 'C' : marker.type === 'gps' ? 'G' : 'M';
      return createCustomIcon(marker.type, label);
    });
  }, [mapData.markers]);

  const handleOpenInMaps = () => {
    const { lat, lng } = mapData.centerCoordinates;
    // Open in OpenStreetMap
    const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=${mapData.zoom}`;
    window.open(url, '_blank');
  };

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
      <div className="w-full h-96 rounded-lg overflow-hidden">
        <MapContainer
          center={[
            mapData.centerCoordinates.lat,
            mapData.centerCoordinates.lng,
          ]}
          zoom={mapData.zoom || 12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapData.markers.length > 1 && (
            <MapBounds markers={mapData.markers} />
          )}
          {mapData.markers.map((marker, index) => (
            <Marker
              key={`${marker.coordinates.lat}-${marker.coordinates.lng}-${index}`}
              position={[marker.coordinates.lat, marker.coordinates.lng]}
              icon={markerIcons[index]}
            >
              <Popup>
                <div
                  style={{
                    padding: '8px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    {marker.label}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                    Lat: {marker.coordinates.lat.toFixed(6)}
                    <br />
                    Lng: {marker.coordinates.lng.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <button
        type="button"
        onClick={handleOpenInMaps}
        className="absolute bottom-3 left-3 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm z-[1000]"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open in OpenStreetMap
      </button>
    </div>
  );
};

export default GeolocationMap;
