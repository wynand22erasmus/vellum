import { createFileRoute } from '@tanstack/react-router';
import { DevIndexPage } from '@/pages/dev/dev-index-page';

export const Route = createFileRoute('/_authenticated/dev/')({
  component: DevIndexPage,
});
