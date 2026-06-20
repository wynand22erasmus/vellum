import { createFileRoute } from '@tanstack/react-router';
import { AdminWebhookDeliveriesPage } from '@/pages/admin/admin-webhook-deliveries-page';

export const Route = createFileRoute('/_authenticated/admin/webhook-deliveries/')({
  component: AdminWebhookDeliveriesPage,
});
