/**
 * React context for theme state shared by `ThemeProvider` and `useTheme`.
 *
 * @packageDocumentation
 */

import { createContext } from 'react';
import type { Theme } from './theme.ts';

/** Theme context value exposed to the component tree. */
export type ThemeContextValue = {
  theme: Theme;
  /** Resolved light/dark value after applying `system` preference. */
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  /** Toggles between light and dark based on the current resolved theme. */
  toggleTheme: () => void;
};

/** React context for theme; `null` outside `ThemeProvider`. */
export const ThemeContext = createContext<ThemeContextValue | null>(null);
