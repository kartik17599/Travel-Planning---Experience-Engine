'use client';

import React, { Suspense } from 'react';
import { TripForm } from '@/components/features/TripForm';
import { ItineraryDisplay } from '@/components/features/ItineraryDisplay';

// Lazy load the Map component to optimize bundle size
const MapView = React.lazy(() => import('@/components/features/MapView').then(mod => ({ default: mod.MapView })));

/**
 * Main application entry point for TravelAI.
 * Features a responsive layout with form, itinerary, and interactive map.
 * @returns {JSX.Element} - Rendered page
 */
export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-background">
      {/* Skip to content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-white p-2 rounded"
      >
        Skip to main content
      </a>

      <header className="py-6 px-6 glass sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-primary">TravelAI</h1>
            <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Premium Travel Engine</p>
          </div>
          <nav aria-label="Main Navigation">
            <ul className="flex gap-6 text-sm font-semibold">
              <li><a href="#" className="hover:text-primary transition-colors">My Trips</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Settings</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <div id="main-content" className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Input Form */}
          <aside className="lg:col-span-4 space-y-6">
            <section aria-labelledby="form-title">
              <h2 id="form-title" className="sr-only">Trip Preferences</h2>
              <TripForm />
            </section>
          </aside>

          {/* Right Column: Output & Map */}
          <div className="lg:col-span-8 space-y-10">
            <section aria-labelledby="map-title" className="sticky top-28 z-30">
              <h2 id="map-title" className="sr-only">Interactive Map</h2>
              <Suspense fallback={<div className="w-full h-[500px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse flex items-center justify-center">Loading Map...</div>}>
                <MapView />
              </Suspense>
            </section>

            <section aria-labelledby="itinerary-title">
              <h2 id="itinerary-title" className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Generated Plan</h2>
              <ItineraryDisplay />
            </section>
          </div>

        </div>
      </div>

      <footer className="py-10 border-t border-border mt-20 text-center text-sm text-gray-500">
        <p>&copy; 2026 TravelAI. All rights reserved. Powered by Claude 3.5 Sonnet.</p>
      </footer>
    </main>
  );
}
