import { createFileRoute } from '@tanstack/react-router';
import { AdminAuditLogsPage } from '@/pages/admin/admin-audit-logs-page';

export const Route = createFileRoute('/_authenticated/admin/audit-logs/')({
  component: AdminAuditLogsPage,
});
