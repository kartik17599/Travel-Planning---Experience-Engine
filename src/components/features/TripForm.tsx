'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useFormStore } from '@/store/formStore';
import { useItineraryStore } from '@/store/itineraryStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { tripFormSchema } from '@/utils/validation';
import { API_ENDPOINTS, DEBOUNCE_DELAY_MS } from '@/utils/constants';

const INTEREST_OPTIONS = [
  'History', 'Nature', 'Food', 'Art', 'Shopping', 
  'Adventure', 'Relaxation', 'Nightlife', 'Family Friendly'
];

/**
 * Multi-step Trip Planning Form with validation and autocomplete.
 * @returns {JSX.Element} - Rendered form component
 */
export const TripForm = (): JSX.Element => {
  const { formData, step, setFormData, nextStep, prevStep } = useFormStore();
  const { setIsGenerating, appendStreamedContent, setItinerary } = useItineraryStore();
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced Place Autocomplete
  useEffect(() => {
    if (formData.destination.length < 2) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.PLACES}?input=${encodeURIComponent(formData.destination)}`);
        const data = await res.json();
        setSuggestions(data.predictions || []);
      } catch (err) {
        console.error('Autocomplete error:', err);
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(handler);
  }, [formData.destination]);

  const handleValidateStep = useCallback(() => {
    const result = tripFormSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidateStep()) return;

    setIsGenerating(true);
    try {
      const response = await fetch(API_ENDPOINTS.STREAM, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Generation failed');

      const reader = response.body?.getReader();
      const decoder = new TextEncoder();
      
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        appendStreamedContent(chunk);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleInterest = (interest: string) => {
    const current = formData.interests;
    const next = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    setFormData({ interests: next });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-8 glass rounded-2xl animate-float">
      <div role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3} aria-label="Step progress">
        <p className="text-sm font-medium mb-2">Step {step} of 3</p>
        <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <Input 
            label="Where to?" 
            value={formData.destination}
            onChange={(e) => setFormData({ destination: e.target.value })}
            error={errors.destination}
            placeholder="e.g. Paris, France"
          />
          {suggestions.length > 0 && (
            <ul className="border rounded-md bg-white dark:bg-slate-800 shadow-sm" role="listbox">
              {suggestions.map((s) => (
                <li 
                  key={s.place_id} 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-sm"
                  onClick={() => {
                    setFormData({ destination: s.description });
                    setSuggestions([]);
                  }}
                >
                  {s.description}
                </li>
              ))}
            </ul>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Start Date" 
              type="date" 
              value={formData.startDate}
              onChange={(e) => setFormData({ startDate: e.target.value })}
              error={errors.startDate}
            />
            <Input 
              label="End Date" 
              type="date" 
              value={formData.endDate}
              onChange={(e) => setFormData({ endDate: e.target.value })}
              error={errors.endDate}
            />
          </div>
          <Button onClick={() => handleValidateStep() && nextStep()} className="w-full">
            Next
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <Input 
            label="Budget ($)" 
            type="number" 
            value={formData.budget}
            onChange={(e) => setFormData({ budget: Number(e.target.value) })}
            error={errors.budget}
          />
          <Input 
            label="Travelers" 
            type="number" 
            value={formData.travelers}
            onChange={(e) => setFormData({ travelers: Number(e.target.value) })}
            error={errors.travelers}
          />
          <div className="flex gap-4">
            <Button variant="secondary" onClick={prevStep} className="flex-1">Back</Button>
            <Button onClick={() => handleValidateStep() && nextStep()} className="flex-1">Next</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <label className="text-sm font-semibold">What are you interested in?</label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Interests">
            {INTEREST_OPTIONS.map((opt) => (
              <Chip 
                key={opt} 
                label={opt} 
                selected={formData.interests.includes(opt)}
                onClick={() => toggleInterest(opt)}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={prevStep} className="flex-1">Back</Button>
            <Button type="submit" className="flex-1">Generate Plan</Button>
          </div>
        </div>
      )}
    </form>
  );
};
