/**
 * Paginated admin list fetch helper for TanStack Query.
 *
 * @packageDocumentation
 */

import { fetchJson } from '@/lib/api-client';
import { buildAdminListQuery, type AdminListParams } from '@/lib/queries/query-keys';

/** Paginated admin list response shape. */
export type AdminListResult<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

/** Fetch a paginated admin list with optional server-side filters. */
export async function fetchAdminListPage<T>(
  endpoint: string,
  dataKey: string,
  params: AdminListParams = {},
): Promise<AdminListResult<T>> {
  const data = await fetchJson<Record<string, unknown>>(`${endpoint}?${buildAdminListQuery(params)}`);
  return {
    items: (data[dataKey] as T[]) ?? [],
    total: Number(data.total ?? 0),
    limit: Number(data.limit ?? params.limit ?? 50),
    offset: Number(data.offset ?? params.offset ?? 0),
  };
}
