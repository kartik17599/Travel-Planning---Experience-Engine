'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin,
  useMap,
  useMapsLibrary,
  InfoWindow
} from '@vis.gl/react-google-maps';
import { useItineraryStore } from '@/store/itineraryStore';
import { CATEGORY_ICONS } from '@/utils/constants';
import { Activity } from '@/types/trip';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

/**
 * TravelAI v5.0 Map View.
 * Implementation: Advanced Markers with brand colors and dynamic path rendering.
 */
export const MapView = (): React.JSX.Element => {
  const { itinerary } = useItineraryStore();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const dayMarkers = useMemo(() => {
    if (!itinerary) return [];
    return itinerary.days.map(day => ({
      dayIndex: day.day,
      activities: day.activities.filter(a => a.geo)
    }));
  }, [itinerary]);

  return (
    <div className="w-full h-full relative" role="application" aria-label="Interactive trip map">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: 20, lng: 77 }}
          defaultZoom={4}
          mapId="TRAVEL_AI_MAP_V5"
          gestureHandling="greedy"
          disableDefaultUI={true}
          colorScheme="DARK"
        >
          {dayMarkers.flatMap(day => 
            day.activities.map((act) => (
              <AdvancedMarker
                key={`${day.dayIndex}-${act.name}`}
                position={{ lat: act.geo!.lat, lng: act.geo!.lng }}
                onClick={() => setSelectedActivity(act)}
              >
                <Pin 
                  background={getCategoryColor(act.category)} 
                  glyph={CATEGORY_ICONS[act.category as keyof typeof CATEGORY_ICONS] ?? '📍'} 
                  borderColor={'rgba(255,255,255,0.2)'}
                />
              </AdvancedMarker>
            ))
          )}

          {selectedActivity && selectedActivity.geo && (
            <InfoWindow
              position={{ lat: selectedActivity.geo.lat, lng: selectedActivity.geo.lng }}
              onCloseClick={() => setSelectedActivity(null)}
            >
              <div className="p-3 max-w-[200px] bg-navy text-w100">
                <h4 className="font-serif text-[15px] font-medium text-gold2 mb-1">{selectedActivity.name}</h4>
                <p className="text-[10px] text-w40 uppercase tracking-wider mb-2">{selectedActivity.location}</p>
                <div className="flex justify-between items-center mt-2 border-t border-w10 pt-2">
                  <span className="font-serif text-[14px] text-w100">{selectedActivity.cost_local}</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedActivity.google_maps_query)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[10px] text-gold2 border border-gold2 px-2 py-1 rounded-pill hover:bg-gold/10 transition-all"
                  >
                    Open ↗
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}

          <MapController dayMarkers={dayMarkers} />
          <DirectionsRenderer dayMarkers={dayMarkers} />
        </Map>
      </APIProvider>
    </div>
  );
};

const MapController = ({ dayMarkers }: { dayMarkers: any[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || dayMarkers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    dayMarkers.forEach(day => {
      day.activities.forEach((act: Activity) => {
        if (act.geo) bounds.extend({ lat: act.geo.lat, lng: act.geo.lng });
      });
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
    }
  }, [map, dayMarkers]);

  return null;
};

const DirectionsRenderer = ({ dayMarkers }: { dayMarkers: any[] }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');

  useEffect(() => {
    if (!map || !routesLibrary || dayMarkers.length === 0) return;

    const service = new routesLibrary.DirectionsService();
    
    dayMarkers.forEach((day, index) => {
      if (day.activities.length < 2) return;

      const waypoints = day.activities.slice(1, -1).map((act: Activity) => ({
        location: { lat: act.geo!.lat, lng: act.geo!.lng },
        stopover: true
      }));

      service.route({
        origin: { lat: day.activities[0].geo!.lat, lng: day.activities[0].geo!.lng },
        destination: { lat: day.activities[day.activities.length - 1].geo!.lat, lng: day.activities[day.activities.length - 1].geo!.lng },
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === 'OK' && result) {
          new google.maps.DirectionsRenderer({
            map,
            directions: result,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#e8b86d', // var(--gold2)
              strokeOpacity: 0.6,
              strokeWeight: 3
            }
          });
        }
      });
    });
  }, [map, routesLibrary, dayMarkers]);

  return null;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'attraction': return '#c9922a'; // var(--gold)
    case 'food': return '#d85a30'; // var(--coral)
    case 'accommodation': return '#1d9e75'; // var(--teal)
    case 'transport': return '#378add'; // var(--sky)
    default: return '#152540'; // var(--navy-mid)
  }
};
