import { create } from 'zustand';
import { TripItinerary } from '@/types/trip';

interface HistoryEntry {
  role: 'user' | 'assistant';
  content: string;
}

interface ItineraryState {
  itinerary: TripItinerary | null;
  isGenerating: boolean;
  streamedContent: string;
  history: HistoryEntry[];
  setItinerary: (itinerary: TripItinerary) => void;
  setIsGenerating: (status: boolean) => void;
  appendStreamedContent: (chunk: string) => void;
  addToHistory: (role: 'user' | 'assistant', content: string) => void;
  clearItinerary: () => void;
}

/**
 * Zustand store for managing the generated itinerary, streaming state, and multi-turn history.
 */
export const useItineraryStore = create<ItineraryState>((set) => ({
  itinerary: null,
  isGenerating: false,
  streamedContent: '',
  history: [],

  setItinerary: (itinerary) => set({ itinerary }),
  
  setIsGenerating: (status) => set({ isGenerating: status }),
  
  appendStreamedContent: (chunk) => set((state) => ({ 
    streamedContent: state.streamedContent + chunk 
  })),

  addToHistory: (role, content) => set((state) => ({
    history: [...state.history, { role, content }]
  })),

  clearItinerary: () => set({ 
    itinerary: null, 
    streamedContent: '', 
    isGenerating: false,
    history: []
  }),
}));
