import { createFileRoute, redirect } from '@tanstack/react-router';
import { normalizeAppPath } from '@/lib/sidebar-nav';

export const Route = createFileRoute('/_authenticated/admin/document-links/')({
  beforeLoad: () => {
    throw redirect({ to: normalizeAppPath('/admin/communications') });
  },
});
