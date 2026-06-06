/**
 * Lookup helpers for {@link DB_COLUMN_DESCRIPTORS} and derived column metadata.
 *
 * @packageDocumentation
 */

import type { DataTableColumnDataType, DataTableFilterOption } from './data-table-types.ts';
import {
  DB_COLUMN_DESCRIPTORS,
  DERIVED_COLUMN_DESCRIPTORS,
  TABLE_ROW_DB_MODEL,
  type DbColumnDescriptor,
  type DbModelName,
  type DerivedColumnDescriptor,
  type TableRowKind,
} from './data-table-db-schema.ts';
import type { DataTableColumnMeta } from '@/components/data-table/column-meta.ts';

/** Raw descriptor for a Prisma model field, if registered. */
export function getDbColumnDescriptor(
  model: DbModelName,
  field: string,
): DbColumnDescriptor | undefined {
  return DB_COLUMN_DESCRIPTORS[model]?.[field];
}

/** Descriptor for a computed API field (e.g. `linkActive`, `status`). */
export function getDerivedColumnDescriptor(field: string): DerivedColumnDescriptor | undefined {
  return DERIVED_COLUMN_DESCRIPTORS[field];
}

/** All field descriptors for a model. */
export function listDbColumnsForModel(model: DbModelName): readonly DbColumnDescriptor[] {
  return Object.values(DB_COLUMN_DESCRIPTORS[model] ?? {});
}

/** Primary Prisma model for a known table row type name. */
export function dbModelForRowKind(rowKind: TableRowKind): DbModelName {
  return TABLE_ROW_DB_MODEL[rowKind];
}

/** Column meta resolved from Prisma registry and optional overrides. */
export type ResolvedDbColumnMeta = {
  dataType: DataTableColumnDataType;
  enumOptions?: readonly DataTableFilterOption[];
  filterAs?: DbColumnDescriptor['filterAs'];
  dbModel: DbModelName;
  dbField: string;
  descriptor: DbColumnDescriptor;
};

/** Converts a DB/derived descriptor into column meta. */
export function dbDescriptorToColumnMeta(descriptor: DbColumnDescriptor): DataTableColumnMeta {
  return {
    dataType: descriptor.dataType,
    enumOptions: descriptor.enumOptions,
    dbModel: descriptor.model,
    dbField: descriptor.field,
    filterAs: descriptor.filterAs,
  };
}

/**
 * Resolves filter metadata for a column accessor on a known row kind.
 * Checks derived fields first, then Prisma fields on the row's model.
 */
export function resolveDbColumnMeta(
  field: string,
  rowKind?: TableRowKind,
  explicitModel?: DbModelName,
): ResolvedDbColumnMeta | undefined {
  const derived = getDerivedColumnDescriptor(field);
  if (derived) {
    if (derived.models && explicitModel && !derived.models.includes(explicitModel)) {
      // skip when derived field belongs to another model
    } else if (!derived.models || !explicitModel || derived.models.includes(explicitModel)) {
      return {
        dataType: derived.dataType,
        enumOptions: derived.enumOptions,
        filterAs: derived.filterAs,
        dbModel: derived.model,
        dbField: derived.field,
        descriptor: derived,
      };
    }
  }

  const model = explicitModel ?? (rowKind ? dbModelForRowKind(rowKind) : undefined);
  if (!model) {
    return undefined;
  }

  const descriptor = getDbColumnDescriptor(model, field);
  if (!descriptor) {
    return undefined;
  }

  return {
    dataType: descriptor.dataType,
    enumOptions: descriptor.enumOptions,
    filterAs: descriptor.filterAs,
    dbModel: model,
    dbField: field,
    descriptor,
  };
}

/** Merges explicit column meta with DB registry lookup (explicit wins). */
export function mergeColumnMetaWithDb(
  field: string,
  meta: DataTableColumnMeta | undefined,
  rowKind?: TableRowKind,
): DataTableColumnMeta {
  const fromDb = resolveDbColumnMeta(field, rowKind ?? meta?.rowKind, meta?.dbModel);
  if (!fromDb) {
    return meta ?? {};
  }

  return {
    ...dbDescriptorToColumnMeta(fromDb.descriptor),
    ...meta,
    dataType: meta?.dataType ?? fromDb.dataType,
    enumOptions: meta?.enumOptions ?? fromDb.enumOptions,
    filterAs: meta?.filterAs ?? fromDb.filterAs,
    dbModel: meta?.dbModel ?? fromDb.dbModel,
    dbField: meta?.dbField ?? fromDb.dbField,
  };
}
