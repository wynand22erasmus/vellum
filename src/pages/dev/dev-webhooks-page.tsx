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
import { type WebhookDelivery, useAdminListPageQuery } from '@/lib/queries/admin';
import { AdminListPage } from '@/pages/admin/admin-list-page';

/** Lists outbound webhook delivery attempts from `WebhookDelivery`. */
export function DevWebhooksPage() {
  const listState = useAdminListState();
  const query = useAdminListPageQuery<WebhookDelivery>(
    '/api/dev/webhook-deliveries',
    'WebhookDelivery',
    listState.queryParams,
  );

  const columns = useMemo<ColumnDef<WebhookDelivery>[]>(
    () => [
      dbColumn<WebhookDelivery>('WebhookDelivery', 'createdAt', 'Time'),
      dbColumn<WebhookDelivery>('WebhookDelivery', 'eventType', 'Event'),
      dbColumn<WebhookDelivery>('WebhookDelivery', 'success', 'OK', {
        cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
      }),
      dbColumn<WebhookDelivery>('WebhookDelivery', 'responseStatus', 'Status', {
        cell: ({ getValue }) => {
          const status = getValue() as number | null;
          return status ?? '—';
        },
      }),
      dbColumn<WebhookDelivery>('WebhookDelivery', 'attempt', 'Attempt'),
      dbColumn<WebhookDelivery>('WebhookDelivery', 'targetUrl', 'Target', {
        cell: ({ getValue }) => (
          <span className="font-mono text-xs break-all">{getValue() as string}</span>
        ),
      }),
      dbColumn<WebhookDelivery>('WebhookDelivery', 'payload', 'Payload', {
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
