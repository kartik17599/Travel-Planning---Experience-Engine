import { z } from 'zod';
import { 
  MAX_DESTINATION_LENGTH, 
  MAX_BUDGET, 
  MAX_TRAVELERS, 
  MIN_TRAVELERS,
  MAX_TRIP_DAYS 
} from './constants';

/**
 * Zod schema for validating Trip Form Data.
 */
export const tripFormSchema = z.object({
  destination: z.string()
    .min(1, 'Destination is required')
    .max(MAX_DESTINATION_LENGTH, `Destination must be less than ${MAX_DESTINATION_LENGTH} characters`)
    .regex(/^[a-zA-Z0-9\s,\-]+$/, 'Destination contains invalid characters'),
  
  startDate: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, { message: 'Start date must be today or in the future' }),

  endDate: z.string(),

  budget: z.number()
    .positive('Budget must be a positive number')
    .max(MAX_BUDGET, `Budget cannot exceed ${MAX_BUDGET}`),

  travelers: z.number()
    .int()
    .min(MIN_TRAVELERS, `At least ${MIN_TRAVELERS} traveler required`)
    .max(MAX_TRAVELERS, `Cannot exceed ${MAX_TRAVELERS} travelers`),

  interests: z.array(z.string()).default([]),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return end > start && diffDays <= MAX_TRIP_DAYS;
}, {
  message: `Trip duration must be between 1 and ${MAX_TRIP_DAYS} days`,
  path: ['endDate'],
});

export type ValidatedTripFormData = z.infer<typeof tripFormSchema>;
