import { createFileRoute } from '@tanstack/react-router';
import { DevEmbedPage } from '@/pages/dev/dev-embed-page';

export const Route = createFileRoute('/_authenticated/dev/$serviceId')({
  component: DevEmbedPage,
});
