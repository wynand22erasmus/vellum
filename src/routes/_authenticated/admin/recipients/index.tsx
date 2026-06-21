import { createFileRoute } from '@tanstack/react-router';
import { AdminRecipientsPage } from '@/pages/admin/admin-recipients-page';

export const Route = createFileRoute('/_authenticated/admin/recipients/')({
  component: AdminRecipientsPage,
});
