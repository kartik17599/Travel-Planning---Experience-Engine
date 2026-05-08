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
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <header className="mb-12 p-12 glass rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
            <h2 className="text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {itinerary.destination}
            </h2>
            <div className="flex justify-center items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-500">
              <span>📅 {itinerary.startDate}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>🏁 {itinerary.endDate}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span className="text-primary">💰 Total: ${itinerary.totalBudget}</span>
            </div>
          </header>

          <div className="space-y-12">
            {itinerary.days.map((day) => (
              <section key={day.dayIndex} aria-labelledby={`day-${day.dayIndex}-title`}>
                <div className="flex items-center gap-4 mb-6 sticky top-[80px] bg-background/90 backdrop-blur-md py-4 z-20">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black shadow-lg">
                    {day.dayIndex}
                  </div>
                  <h3 id={`day-${day.dayIndex}-title`} className="text-2xl font-black tracking-tight">
                    {day.date}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                </div>
                <div className="space-y-6 ml-6 border-l-2 border-dashed border-border pl-10 pb-10">
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
