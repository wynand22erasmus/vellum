import { createFileRoute } from '@tanstack/react-router';
import { AdminIndexPage } from '@/pages/admin/admin-index-page';

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminIndexPage,
});
