import { z } from 'zod';
import { isCleanInput } from './sanitizer';

/**
 * Zod schema for the enhanced trip form data.
 * Validates destination, dates, budget, travelers, and all new constraints.
 */
export const tripFormSchema = z.object({
  destination: z.string()
    .min(2, 'Destination must be at least 2 characters')
    .refine(isCleanInput, 'Destination contains invalid characters'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  budget: z.number().positive('Budget must be positive'),
  travelers: z.number().int().positive('Traveler count must be at least 1'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  dietary: z.array(z.string()).optional(),
  mobility: z.array(z.string()).optional(),
  pace: z.enum(['Relaxed', 'Balanced', 'Intensive']).optional(),
  tripStyle: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: 'End date must be on or after start date',
  path: ['endDate'],
});

export type ValidatedTripFormData = z.infer<typeof tripFormSchema>;
