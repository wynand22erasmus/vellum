/**
 * Resolved theme cookie shared between the SPA and dev iframe proxies.
 *
 * {@link applyTheme} in `src/lib/theme.ts` writes this cookie; Vite dev proxies
 * read it to inject matching light/dark styles into embedded service HTML.
 *
 * @packageDocumentation
 */

/** Cookie written by {@link applyTheme}; read by dev-service iframe proxies. */
export const VELLUM_RESOLVED_THEME_COOKIE = 'vellum-resolved-theme';

/**
 * Parse resolved light/dark theme from the `Cookie` header.
 *
 * @param cookieHeader - Raw `Cookie` header value from the proxied request.
 * @returns `light` or `dark`; defaults to `light` when the cookie is absent.
 */
export function readResolvedThemeCookie(cookieHeader: string | undefined): 'light' | 'dark' {
  if (!cookieHeader) return 'light';
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${VELLUM_RESOLVED_THEME_COOKIE}=(light|dark)(?:;|$)`),
  );
  return match?.[1] === 'dark' ? 'dark' : 'light';
}
