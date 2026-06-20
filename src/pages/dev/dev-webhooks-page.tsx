/**
 * Dev webhook delivery inspector (Mailpit-style inbox).
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn } from '@/components/data-table/column-helpers';
import { useAdminListState } from '@/hooks/use-admin-list-state';
import { useAdminListPageQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';

type WebhookDeliveryRow = {
  id: string;
  deliveryId: string;
  auditLogId: string;
  eventType: string;
  targetUrl: string;
  payload: Record<string, unknown>;
  responseStatus: number | null;
  responseBody: string | null;
  success: boolean;
  attempt: number;
  createdAt: string;
};

/** Lists outbound webhook delivery attempts from `WebhookDelivery`. */
export function DevWebhooksPage() {
  const listState = useAdminListState();
  const query = useAdminListPageQuery<WebhookDeliveryRow>(
    '/api/dev/webhook-deliveries',
    'deliveries',
    listState.queryParams,
  );

  const columns = useMemo<ColumnDef<WebhookDeliveryRow>[]>(
    () => [
      dbColumn<WebhookDeliveryRow>('WebhookDelivery', 'createdAt', 'Time'),
      dbColumn<WebhookDeliveryRow>('WebhookDelivery', 'eventType', 'Event'),
      dbColumn<WebhookDeliveryRow>('WebhookDelivery', 'success', 'OK', {
        cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
      }),
      dbColumn<WebhookDeliveryRow>('WebhookDelivery', 'responseStatus', 'Status', {
        cell: ({ getValue }) => {
          const status = getValue() as number | null;
          return status ?? '—';
        },
      }),
      dbColumn<WebhookDeliveryRow>('WebhookDelivery', 'attempt', 'Attempt'),
      dbColumn<WebhookDeliveryRow>('WebhookDelivery', 'targetUrl', 'Target', {
        cell: ({ getValue }) => (
          <span className="font-mono text-xs break-all">{getValue() as string}</span>
        ),
      }),
      dbColumn<WebhookDeliveryRow>('WebhookDelivery', 'payload', 'Payload', {
        cell: ({ getValue }) => (
          <pre className="max-h-32 max-w-md overflow-auto whitespace-pre-wrap font-mono text-xs">
            {JSON.stringify(getValue(), null, 2)}
          </pre>
        ),
      }),
    ],
    [],
  );

  return (
    <AdminListPage
      title={PAGE_LABELS.devWebhooks.nav}
      description={PAGE_LABELS.devWebhooks.description}
      query={query}
      columns={columns}
      emptyTitle="No webhook deliveries yet"
      pageIndex={listState.pageIndex}
      onPageChange={listState.setPageIndex}
      pageSize={listState.pageSize}
    />
  );
}
