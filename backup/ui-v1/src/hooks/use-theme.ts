/**
 * React hook for theme state from {@link ../components/theme-provider.tsx}.
 *
 * @packageDocumentation
 */

import { useContext } from 'react';
import { ThemeContext } from '../lib/theme-context.ts';

/**
 * Returns theme, setter, resolved mode, and toggle from context.
 *
 * @throws {Error} When used outside `ThemeProvider`
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
