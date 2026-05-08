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
 * World-class Map component with Advanced Markers, Polylines, and InfoWindows.
 * Integrates Directions API with optimized waypoints.
 * @returns {React.JSX.Element} - Rendered map
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
    <div className="w-full h-[600px] rounded-3xl overflow-hidden glass border border-glass-border shadow-2xl" role="application" aria-label="Interactive trip map">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: 20, lng: 77 }} // Default to India center
          defaultZoom={4}
          mapId="TRAVEL_AI_MAP_V2"
          gestureHandling="greedy"
          disableDefaultUI={false}
          colorScheme="FOLLOW_SYSTEM"
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
                  borderColor={'#ffffff'}
                />
              </AdvancedMarker>
            ))
          )}

          {selectedActivity && selectedActivity.geo && (
            <InfoWindow
              position={{ lat: selectedActivity.geo.lat, lng: selectedActivity.geo.lng }}
              onCloseClick={() => setSelectedActivity(null)}
            >
              <div className="p-2 max-w-[200px]">
                <h4 className="font-bold text-sm">{selectedActivity.name}</h4>
                <p className="text-[10px] text-gray-500 mb-2">{selectedActivity.location}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">${selectedActivity.cost_usd}</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedActivity.google_maps_query)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[10px] bg-primary text-white px-2 py-1 rounded"
                  >
                    Open in Maps
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

/**
 * Handles map bounds based on markers.
 */
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
      map.fitBounds(bounds, { top: 80, right: 80, bottom: 80, left: 80 });
    }
  }, [map, dayMarkers]);

  return null;
};

/**
 * Renders polylines for each day using Directions Service.
 */
const DirectionsRenderer = ({ dayMarkers }: { dayMarkers: any[] }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsServices, setDirectionsServices] = useState<google.maps.DirectionsService[]>([]);

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
        travelMode: google.maps.TravelMode.DRIVING, // Default, could be dynamic
      }, (result, status) => {
        if (status === 'OK' && result) {
          new google.maps.DirectionsRenderer({
            map,
            directions: result,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: getDayColor(index),
              strokeOpacity: 0.8,
              strokeWeight: 4
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
    case 'attraction': return '#6366f1';
    case 'food': return '#f43f5e';
    case 'accommodation': return '#10b981';
    case 'transport': return '#f59e0b';
    default: return '#64748b';
  }
};

const getDayColor = (index: number) => {
  const colors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];
  return colors[index % colors.length];
};
