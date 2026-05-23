export type Theme = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'vellum-theme';

/** Read by dev-service iframe proxies (Mailpit, Adminer) for light/dark styling. */
export const RESOLVED_THEME_COOKIE = 'vellum-resolved-theme';

export function getStoredTheme(): Theme | null {
  if (typeof localStorage === 'undefined') return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return null;
}

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function syncResolvedThemeCookie(resolved: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${RESOLVED_THEME_COOKIE}=${resolved}; Path=/; SameSite=Lax; Max-Age=31536000${secure}`;
}

export function applyTheme(theme: Theme): void {
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.style.colorScheme = resolved;
  syncResolvedThemeCookie(resolved);
}
