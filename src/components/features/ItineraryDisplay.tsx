'use client';

import React, { useMemo, useEffect } from 'react';
import { useItineraryStore } from '@/store/itineraryStore';
import { ActivityItem } from './ActivityItem';
import { TripItinerary } from '@/types/trip';

/**
 * Main itinerary display component.
 * @returns {JSX.Element} - Rendered itinerary
 */
export const ItineraryDisplay = (): JSX.Element => {
  const { itinerary, streamedContent, isGenerating, setItinerary } = useItineraryStore();

  // Attempt to parse the streamed content as it arrives
  useEffect(() => {
    if (!streamedContent) return;
    
    try {
      // Find the last complete JSON object in the stream
      // Simple heuristic for this demo
      if (streamedContent.trim().endsWith('}')) {
        const parsed = JSON.parse(streamedContent);
        setItinerary(parsed);
      }
    } catch (e) {
      // Parsing failed, still streaming or invalid JSON
    }
  }, [streamedContent, setItinerary]);

  if (!itinerary && !isGenerating) return <div className="p-8 text-center text-gray-500">No itinerary generated yet.</div>;

  return (
    <div className="space-y-8" aria-live="polite" aria-label="Generated Itinerary">
      {isGenerating && !itinerary && (
        <div className="p-8 space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mx-auto" />
          <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded" />
          <p className="text-center text-sm font-medium">Generating your personalized travel plan...</p>
        </div>
      )}

      {itinerary && (
        <div className="animate-in fade-in duration-500">
          <header className="mb-6 text-center">
            <h2 className="text-3xl font-black">{itinerary.destination}</h2>
            <p className="text-gray-500">
              {itinerary.startDate} — {itinerary.endDate} | Total Budget: ${itinerary.totalBudget}
            </p>
          </header>

          <div className="space-y-10">
            {itinerary.days.map((day) => (
              <section key={day.dayIndex} aria-labelledby={`day-${day.dayIndex}-title`}>
                <h3 id={`day-${day.dayIndex}-title`} className="text-xl font-bold mb-4 sticky top-0 bg-background/80 backdrop-blur-sm py-2 z-10 border-b border-border">
                  Day {day.dayIndex} — {day.date}
                </h3>
                <div className="space-y-4">
                  {day.activities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {!itinerary && isGenerating && streamedContent && (
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs overflow-auto max-h-40">
          {streamedContent}
        </div>
      )}
    </div>
  );
};
