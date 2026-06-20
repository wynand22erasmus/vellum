import { createFileRoute } from '@tanstack/react-router';
import { AdminDocumentFilesPage } from '@/pages/admin/admin-document-files-page';

export const Route = createFileRoute('/_authenticated/admin/document-files/')({
  component: AdminDocumentFilesPage,
});
