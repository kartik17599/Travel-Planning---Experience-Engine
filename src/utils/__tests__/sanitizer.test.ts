import { describe, it, expect } from 'vitest';
import { sanitize, isCleanInput } from '../sanitizer';
import { MAX_INPUT_LENGTH } from '../constants';

describe('sanitize()', () => {
  it('strips HTML tags', () => {
    expect(sanitize('hi <script>alert(1)</script>')).toBe('hi');
  });

  it('truncates to MAX_INPUT_LENGTH', () => {
    const longInput = 'a'.repeat(MAX_INPUT_LENGTH + 100);
    expect(sanitize(longInput).length).toBe(MAX_INPUT_LENGTH);
  });

  it('handles empty string', () => {
    expect(sanitize('')).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello');
  });
});

describe('isCleanInput()', () => {
  it('rejects script tags', () => {
    expect(isCleanInput('<script>')).toBe(false);
  });

  it('rejects curly braces', () => {
    expect(isCleanInput('{dangerous}')).toBe(false);
  });

  it('accepts clean alphanumeric input', () => {
    expect(isCleanInput('Paris, France-123')).toBe(true);
  });
});
