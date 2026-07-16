import { createFileRoute } from '@tanstack/react-router';
import { AdminRecipientDetailPage } from '@/pages/admin/admin-recipient-detail-page';

export const Route = createFileRoute('/_authenticated/admin/recipients/$id')({
  component: AdminRecipientDetailPage,
});
