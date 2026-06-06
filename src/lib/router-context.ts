/**
 * TanStack Router context shared by app routes.
 *
 * @packageDocumentation
 */

import type { QueryClient } from '@tanstack/react-query';
import type { AuthContextValue } from '@/providers/auth-provider';
import type { BrandPreset } from '@/lib/brand/presets';

/** Router context passed to loaders and route components. */
export type RouterContext = {
  queryClient: QueryClient;
  brandPreset: BrandPreset;
  auth: AuthContextValue;
};

declare module '@tanstack/react-router' {
  interface Register {
    routerContext: RouterContext;
  }
}
