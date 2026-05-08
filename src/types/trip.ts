/**
 * Core domain types for TravelAI.
 * Aligned with the Mandatory JSON Response Schema.
 */

export interface Location {
  name: string;
  lat: number;
  lng: number;
  placeId?: string;
}

export interface Activity {
  time: string; // HH:MM
  name: string;
  location: string; // Venue name, Neighbourhood, City
  category: 'attraction' | 'food' | 'transport' | 'accommodation' | 'leisure';
  duration_mins: number;
  cost_usd: number;
  cost_local: string; // e.g. "₹1,250"
  google_maps_query: string;
  accessibility_notes: string;
  dietary_options?: string[];
  booking_required: boolean;
  booking_url: string | null;
  off_peak_tip: string;
  alternate: string;
  tips: string;
  // Internal fields for mapping
  id: string; 
  geo?: Location;
  startTime: string; // Derived from time
  endTime: string; // Derived from time + duration
}

export interface DayItinerary {
  day: number;
  date: string;
  theme: string;
  weather_note: string;
  activities: Activity[];
  day_budget_est_usd: number;
  day_budget_local: string;
}

export interface BudgetSummary {
  total_est_usd: number;
  total_est_local: string;
  per_person_usd: number;
  accommodation_pct: number;
  food_pct: number;
  activities_pct: number;
  transport_pct: number;
  contingency_pct: number;
}

export interface EmergencyContacts {
  local_police: string;
  ambulance: string;
  embassy_lookup: string;
  nearest_hospital_maps_query: string;
}

export interface TripItinerary {
  overview: string;
  season_note: string;
  advisory: string | null;
  days: DayItinerary[];
  budget_summary: BudgetSummary;
  google_maps_tips: string[];
  packing_essentials: string[];
  emergency_contacts: EmergencyContacts;
  disclaimer: string;
  // Internal fields
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
}

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  interests: string[];
  dietary?: string[];
  mobility?: string[];
  pace?: 'Relaxed' | 'Balanced' | 'Intensive';
  tripStyle?: string;
}
