// @ts-ignore - JSDOM might not have types in this environment
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { MAX_INPUT_LENGTH } from './constants';

/**
 * World-class XSS sanitization utility.
 * Supports both Browser (Next.js client) and Node (Vitest/Server) environments.
 */

// @ts-ignore
const domWindow = typeof window !== 'undefined' ? window : (new JSDOM('')).window;
const DOMPurify = createDOMPurify(domWindow as any);

/**
 * Sanitizes user input to prevent XSS and limit length.
 * @param {string} input - Raw user input string
 * @returns {string} - Sanitized and trimmed string
 */
export const sanitize = (input: string): string => {
  const sanitized = DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: []
  });
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
