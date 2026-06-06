import { createFileRoute } from '@tanstack/react-router';
import { AdminDocumentsPage } from '@/pages/admin/admin-documents-page';

export const Route = createFileRoute('/_authenticated/admin/documents/')({
  component: AdminDocumentsPage,
});
