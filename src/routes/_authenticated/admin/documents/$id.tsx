import { createFileRoute } from '@tanstack/react-router';
import { AdminDocumentDetailPage } from '@/pages/admin/admin-document-detail-page';

export const Route = createFileRoute('/_authenticated/admin/documents/$id')({
  component: AdminDocumentDetailPage,
});
