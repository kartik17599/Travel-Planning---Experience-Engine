'use client';

import React, { useEffect, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin,
  useMap
} from '@vis.gl/react-google-maps';
import { useItineraryStore } from '@/store/itineraryStore';
import { CATEGORY_ICONS } from '@/utils/constants';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

/**
 * Interactive Map component displaying trip markers and routes.
 * @returns {JSX.Element} - Rendered map
 */
export const MapView = (): JSX.Element => {
  const { itinerary } = useItineraryStore();

  const markers = useMemo(() => {
    if (!itinerary) return [];
    return itinerary.days.flatMap(day => 
      day.activities.map(act => ({
        ...act,
        dayIndex: day.dayIndex
      }))
    );
  }, [itinerary]);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-border shadow-inner" role="application" aria-label="Interactive trip map">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: 0, lng: 0 }}
          defaultZoom={2}
          mapId="TRAVEL_AI_MAP"
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {markers.map((marker) => (
            <AdvancedMarker
              key={marker.id}
              position={{ lat: marker.location.lat, lng: marker.location.lng }}
              title={marker.name}
            >
              <Pin 
                background={getCategoryColor(marker.category)} 
                glyph={CATEGORY_ICONS[marker.category]} 
                borderColor={'#000'}
              />
            </AdvancedMarker>
          ))}
          <MapController markers={markers} />
        </Map>
      </APIProvider>
    </div>
  );
};

/**
 * Internal component to handle map bounds and interactions.
 */
const MapController = ({ markers }: { markers: any[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || markers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    markers.forEach(m => bounds.extend({ lat: m.location.lat, lng: m.location.lng }));
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [map, markers]);

  return null;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'attraction': return '#3b82f6';
    case 'food': return '#ef4444';
    case 'hotel': return '#10b981';
    case 'transit': return '#f59e0b';
    default: return '#6b7280';
  }
};
