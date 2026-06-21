import { createFileRoute } from '@tanstack/react-router';
import { AdminFilesPage } from '@/pages/admin/admin-files-page';

export const Route = createFileRoute('/_authenticated/admin/files/')({
  component: AdminFilesPage,
});
