/**
 * Augments Express `Request` with Vellum-specific fields.
 *
 * @packageDocumentation
 */

import type { AuthUser } from '../lib/auth/types.ts';

declare global {
  namespace Express {
    interface Request {
      /** Set by {@link ../middleware/requestId.ts}. */
      requestId?: string;
      /** Shared incident UUID for audit + process-error linking (e.g. verify wrong password). */
      errorCorrelationId?: string;
      /** Document context for process-error linking on public routes. */
      errorDocumentId?: string;
      /** Set by {@link ../middleware/devAuth.ts} or {@link ../middleware/adminAuth.ts}. */
      user?: AuthUser;
    }
  }
}

/** Makes this file a module so `declare global` merges correctly. */
export {};
