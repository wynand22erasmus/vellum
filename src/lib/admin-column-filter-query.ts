/**
 * Maps TanStack column filter state to admin list API query parameters.
 *
 * @packageDocumentation
 */

import type { ColumnFiltersState } from '@tanstack/react-table';
import { parseMultiSelectFilterValue } from '@/lib/data-table-filter-value';

/** Column ids filtered client-side on the current page (no API param). */
export const CLIENT_ONLY_COLUMN_FILTER_IDS = new Set(['status']);

/** Splits column filters into server query params and client-only filters. */
export function splitAdminColumnFilters(filters: ColumnFiltersState): {
  serverParams: Record<string, string>;
  clientFilters: ColumnFiltersState;
} {
  return {
    serverParams: columnFiltersToAdminQueryParams(filters),
    clientFilters: filters.filter(({ id }) => CLIENT_ONLY_COLUMN_FILTER_IDS.has(id)),
  };
}

/** Converts header column filters into `/api/admin/*` query string fields. */
export function columnFiltersToAdminQueryParams(
  filters: ColumnFiltersState,
): Record<string, string> {
  const params: Record<string, string> = {};

  for (const { id, value } of filters) {
    if (CLIENT_ONLY_COLUMN_FILTER_IDS.has(id)) {
      continue;
    }

    const raw = String(value ?? '').trim();
    if (!raw) {
      continue;
    }

    switch (id) {
      case 'emailVerified': {
        const selected = parseMultiSelectFilterValue(raw);
        if (selected.length === 1) {
          params.emailVerified = selected[0]!;
        }
        break;
      }
      case 'kind':
      case 'eventType': {
        const selected = parseMultiSelectFilterValue(raw);
        if (selected.length > 0) {
          params[id] = selected.join(',');
        }
        break;
      }
      case 'timestamp':
      case 'createdAt': {
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
          params.from = `${raw}T00:00:00.000Z`;
          params.to = `${raw}T23:59:59.999Z`;
        } else {
          params.from = raw;
        }
        break;
      }
      default:
        params[id] = raw;
    }
  }

  return params;
}
