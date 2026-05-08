/**
 * Budget calculation utilities for TravelAI.
 */

/**
 * Calculates budget per person based on total budget and traveler count.
 * @param {number} totalBudget - The total trip budget
 * @param {number} travelers - Number of people
 * @returns {number} - Budget per person
 */
export const calculateBudgetPerPerson = (totalBudget: number, travelers: number): number => {
  if (travelers <= 0) return 0;
  return totalBudget / travelers;
};

/**
 * Calculates the suggested contingency (15% by default).
 * @param {number} totalBudget - The total trip budget
 * @returns {number} - 15% of the total budget
 */
export const calculateContingency = (totalBudget: number): number => {
  return totalBudget * 0.15;
};
