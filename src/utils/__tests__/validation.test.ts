import { describe, it, expect } from 'vitest';
import { tripFormSchema } from '../validation';

describe('tripFormSchema', () => {
  it('validates a correct form', () => {
    const validData = {
      destination: 'Bali, Indonesia',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 days later
      budget: 5000,
      travelers: 2,
      interests: ['Nature', 'Food']
    };
    const result = tripFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid destination characters', () => {
    const invalidData = {
      destination: 'Bali <script>',
      startDate: '2026-06-01',
      endDate: '2026-06-05',
      budget: 1000,
      travelers: 1
    };
    const result = tripFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects end date before start date', () => {
    const invalidData = {
      destination: 'Paris',
      startDate: '2026-06-05',
      endDate: '2026-06-01',
      budget: 1000,
      travelers: 1
    };
    const result = tripFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects zero or negative travelers', () => {
    const invalidData = {
      destination: 'Paris',
      startDate: '2026-06-01',
      endDate: '2026-06-05',
      budget: 1000,
      travelers: 0
    };
    const result = tripFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
