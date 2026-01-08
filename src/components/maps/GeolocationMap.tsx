'use client';

import { ExternalLink, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

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

// Component to handle fit bounds when markers change
// This component must be rendered inside MapContainer to use useMap hook
function createMapBoundsComponent(
  markers: MapMarker[],
  // biome-ignore lint/suspicious/noExplicitAny: Leaflet types
  L: any,
  // biome-ignore lint/suspicious/noExplicitAny: React Leaflet hook
  useMapHook: any
) {
  return function MapBounds() {
    const map = useMapHook();

    useEffect(() => {
      if (markers.length > 1 && map && L) {
        const bounds = L.latLngBounds(
          markers.map((marker) => [
            marker.coordinates.lat,
            marker.coordinates.lng,
          ])
        );
        // Add more padding and set max zoom to ensure both markers are visible
        map.fitBounds(bounds, {
          padding: [50, 50], // Increased padding (top/bottom, left/right)
          maxZoom: 15, // Limit max zoom level
        });
      }
    }, [map, markers, L]);

    return null;
  };
}

// Create custom marker icon (only called on client)
// biome-ignore lint/suspicious/noExplicitAny: Leaflet types
const createCustomIcon = (L: any, type: string, label: string) => {
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

const GeolocationMapInner = ({
  mapData,
  className = '',
}: GeolocationMapProps) => {
  const [isLoading, setIsLoading] = useState(true);
  // biome-ignore lint/suspicious/noExplicitAny: Leaflet types
  const [L, setL] = useState<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: React Leaflet components
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Import CSS (side effect, no need to await)
      // @ts-expect-error - CSS import doesn't have type definitions
      import('leaflet/dist/leaflet.css');

      Promise.all([import('leaflet'), import('react-leaflet')]).then(
        ([leafletModule, reactLeafletModule]) => {
          const leaflet = leafletModule.default;

          // Fix for default marker icons in Leaflet
          // biome-ignore lint/suspicious/noExplicitAny: Leaflet's internal property access
          delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
          leaflet.Icon.Default.mergeOptions({
            iconRetinaUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          });

          setL(leaflet);
          setMapComponents({
            MapContainer: reactLeafletModule.MapContainer,
            TileLayer: reactLeafletModule.TileLayer,
            Marker: reactLeafletModule.Marker,
            Popup: reactLeafletModule.Popup,
            useMap: reactLeafletModule.useMap,
          });
          setIsLoading(false);
        }
      );
    }
  }, []);

  // Create marker icons
  const markerIcons = useMemo(() => {
    if (!L) return [];
    return mapData.markers.map((marker) => {
      const label =
        marker.type === 'claimed' ? 'C' : marker.type === 'gps' ? 'G' : 'M';
      return createCustomIcon(L, marker.type, label);
    });
  }, [mapData.markers, L]);

  const handleOpenInMaps = () => {
    const { lat, lng } = mapData.centerCoordinates;
    // Open in OpenStreetMap
    const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=${mapData.zoom}`;
    window.open(url, '_blank');
  };

  if (!MapComponents) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, useMap } = MapComponents;

  // Create bounds component that uses the hook
  const BoundsComponent =
    L && useMap ? createMapBoundsComponent(mapData.markers, L, useMap) : null;

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
          zoom={
            mapData.markers.length > 1
              ? Math.min(mapData.zoom || 12, 10)
              : mapData.zoom || 12
          }
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapData.markers.length > 1 && BoundsComponent && <BoundsComponent />}
          {markerIcons.length > 0 &&
            mapData.markers.map((marker, index) => (
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
                    <p
                      style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}
                    >
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

// Export with dynamic import to disable SSR
const GeolocationMap = dynamic(() => Promise.resolve(GeolocationMapInner), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-96">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    </div>
  ),
});

export default GeolocationMap;
