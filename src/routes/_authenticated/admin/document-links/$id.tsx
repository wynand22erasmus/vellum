import { createFileRoute, redirect } from '@tanstack/react-router';
import { normalizeAppPath } from '@/lib/sidebar-nav';

export const Route = createFileRoute('/_authenticated/admin/document-links/$id')({
  beforeLoad: ({ params }) => {
    throw redirect({ to: normalizeAppPath(`/admin/communications/${params.id}`) });
  },
});
