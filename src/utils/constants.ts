/**
 * Global constants for TravelAI.
 * Following SCREAMING_SNAKE_CASE and named constants only.
 */

export const MAX_INPUT_LENGTH = 1000;
export const MAX_DESTINATION_LENGTH = 120;
export const MAX_TRIP_DAYS = 365;
export const MAX_BUDGET = 10000000;
export const MAX_TRAVELERS = 500;
export const MIN_TRAVELERS = 1;

export const DEBOUNCE_DELAY_MS = 350;

export const CATEGORY_ICONS = {
  attraction: '🏛',
  food: '🍽',
  accommodation: '🏨',
  transport: '🚌',
  leisure: '🎭',
} as const;

export const API_ENDPOINTS = {
  STREAM: '/api/stream',
  PLACES: '/api/places',
} as const;
