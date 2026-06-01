/**
 * Reads authenticated session state from {@link AuthProvider}.
 *
 * @packageDocumentation
 */

import { useAuthContext, type AuthContextValue } from '@/components/providers/auth-provider';

/** Result payload returned by {@link useAuthMe}. */
export type UseAuthMeResult = AuthContextValue;

/** Returns the current session user and refresh helpers from auth context. */
export function useAuthMe(): UseAuthMeResult {
  return useAuthContext();
}
