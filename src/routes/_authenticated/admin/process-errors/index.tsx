import { createFileRoute } from '@tanstack/react-router';
import { AdminProcessErrorsPage } from '@/pages/admin/admin-process-errors-page';

export const Route = createFileRoute('/_authenticated/admin/process-errors/')({
  component: AdminProcessErrorsPage,
});
