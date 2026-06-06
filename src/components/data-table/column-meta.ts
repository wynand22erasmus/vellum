/**
 * TanStack Table column meta for data tables.
 *
 * @packageDocumentation
 */

import type { DbColumnFilterAs, DbModelName, TableRowKind } from '@/lib/data-table-db-schema';
import type {
  DataTableColumnDataType,
  DataTableColumnFilter,
  DataTableFilterOption,
} from '@/lib/data-table-types';

/** Column meta attached via `ColumnDef.meta` for filter/sort inference. */
export type DataTableColumnMeta = {
  dataType?: DataTableColumnDataType;
  /** Explicit filter UI; omit to infer from `dataType` or {@link dbModel}/{@link dbField}. */
  filter?: DataTableColumnFilter | false;
  enumOptions?: readonly DataTableFilterOption[];
  /** Prisma model backing this column (enables registry lookup). */
  dbModel?: DbModelName;
  dbField?: string;
  /** Known row type name for registry lookup when `dbModel` is omitted. */
  rowKind?: TableRowKind;
  /** Registry hint for non-scalar filter semantics. */
  filterAs?: DbColumnFilterAs;
};

declare module '@tanstack/react-table' {
  // Module augmentation — fields live on DataTableColumnMeta.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> extends DataTableColumnMeta {}
}
