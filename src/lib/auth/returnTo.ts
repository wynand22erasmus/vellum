/**
 * Validates post-login redirect targets to prevent open redirects.
 *
 * @packageDocumentation
 */

const DEFAULT_RETURN_TO = '/dashboard';

/**
 * Returns a same-origin path safe to use after login, or the default dashboard path.
 *
 * @param value - Raw `returnTo` query value
 */
export function safeReturnTo(value: string | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return DEFAULT_RETURN_TO;
  }
  return value;
}
