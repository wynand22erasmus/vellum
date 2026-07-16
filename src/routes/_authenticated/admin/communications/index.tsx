import { createFileRoute } from '@tanstack/react-router';
import { AdminCommunicationsPage } from '@/pages/admin/admin-communications-page';

export const Route = createFileRoute('/_authenticated/admin/communications/')({
  component: AdminCommunicationsPage,
});
