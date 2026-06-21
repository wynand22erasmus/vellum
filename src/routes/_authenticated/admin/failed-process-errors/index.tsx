import { createFileRoute, redirect } from '@tanstack/react-router';
import { normalizeAppPath } from '@/lib/sidebar-nav';

export const Route = createFileRoute('/_authenticated/admin/failed-process-errors/')({
  beforeLoad: () => {
    throw redirect({ to: normalizeAppPath('/admin/dead-letters') });
  },
});
