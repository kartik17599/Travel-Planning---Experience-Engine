'use client';

import React, { useState } from 'react';
import { TripForm } from '@/components/features/TripForm';
import { MapView } from '@/components/features/MapView';
import { ItineraryDisplay } from '@/components/features/ItineraryDisplay';

/**
 * TravelAI v5.0 - Luxury Editorial Interface.
 * Features: Two-Column Layout, Cormorant Garamond Typography, 
 * Warm Gold Accents, and Atmospheric Blur Orbs.
 */
export default function Home(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-navy text-w70 relative overflow-x-hidden">
      {/* 16. Accessibility: Skip Link */}
      <a href="#planner-panel" className="skip-link">Skip to main content</a>

      {/* 3. Atmosphere (Orbs) */}
      <div className="orb-container" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="container-main relative z-10">
        {/* 4. Navigation Bar */}
        <nav className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-7 py-5 border-b border-white/10 backdrop-blur-md" role="navigation" aria-label="Main navigation">
          <div className="flex items-center">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-gold to-gold2 flex items-center justify-center font-serif text-[18px] text-white">
              T
            </div>
            <div className="ml-[10px]">
              <span className="font-serif text-[22px] font-medium text-w100 leading-none block">TravelAI</span>
              <span className="text-[10px] text-gold2 uppercase tracking-[0.1em] font-medium">Premium Travel Engine</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="bg-transparent border border-w20 rounded-full px-4 py-1.5 text-[12px] text-w70 hover:border-gold2 hover:text-gold2 transition-all focus-visible:outline-gold2 focus-visible:outline-offset-2">My Trips</button>
            <button className="bg-transparent border border-w20 rounded-full px-4 py-1.5 text-[12px] text-w70 hover:border-gold2 hover:text-gold2 transition-all focus-visible:outline-gold2 focus-visible:outline-offset-2">Settings</button>
          </div>
        </nav>

        {/* 5. Hero Section */}
        <header className="relative z-10 pt-[120px] pb-10 text-center px-7 max-w-[1100px] mx-auto">
          <p className="text-[11px] uppercase tracking-[0.14em] text-gold2 mb-3.5 animate-fade-up">
            AI-Powered Trip Intelligence
          </p>
          <h1 className="font-serif text-[clamp(38px,6vw,64px)] font-medium text-w100 leading-[1.05] mb-3.5 animate-fade-up [animation-delay:0.1s]">
            Plan your perfect <i>journey</i>
          </h1>
          <p className="text-[15px] text-w40 max-w-[480px] mx-auto mb-8 leading-[1.65] animate-fade-up [animation-delay:0.2s]">
            Dynamically crafted itineraries with real-time data, your preferences, and zero compromises.
          </p>
          
          <div className="flex justify-center items-center gap-8 animate-fade-up [animation-delay:0.3s]">
            <HeroStat value="7" label="Quality Factors" />
            <div className="w-[1px] h-8 bg-w10" aria-hidden="true" />
            <HeroStat value="98%" label="Accuracy Score" />
            <div className="w-[1px] h-8 bg-w10" aria-hidden="true" />
            <HeroStat value="Live" label="Real-time Data" />
          </div>
        </header>

        {/* 6. Page Layout — Two Column */}
        <div className="layout-wrapper">
          {/* Left Column: Planner Panel */}
          <aside id="planner-panel" className="bg-w04 border border-w10 rounded-rxl overflow-hidden backdrop-blur-[20px] h-fit">
            <TripForm />
          </aside>

          {/* Right Column: Map + Itinerary */}
          <section className="lg:pl-6 flex flex-col gap-4">
            {/* Map Placeholder */}
            <div 
              className="bg-w04 border border-w10 rounded-rxl h-[260px] relative flex items-center justify-center group"
              role="img" 
              aria-label="Interactive trip map — will display after itinerary is generated"
            >
              <div className="absolute top-3.5 left-3.5 bg-gold/20 border border-gold2 rounded-pill px-3 py-1 text-[10px] text-gold2 tracking-[0.06em] uppercase font-medium">
                Google Maps
              </div>
              <div className="flex flex-col items-center opacity-20 group-hover:opacity-30 transition-opacity">
                <span className="text-4xl mb-2">📍</span>
                <span className="text-[13px] font-medium text-w40">Map coordinates loading...</span>
              </div>
              <div className="absolute inset-0 z-10 pointer-events-auto">
                <MapView />
              </div>
            </div>

            {/* Itinerary Display */}
            <div id="itinerary-section">
              <ItineraryDisplay />
            </div>
          </section>
        </div>

        {/* 15. Footer */}
        <footer className="relative z-10 py-5 text-center border-t border-w10 mt-20">
          <p className="text-[11px] text-w40 font-sans">
            &copy; 2026 <a href="#" className="text-gold2 no-underline hover:underline">TravelAI</a>. All rights reserved. Powered by <a href="#" className="text-gold2 no-underline hover:underline">Claude Sonnet 4</a> &middot; <a href="#" className="text-gold2 no-underline hover:underline">Privacy Policy</a>
          </p>
        </footer>
      </div>
    </main>
  );
}

const HeroStat = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <p className="font-serif text-[24px] font-medium text-gold2 leading-none">{value}</p>
    <p className="text-[10px] text-w40 uppercase tracking-[0.06em] mt-1.5">{label}</p>
  </div>
);
