import { create } from 'zustand';
import { TripItinerary } from '@/types/trip';

interface ItineraryState {
  itinerary: TripItinerary | null;
  isGenerating: boolean;
  streamedContent: string;
  setItinerary: (itinerary: TripItinerary) => void;
  setIsGenerating: (status: boolean) => void;
  appendStreamedContent: (chunk: string) => void;
  clearItinerary: () => void;
}

/**
 * Zustand store for managing the generated itinerary and streaming state.
 */
export const useItineraryStore = create<ItineraryState>((set) => ({
  itinerary: null,
  isGenerating: false,
  streamedContent: '',

  setItinerary: (itinerary) => set({ itinerary }),
  
  setIsGenerating: (status) => set({ isGenerating: status }),
  
  appendStreamedContent: (chunk) => set((state) => ({ 
    streamedContent: state.streamedContent + chunk 
  })),

  clearItinerary: () => set({ 
    itinerary: null, 
    streamedContent: '', 
    isGenerating: false 
  }),
}));
