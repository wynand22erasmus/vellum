import { createFileRoute } from '@tanstack/react-router';
import { AdminFailedProcessErrorsPage } from '@/pages/admin/admin-failed-process-errors-page';

export const Route = createFileRoute('/_authenticated/admin/failed-process-errors/')({
  component: AdminFailedProcessErrorsPage,
});
