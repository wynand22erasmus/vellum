import { createFileRoute } from '@tanstack/react-router';
import { AdminDeadLettersPage } from '@/pages/admin/admin-dead-letters-page';

export const Route = createFileRoute('/_authenticated/admin/dead-letters/')({
  component: AdminDeadLettersPage,
});
