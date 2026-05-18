/**
 * Authentication types for dashboard sessions.
 *
 * @packageDocumentation
 */

/**
 * Authenticated dashboard user stored in the session JWT.
 */
export interface AuthUser {
  id: string;
  email: string;
}
