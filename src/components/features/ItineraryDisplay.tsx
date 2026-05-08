'use client';

import React, { useMemo } from 'react';
import { useItineraryStore } from '@/store/itineraryStore';
import { ActivityItem } from './ActivityItem';
import { CalendarButton } from './CalendarButton';
import { TripItinerary } from '@/types/trip';

/**
 * Main itinerary display component with support for detailed sections and real-time streaming.
 * WCAG 2.1 AA Compliant landmarks and live regions.
 * @returns {React.JSX.Element} - Rendered itinerary
 */
export const ItineraryDisplay = (): React.JSX.Element => {
  const { itinerary, streamedContent, isGenerating } = useItineraryStore();

  // Attempt to parse the streamed content as it arrives for partial rendering
  const partialItinerary = useMemo(() => {
    if (itinerary) return itinerary;
    if (!streamedContent) return null;
    
    try {
      const jsonStr = streamedContent.trim();
      if (jsonStr.startsWith('{') && jsonStr.endsWith('}')) {
        return JSON.parse(jsonStr) as TripItinerary;
      }
    } catch (e) {
      return null;
    }
    return null;
  }, [itinerary, streamedContent]);

  if (!partialItinerary && !isGenerating) {
    return (
      <div className="text-center p-12 glass rounded-3xl animate-float">
        <h2 className="text-2xl font-black mb-2">Ready to explore?</h2>
        <p className="text-gray-500">Fill out the form to generate your premium travel plan.</p>
      </div>
    );
  }

  const it = partialItinerary;

  return (
    <div className="space-y-12 pb-24" role="region" aria-label="Trip Itinerary" aria-live="polite">
      {isGenerating && !it && (
        <div className="flex flex-col items-center justify-center p-12 glass rounded-3xl" role="status">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-primary animate-pulse">Generating your world-class travel plan...</p>
        </div>
      )}

      {it && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <header className="mb-12 p-12 glass rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
            <h2 className="text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {it.destination}
            </h2>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {it.overview}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
              <span className="px-3 py-1 bg-secondary rounded-full">📅 {it.startDate} — {it.endDate}</span>
              <span className="px-3 py-1 bg-secondary rounded-full">⛅ {it.season_note}</span>
              {it.advisory && (
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full" role="alert">⚠️ {it.advisory}</span>
              )}
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-16">
              {it.days.map((day) => (
                <section key={day.day} aria-labelledby={`day-${day.day}-title`}>
                  <div className="flex items-center gap-4 mb-8 sticky top-[80px] bg-background/95 backdrop-blur-md py-4 z-20 border-b border-border/50">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-xl transform -rotate-3">
                      {day.day}
                    </div>
                    <div>
                      <h3 id={`day-${day.day}-title`} className="text-2xl font-black tracking-tight">
                        {day.date}
                      </h3>
                      <p className="text-sm font-bold text-primary/80 uppercase tracking-wider">{day.theme}</p>
                    </div>
                    <div className="flex-1 text-right flex flex-col items-end gap-2">
                      <span className="text-xs font-bold text-gray-400">{day.weather_note}</span>
                      <CalendarButton day={day} destination={it.destination} />
                    </div>
                  </div>
                  
                  <div className="space-y-6 ml-6 border-l-2 border-dashed border-primary/20 pl-10 pb-4">
                    {day.activities.map((activity, idx) => (
                      <ActivityItem key={`${day.day}-${idx}`} activity={{...activity, id: `${day.day}-${idx}`}} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <aside className="space-y-8">
              <div className="glass p-8 rounded-3xl sticky top-[100px]">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <span className="text-2xl">💰</span> Budget Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-gray-500 uppercase">Total Estimate</span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary">{it.budget_summary.total_est_local}</p>
                      <p className="text-xs font-bold text-gray-400">(${it.budget_summary.total_est_usd})</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <BudgetBar label="Accommodation" pct={it.budget_summary.accommodation_pct} />
                    <BudgetBar label="Food & Dining" pct={it.budget_summary.food_pct} />
                    <BudgetBar label="Activities" pct={it.budget_summary.activities_pct} />
                    <BudgetBar label="Transport" pct={it.budget_summary.transport_pct} />
                    <div className="pt-2 border-t border-border mt-2">
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                        Incl. {it.budget_summary.contingency_pct}% Contingency
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <h4 className="text-sm font-black mb-4 uppercase tracking-widest">🧳 Packing Essentials</h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {it.packing_essentials.map(item => (
                      <li key={item} className="text-sm font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <h4 className="text-sm font-black mb-4 uppercase tracking-widest text-red-500">🆘 Emergency</h4>
                  <div className="space-y-2 text-xs font-bold">
                    <p>Police: {it.emergency_contacts.local_police}</p>
                    <p>Ambulance: {it.emergency_contacts.ambulance}</p>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.emergency_contacts.nearest_hospital_maps_query)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-primary hover:underline block mt-2"
                    >
                      Find Nearest Hospital ↗
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <footer className="mt-12 p-8 glass rounded-3xl text-xs text-gray-500 italic">
            <p>{it.disclaimer}</p>
          </footer>
        </div>
      )}
    </div>
  );
};

const BudgetBar = ({ label, pct }: { label: string; pct: number }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black uppercase mb-1">
      <span>{label}</span>
      <span>{pct}%</span>
    </div>
    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
      <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${pct}%` }} />
    </div>
  </div>
);
