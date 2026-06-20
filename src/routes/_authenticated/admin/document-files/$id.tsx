import { createFileRoute } from '@tanstack/react-router';
import { AdminDocumentFileDetailPage } from '@/pages/admin/admin-document-file-detail-page';

export const Route = createFileRoute('/_authenticated/admin/document-files/$id')({
  component: AdminDocumentFileDetailPage,
});
