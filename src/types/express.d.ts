/**
 * Augments Express `Request` with Vellum-specific fields.
 *
 * @packageDocumentation
 */

import type { AuthUser } from '../lib/auth/types.ts';

declare global {
  namespace Express {
    interface Request {
      /** Set by {@link ../middleware/devAuth.ts} on dashboard routes. */
      user?: AuthUser;
    }
  }
}

/** Makes this file a module so `declare global` merges correctly. */
export {};
