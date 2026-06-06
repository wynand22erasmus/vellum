import { createRootRoute } from '@tanstack/react-router';
import { AppShellLayout } from '@/components/layout/app-shell-layout';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <AppShellLayout />
      <div id="portal-root" />
    </>
  );
}
