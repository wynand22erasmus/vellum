import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { safeReturnTo } from '@/lib/auth';
import { AuthLayout } from '@/components/layout/auth-layout';
import type { RouterContext } from '@/lib/router-context';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context, search }) => {
    const auth = (context as RouterContext).auth;
    if (auth.loading) return;
    if (auth.user) {
      const returnTo = safeReturnTo((search as { returnTo?: string }).returnTo);
      throw redirect({ to: returnTo });
    }
  },
  component: LoginRouteLayout,
});

function LoginRouteLayout() {
  return (
    <AuthLayout variant="split">
      <Outlet />
    </AuthLayout>
  );
}
