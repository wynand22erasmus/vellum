/**
 * Authentication types for dashboard sessions.
 *
 * @packageDocumentation
 */

/** Dashboard role stored in the local `users` table. */
export type UserKind = 'ADMIN' | 'CONSUMER';

/**
 * Authenticated dashboard user stored in the session JWT and loaded from Postgres.
 */
export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  kind: UserKind;
  firstName: string | null;
  lastName: string | null;
  profilePictureUrl: string | null;
}
