import { createFileRoute, redirect } from '@tanstack/react-router';
import { normalizeAppPath } from '@/lib/sidebar-nav';

export const Route = createFileRoute('/$')({
  beforeLoad: () => {
    throw redirect({ to: normalizeAppPath('/login') });
  },
});
