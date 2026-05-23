/** Cookie written by {@link applyTheme} in ui-v2; read by dev-service iframe proxies. */
export const VELLUM_RESOLVED_THEME_COOKIE = 'vellum-resolved-theme';

export function readResolvedThemeCookie(cookieHeader: string | undefined): 'light' | 'dark' {
  if (!cookieHeader) return 'light';
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${VELLUM_RESOLVED_THEME_COOKIE}=(light|dark)(?:;|$)`),
  );
  return match?.[1] === 'dark' ? 'dark' : 'light';
}
