/**
 * Theme preference storage and DOM application for light/dark mode.
 *
 * @packageDocumentation
 */

/** User-selectable theme modes. */
export type Theme = 'light' | 'dark' | 'system';

/** `localStorage` key for the persisted theme preference. */
export const THEME_STORAGE_KEY = 'vellum-theme';

/**
 * Reads the persisted theme from `localStorage`, if any.
 *
 * @returns Stored theme or `null` when unset or unavailable (SSR)
 */
export function getStoredTheme(): Theme | null {
  if (typeof localStorage === 'undefined') return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return null;
}

/**
 * Resolves `system` to the current OS color scheme preference.
 *
 * @param theme - Selected theme mode
 */
export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Applies resolved light/dark class on `document.documentElement`.
 *
 * @param theme - Selected theme mode (including `system`)
 */
export function applyTheme(theme: Theme): void {
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}
