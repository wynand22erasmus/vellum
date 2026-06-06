import { createFileRoute, Outlet } from '@tanstack/react-router';
import { requireAdmin } from '@/lib/auth-guards';
import { normalizeAppPath } from '@/lib/sidebar-nav';

export const Route = createFileRoute('/_authenticated/dev')({
  beforeLoad: ({ context }) => {
    requireAdmin(context, normalizeAppPath('/dev'));
  },
  component: () => <Outlet />,
});
