import { createFileRoute } from '@tanstack/react-router';
import { AdminFailedAuditLogsPage } from '@/pages/admin/admin-failed-audit-logs-page';

export const Route = createFileRoute('/_authenticated/admin/failed-audit-logs/')({
  component: AdminFailedAuditLogsPage,
});
