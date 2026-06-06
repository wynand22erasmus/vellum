import { createFileRoute, Outlet } from '@tanstack/react-router';
import { requireAuth } from '@/lib/auth-guards';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    requireAuth(context, location.pathname);
  },
  component: () => <Outlet />,
});
