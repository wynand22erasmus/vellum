/**
 * Typed column builders for TanStack tables.
 *
 * @packageDocumentation
 */

import type { ColumnDef } from '@tanstack/react-table';
import {
  DOCUMENT_STATUS_FILTER_OPTIONS,
  documentStatusFilterTags,
  type DocumentStatusSource,
} from '@/lib/document-status-filter-options';
import {
  mergeColumnMetaWithDb,
  resolveDbColumnMeta,
} from '@/lib/data-table-db-column-registry';
import type { DbModelName } from '@/lib/data-table-db-schema';
import type { DataTableFilterOption } from '@/lib/data-table-types';
import type { DataTableColumnMeta } from '@/components/data-table/column-meta';
import { filterFnIdForDataType } from '@/components/data-table/tanstack-filter-fns';

function withTypedMeta<TData>(
  column: ColumnDef<TData, unknown>,
  meta: DataTableColumnMeta,
): ColumnDef<TData, unknown> {
  const filterFn = filterFnIdForDataType(meta.dataType, meta.filter);
  return {
    ...column,
    meta: { ...column.meta, ...meta },
    filterFn,
  };
}

/**
 * Builds a column using Prisma schema metadata for filter type inference.
 * Falls back to text when the field is not in the registry.
 */
export function dbColumn<TData>(
  model: DbModelName,
  field: string,
  header: string,
  extra?: Partial<ColumnDef<TData, unknown>>,
): ColumnDef<TData, unknown> {
  const resolved = resolveDbColumnMeta(field, undefined, model);

  if (resolved?.filterAs === 'document-status-facet') {
    return documentStatusColumn({
      id: field === 'status' ? 'status' : field,
      header,
      cell: (extra?.cell ?? (() => null)) as ColumnDef<DocumentStatusSource, unknown>['cell'],
    }) as ColumnDef<TData, unknown>;
  }

  if (resolved?.filterAs === 'nullable-presence') {
    return booleanColumn<TData>({
      accessorKey: field as keyof TData & string,
      header,
      accessorFn: (row) => row[field as keyof TData] != null && row[field as keyof TData] !== '',
      cell: extra?.cell,
    });
  }

  const meta = mergeColumnMetaWithDb(field, { dbModel: model, dbField: field }, undefined);
  return withTypedMeta(
    { accessorKey: field as keyof TData & string, header, ...extra },
    meta,
  );
}

/** Text column with substring filter. */
export function textColumn<TData>(
  accessorKey: keyof TData & string,
  header: string,
  extra?: Partial<ColumnDef<TData, unknown>>,
): ColumnDef<TData, unknown> {
  return withTypedMeta(
    { accessorKey, header, ...extra },
    mergeColumnMetaWithDb(accessorKey, { dataType: 'text' }, undefined),
  );
}

/** Email column with email-oriented text filter. */
export function emailColumn<TData>(
  accessorKey: keyof TData & string,
  header: string,
  extra?: Partial<ColumnDef<TData, unknown>>,
): ColumnDef<TData, unknown> {
  return withTypedMeta(
    { accessorKey, header, ...extra },
    mergeColumnMetaWithDb(accessorKey, { dataType: 'email' }, undefined),
  );
}

/** ISO datetime column with prefix date filter. */
export function dateColumn<TData>(
  accessorKey: keyof TData & string,
  header: string,
  extra?: Partial<ColumnDef<TData, unknown>>,
): ColumnDef<TData, unknown> {
  return withTypedMeta(
    { accessorKey, header, ...extra },
    mergeColumnMetaWithDb(accessorKey, { dataType: 'datetime' }, undefined),
  );
}

/** Numeric column with equality or substring filter. */
export function numberColumn<TData>(
  accessorKey: keyof TData & string,
  header: string,
  extra?: Partial<ColumnDef<TData, unknown>>,
): ColumnDef<TData, unknown> {
  return withTypedMeta(
    { accessorKey, header, ...extra },
    mergeColumnMetaWithDb(accessorKey, { dataType: 'number' }, undefined),
  );
}

/** Boolean column with yes/no multiselect filter. */
export function booleanColumn<TData>(
  config: {
    id?: string;
    accessorKey?: keyof TData & string;
    accessorFn?: (row: TData) => boolean;
    header: string;
    cell?: ColumnDef<TData, unknown>['cell'];
  },
): ColumnDef<TData, unknown> {
  const { id, accessorKey, accessorFn, header, cell } = config;
  const field = accessorKey ?? id ?? header;
  return withTypedMeta(
    {
      id,
      accessorKey,
      accessorFn: accessorFn
        ? (row) => String(accessorFn(row))
        : accessorKey
          ? (row) => String(Boolean(row[accessorKey as keyof TData]))
          : undefined,
      header,
      cell,
    },
    mergeColumnMetaWithDb(field, { dataType: 'boolean' }, undefined),
  );
}

/** Enum column with searchable multiselect filter. */
export function enumColumn<TData>(
  config: {
    id?: string;
    accessorKey?: keyof TData & string;
    accessorFn?: (row: TData) => unknown;
    header: string;
    options: readonly DataTableFilterOption[];
    cell?: ColumnDef<TData, unknown>['cell'];
  },
): ColumnDef<TData, unknown> {
  const { id, accessorKey, accessorFn, header, options, cell } = config;
  const field = accessorKey ?? id ?? header;
  return withTypedMeta(
    {
      id,
      accessorKey,
      accessorFn: accessorFn ? (row) => accessorFn(row) : undefined,
      header,
      cell,
    },
    mergeColumnMetaWithDb(field, { dataType: 'enum', enumOptions: options }, undefined),
  );
}

/** Document status facet column (link/file/downloaded/deleted tags). */
export function documentStatusColumn<TData extends DocumentStatusSource>(
  config: {
    id?: string;
    header: string;
    cell: ColumnDef<TData, unknown>['cell'];
  },
): ColumnDef<TData, unknown> {
  return enumColumn<TData>({
    id: config.id ?? 'status',
    header: config.header,
    accessorFn: (row) => documentStatusFilterTags(row),
    options: DOCUMENT_STATUS_FILTER_OPTIONS,
    cell: config.cell,
  });
}

/** Disables sorting and filtering on utility columns (e.g. actions). */
export function disableColumnInteractions<TData>(
  column: ColumnDef<TData, unknown>,
): ColumnDef<TData, unknown> {
  return {
    ...column,
    enableSorting: false,
    enableColumnFilter: false,
    meta: { ...column.meta, filter: false },
  };
}
