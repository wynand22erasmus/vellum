/**
 * TanStack Router bootstrap and provider tree.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useAuthContext } from '@/providers/auth-provider';
import { getBrandPreset } from '@/lib/brand/presets';
import type { RouterContext } from '@/lib/router-context';
import { routeTree } from '@/routeTree.gen';
import { BrandProvider } from '@/providers/brand-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RouterAuthSync } from '@/components/layout/router-auth-sync';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/main.css';

const queryClient = new QueryClient();

const defaultContext: RouterContext = {
  queryClient,
  brandPreset: getBrandPreset(import.meta.env.VITE_BRAND_PRESET),
  auth: {
    user: null,
    loading: true,
    isAdmin: false,
    refresh: async () => null,
  },
};

/** Shared TanStack Router instance. */
const router = createRouter({
  routeTree,
  context: defaultContext,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

export { router };

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

/** Application root (TanStack Router at `/`). */
export function App() {
  const auth = useAuthContext();
  const brandPreset = useMemo(
    () => getBrandPreset(import.meta.env.VITE_BRAND_PRESET as string | undefined),
    [],
  );

  return (
    <BrandProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <RouterProvider
              router={router}
              context={{ queryClient, brandPreset, auth }}
            />
            <RouterAuthSync router={router} auth={auth} />
            <Toaster richColors closeButton position="top-right" />
          </TooltipProvider>
          {import.meta.env.DEV ? (
            <>
              <TanStackRouterDevtools router={router} position="bottom-right" />
              <ReactQueryDevtools buttonPosition="bottom-left" />
            </>
          ) : null}
        </QueryClientProvider>
      </ThemeProvider>
    </BrandProvider>
  );
}
