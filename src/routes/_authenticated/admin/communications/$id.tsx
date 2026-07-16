import { createFileRoute } from '@tanstack/react-router';
import { AdminCommunicationDetailPage } from '@/pages/admin/admin-communication-detail-page';

export const Route = createFileRoute('/_authenticated/admin/communications/$id')({
  component: AdminCommunicationDetailPage,
});
