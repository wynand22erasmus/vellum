import { createFileRoute } from '@tanstack/react-router';
import { AdminFileDetailPage } from '@/pages/admin/admin-file-detail-page';

export const Route = createFileRoute('/_authenticated/admin/files/$id')({
  component: AdminFileDetailPage,
});
