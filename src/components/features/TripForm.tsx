'use client';

import React, { useState, useEffect } from 'react';
import { useFormStore } from '@/store/formStore';
import { useItineraryStore } from '@/store/itineraryStore';
import { API_ENDPOINTS } from '@/utils/constants';

const INTEREST_OPTIONS = ['Culture', 'Food', 'Adventure', 'Nature', 'Shopping', 'Nightlife', 'Wellness', 'History'];
const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher'];
const MOBILITY_OPTIONS = ['Wheelchair', 'No Stairs', 'Senior-Friendly'];
const PACE_OPTIONS = [
  { id: 'Relaxed', icon: '🌅', desc: '2 stops/half-day' },
  { id: 'Balanced', icon: '⚖️', desc: '3 stops/half-day' },
  { id: 'Intensive', icon: '🚀', desc: '4+ stops/half-day' }
];

/**
 * TravelAI v5.0 Planner Panel.
 * Implementation: Multi-step editorial form with custom chips and pace selectors.
 */
export const TripForm = (): React.JSX.Element => {
  const { formData, step, setFormData, nextStep, prevStep } = useFormStore();
  const { setIsGenerating, appendStreamedContent, addToHistory } = useItineraryStore();
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (formData.destination.length < 2) {
      setSuggestions([]);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.PLACES}?input=${encodeURIComponent(formData.destination)}`);
        const data = await res.json();
        setSuggestions(data.predictions || []);
      } catch (err) { console.error(err); }
    }, 350);
    return () => clearTimeout(handler);
  }, [formData.destination]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    addToHistory('user', `Generate journey for ${formData.destination}`);
    try {
      const response = await fetch(API_ENDPOINTS.STREAM, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const reader = response.body?.getReader();
      if (!reader) return;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        appendStreamedContent(new TextDecoder().decode(value));
      }
    } catch (err) { console.error(err); } finally { setIsGenerating(false); }
  };

  const toggleArrayField = (field: keyof typeof formData, value: string) => {
    const current = (formData[field] as string[]) || [];
    setFormData({ [field]: current.includes(value) ? current.filter(i => i !== value) : [...current, value] });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 7. Panel Header */}
      <header className="p-5 px-6 border-b border-w10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-w40">
            Phase {step} of 3
          </span>
          <div className="flex gap-1" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`w-6 h-[3px] rounded-full transition-all duration-300 ${s < step ? 'bg-teal' : s === step ? 'bg-gold2' : 'bg-w20'}`}
                aria-current={s === step ? 'step' : undefined}
              />
            ))}
          </div>
        </div>
        <h2 className="font-serif text-[22px] font-medium text-w100">
          {step === 1 ? 'Trip Essentials' : step === 2 ? 'Your Interests' : 'Final Details'}
        </h2>
      </header>

      <form onSubmit={handleSubmit} className="p-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FormSection label="Destination" id="dest">
              <input 
                id="dest"
                className="form-input" 
                value={formData.destination}
                onChange={(e) => setFormData({ destination: e.target.value })}
                placeholder="Where should we go?"
                aria-required="true"
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-50 left-0 top-full mt-1 w-full bg-navy-mid border border-w20 rounded-r shadow-2xl overflow-hidden">
                  {suggestions.map((s) => (
                    <li key={s.place_id} className="p-3 hover:bg-w06 cursor-pointer text-sm text-w100 transition-colors border-b border-w10 last:border-none" onClick={() => { setFormData({ destination: s.description }); setSuggestions([]); }}>
                      {s.description}
                    </li>
                  ))}
                </ul>
              )}
            </FormSection>
            
            <div className="grid grid-cols-2 gap-2.5">
              <FormSection label="Depart" id="start">
                <input id="start" type="date" className="form-input" value={formData.startDate} onChange={(e) => setFormData({ startDate: e.target.value })} aria-required="true" />
              </FormSection>
              <FormSection label="Return" id="end">
                <input id="end" type="date" className="form-input" value={formData.endDate} onChange={(e) => setFormData({ endDate: e.target.value })} aria-required="true" />
              </FormSection>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <FormSection label="Budget ($)" id="bud">
                <input id="bud" type="number" className="form-input" value={formData.budget} onChange={(e) => setFormData({ budget: Number(e.target.value) })} aria-required="true" />
              </FormSection>
              <FormSection label="Travelers" id="trav">
                <input id="trav" type="number" className="form-input" value={formData.travelers} onChange={(e) => setFormData({ travelers: Number(e.target.value) })} aria-required="true" />
              </FormSection>
            </div>
            
            <ButtonRow onNext={nextStep} isFinal={false} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="form-label mb-2 block">Interests</label>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Trip interests">
                {INTEREST_OPTIONS.map(opt => (
                  <Chip 
                    key={opt} 
                    label={opt} 
                    selected={formData.interests.includes(opt)} 
                    onClick={() => toggleArrayField('interests', opt)} 
                    variant="gold"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="form-label mb-2 block">Travel Pace</label>
              <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Travel pace">
                {PACE_OPTIONS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={formData.pace === p.id}
                    onClick={() => setFormData({ pace: p.id as any })}
                    className={`p-2.5 rounded-r border transition-all text-center ${formData.pace === p.id ? 'bg-gold/15 border-gold2 text-gold2' : 'bg-transparent border-w20 text-w70 hover:border-gold2'}`}
                  >
                    <span className="text-[18px] mb-1 block">{p.icon}</span>
                    <span className="text-[11px] font-medium block">{p.id}</span>
                    <span className="text-[10px] text-w40 block mt-0.5">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <ButtonRow onBack={prevStep} onNext={nextStep} isFinal={false} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="form-label mb-2 block">Dietary Preferences</label>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={formData.dietary?.includes(opt)} onClick={() => toggleArrayField('dietary', opt)} variant="teal" />
                ))}
              </div>
            </div>

            <div>
              <label className="form-label mb-2 block">Mobility Requirements</label>
              <div className="flex flex-wrap gap-1.5">
                {MOBILITY_OPTIONS.map(opt => (
                  <Chip key={opt} label={opt} selected={formData.mobility?.includes(opt)} onClick={() => toggleArrayField('mobility', opt)} variant="teal" />
                ))}
              </div>
            </div>

            <FormSection label="Trip Style Notes" id="style">
              <textarea 
                id="style"
                className="form-input min-h-[100px] resize-none" 
                value={formData.tripStyle || ''} 
                onChange={(e) => setFormData({ tripStyle: e.target.value })}
                placeholder="e.g. Minimalist, focused on architecture and local cafes..."
              />
            </FormSection>

            <ButtonRow onBack={prevStep} isFinal={true} />
          </div>
        )}
      </form>

      <style jsx>{`
        .form-label {
          font-family: var(--sans);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: var(--w40);
        }
        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 0.5px solid var(--w20);
          border-radius: var(--r);
          padding: 12px 14px;
          font-size: 14px;
          color: var(--w100);
          font-family: var(--sans);
          transition: all .2s;
          outline: none;
        }
        .form-input::placeholder {
          color: var(--w20);
        }
        .form-input:focus {
          border-color: var(--gold2);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(232, 184, 109, 0.12);
        }
      `}</style>
    </div>
  );
};

const FormSection = ({ label, id, children }: { label: string; id: string; children: React.ReactNode }) => (
  <div className="relative mb-4">
    <label htmlFor={id} className="form-label mb-2 block">{label}</label>
    {children}
  </div>
);

const Chip = ({ label, selected, onClick, variant }: { label: string; selected: boolean; onClick: () => void; variant: 'gold' | 'teal' }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={`
      rounded-pill px-3 py-1.5 text-[12px] font-medium transition-all duration-200 border
      ${selected 
        ? variant === 'gold' ? 'bg-gold/18 border-gold2 text-gold2' : 'bg-teal/15 border-teal text-[#4dd4aa]'
        : 'bg-transparent border-w20 text-w40 hover:border-gold2 hover:text-gold2'
      }
    `}
  >
    {label}
  </button>
);

const ButtonRow = ({ onBack, onNext, isFinal }: { onBack?: () => void; onNext?: () => void; isFinal: boolean }) => (
  <div className="flex gap-2 mt-4">
    {onBack && (
      <button 
        type="button" 
        onClick={onBack}
        className="bg-transparent border border-w20 rounded-r px-5 py-2.5 text-[13px] text-w70 hover:border-w40 hover:text-w100 transition-all"
      >
        Back
      </button>
    )}
    <button 
      type={isFinal ? 'submit' : 'button'}
      onClick={isFinal ? undefined : onNext}
      className="flex-1 bg-gradient-to-r from-gold to-gold2 text-white border-none rounded-r px-4 py-3.5 text-[14px] font-medium tracking-[0.02em] hover:opacity-90 hover:-translate-y-[1px] active:translate-y-0 transition-all flex items-center justify-center gap-2"
    >
      {isFinal ? '✦ Generate My Itinerary' : 'Continue'}
    </button>
  </div>
);
