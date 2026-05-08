import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { MAX_INPUT_LENGTH } from './constants';

// Initialize DOMPurify for both browser and Node environments
const domWindow = typeof window !== 'undefined' ? window : (new JSDOM('')).window;
const DOMPurify = createDOMPurify(domWindow as unknown as Window);

/**
 * Sanitizes user input to prevent XSS and limit length.
 * @param {string} input - Raw user input string
 * @returns {string} - Sanitized and trimmed string
 * @example
 * const safeValue = sanitize('<script>alert(1)</script> Hello ');
 * // returns 'Hello'
 */
export const sanitize = (input: string): string => {
  const sanitized = DOMPurify.sanitize(input.trim());
  return sanitized.trim().substring(0, MAX_INPUT_LENGTH);
};

/**
 * Validates that input does not contain dangerous characters.
 * @param {string} input - Input to check
 * @returns {boolean} - True if input is "clean"
 */
export const isCleanInput = (input: string): boolean => {
  const dangerousChars = /[<>{}'";\\]/;
  return !dangerousChars.test(input);
};
