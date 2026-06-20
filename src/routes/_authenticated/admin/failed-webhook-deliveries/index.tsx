import { createFileRoute } from '@tanstack/react-router';
import { AdminFailedWebhookDeliveriesPage } from '@/pages/admin/admin-failed-webhook-deliveries-page';

export const Route = createFileRoute('/_authenticated/admin/failed-webhook-deliveries/')({
  component: AdminFailedWebhookDeliveriesPage,
});
