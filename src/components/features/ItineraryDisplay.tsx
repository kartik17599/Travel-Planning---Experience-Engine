'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useItineraryStore } from '@/store/itineraryStore';
import { ActivityItem } from './ActivityItem';
import { TripItinerary } from '@/types/trip';

/**
 * TravelAI v5.0 Itinerary Panel.
 * Implementation: Scrollable editorial panel with quick-action chips 
 * and conversational follow-up.
 */
export const ItineraryDisplay = (): React.JSX.Element => {
  const { itinerary, streamedContent, isGenerating } = useItineraryStore();
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = ["Analyzing destination…", "Checking advisories…", "Building itinerary…", "Optimizing routes…", "Finalizing…"];

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % steps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const it = useMemo(() => {
    if (itinerary) return itinerary;
    if (!streamedContent) return null;
    try {
      const jsonStr = streamedContent.trim();
      if (jsonStr.startsWith('{') && jsonStr.endsWith('}')) {
        return JSON.parse(jsonStr) as TripItinerary;
      }
    } catch (e) { return null; }
    return null;
  }, [itinerary, streamedContent]);

  return (
    <article 
      className="bg-w04 border border-w10 rounded-rxl overflow-hidden flex flex-col h-full"
      role="region" 
      aria-labelledby="itin-label" 
      aria-live="polite"
    >
      {/* 11. Itinerary Panel Header */}
      <header className="px-5 py-4 border-b border-w10 flex items-center justify-between bg-white/[0.02]">
        <h3 id="itin-label" className="font-serif text-[18px] font-medium text-w100">
          {it ? `Journey to ${it.destination}` : 'Your Itinerary'}
        </h3>
        <span className="text-[11px] font-medium text-w40 uppercase tracking-wider">
          {isGenerating ? 'Drafting...' : it ? 'Finalized' : 'Pending'}
        </span>
      </header>

      {/* 11. Itinerary Panel Body */}
      <div className="p-5 flex-1 max-h-[340px] overflow-y-auto custom-scrollbar bg-navy/20">
        {!it && !isGenerating && (
          <div className="py-8 text-center animate-fade-up">
            <span className="text-[32px] opacity-40 mb-3 block">✈️</span>
            <p className="text-[13px] text-w40 leading-[1.6] max-w-[200px] mx-auto">
              Ready to explore? Complete the planner to generate your bespoke journey.
            </p>
          </div>
        )}

        {isGenerating && !it && (
          <div className="py-8 text-center" role="status" aria-label="Generating your travel plan">
            <div className="w-8 h-8 border-2 border-w10 border-top-gold2 rounded-full animate-spin mx-auto mb-4" 
                 style={{ borderTopColor: 'var(--gold2)' }} />
            <p className="text-[13px] text-w40 font-medium">{steps[loadingStep]}</p>
            <div className="mt-6 space-y-3 px-4">
              <div className="h-4 w-full bg-w06 rounded animate-shimmer" />
              <div className="h-4 w-3/4 bg-w06 rounded animate-shimmer" />
              <div className="h-4 w-5/6 bg-w06 rounded animate-shimmer" />
            </div>
          </div>
        )}

        {it && (
          <div className="space-y-10 animate-fade-up">
            <div className="p-4 bg-gold/5 border border-gold2/20 rounded-r mb-6">
              <p className="text-[12px] italic font-serif text-gold2 leading-relaxed">
                "{it.overview}"
              </p>
            </div>

            {it.days.map((day) => (
              <section key={day.day} className="relative border-l border-w10 pl-6 pb-2 last:pb-0">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gold2 shadow-[0_0_8px_rgba(232,184,109,0.5)]" />
                <header className="mb-4">
                  <h4 className="text-[11px] font-medium text-gold2 uppercase tracking-widest mb-1">Day {day.day}</h4>
                  <p className="text-[15px] font-serif font-medium text-w100">{day.theme}</p>
                </header>
                <div className="space-y-4">
                  {day.activities.map((activity, idx) => (
                    <ActivityItem key={`${day.day}-${idx}`} activity={{...activity, id: `${day.day}-${idx}`}} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* 11. Follow-up Section */}
      <div className="mt-auto border-t border-w10 bg-white/[0.01]">
        {/* Quick Chips */}
        <div className="px-5 pt-4 flex flex-wrap gap-1.5 overflow-x-auto pb-3 custom-scrollbar">
          <QuickChip label="🍽 Local food spots" />
          <QuickChip label="🧳 Packing list" />
          <QuickChip label="💎 Hidden gems" />
          <QuickChip label="💰 Budget split" />
        </div>

        <div className="px-5 pb-4 flex gap-2">
          <input 
            type="text" 
            placeholder="Ask about this trip..." 
            className="flex-1 bg-white/5 border border-w20 rounded-r px-3.5 py-2.5 text-[13px] text-w100 placeholder:text-w20 focus:border-gold2 outline-none transition-all"
          />
          <button className="bg-gold/20 border border-gold2 rounded-r px-4 py-2 text-[12px] text-gold2 hover:bg-gold/30 transition-all">
            Ask ↗
          </button>
        </div>
      </div>
    </article>
  );
};

const QuickChip = ({ label }: { label: string }) => (
  <button className="whitespace-nowrap border border-w10 rounded-pill px-3 py-1.5 text-[11px] text-w40 hover:border-w20 hover:text-w70 transition-all">
    {label}
  </button>
);
