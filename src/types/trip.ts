/**
 * Core domain types for TravelAI.
 */

export interface Location {
  name: string;
  lat: number;
  lng: number;
  placeId?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: Location;
  category: 'attraction' | 'food' | 'hotel' | 'transit';
  estimatedCost: number;
  notes?: string;
}

export interface DayItinerary {
  dayIndex: number;
  date: string;
  activities: Activity[];
}

export interface TripItinerary {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: DayItinerary[];
  totalBudget: number;
  currency: string;
}

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  interests: string[];
}
