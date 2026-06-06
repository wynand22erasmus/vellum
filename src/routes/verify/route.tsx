import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AuthLayout } from '@/components/layout/auth-layout';

export const Route = createFileRoute('/verify')({
  component: VerifyRouteLayout,
});

function VerifyRouteLayout() {
  return (
    <AuthLayout variant="centered">
      <Outlet />
    </AuthLayout>
  );
}
