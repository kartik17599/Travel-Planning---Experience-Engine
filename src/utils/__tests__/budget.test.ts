import { describe, it, expect } from 'vitest';
import { calculateBudgetPerPerson, calculateContingency } from '../budget';

describe('Budget Utilities', () => {
  describe('calculateBudgetPerPerson()', () => {
    it('calculates correctly for multiple people', () => {
      expect(calculateBudgetPerPerson(1000, 2)).toBe(500);
    });

    it('handles solo travelers', () => {
      expect(calculateBudgetPerPerson(1000, 1)).toBe(1000);
    });

    it('returns 0 for zero travelers', () => {
      expect(calculateBudgetPerPerson(1000, 0)).toBe(0);
    });

    it('returns 0 for negative travelers', () => {
      expect(calculateBudgetPerPerson(1000, -1)).toBe(0);
    });
  });

  describe('calculateContingency()', () => {
    it('calculates 15% correctly', () => {
      expect(calculateContingency(1000)).toBe(150);
    });
  });
});
