import { useAuthContext, type AuthContextValue } from '@/components/providers/auth-provider';

export type UseAuthMeResult = AuthContextValue;

export function useAuthMe(): UseAuthMeResult {
  return useAuthContext();
}
