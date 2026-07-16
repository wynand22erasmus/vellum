# Type Alias: DataTableColumnMeta

> **DataTableColumnMeta** = `object`

Defined in: [src/components/data-table/column-meta.ts:15](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-meta.ts#L15)

Column meta attached via `ColumnDef.meta` for filter/sort inference.

## Properties

### dataType?

> `optional` **dataType?**: [`DataTableColumnDataType`](../../../../lib/data-table-types/type-aliases/DataTableColumnDataType.md)

Defined in: [src/components/data-table/column-meta.ts:16](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-meta.ts#L16)

***

### dbField?

> `optional` **dbField?**: `string`

Defined in: [src/components/data-table/column-meta.ts:22](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-meta.ts#L22)

***

### dbModel?

> `optional` **dbModel?**: [`DbModelName`](../../../../lib/data-table-db-schema/type-aliases/DbModelName.md)

Defined in: [src/components/data-table/column-meta.ts:21](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-meta.ts#L21)

Prisma model backing this column (enables registry lookup).

***

### enumOptions?

> `optional` **enumOptions?**: readonly [`DataTableFilterOption`](../../../../lib/data-table-types/type-aliases/DataTableFilterOption.md)[]

Defined in: [src/components/data-table/column-meta.ts:19](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-meta.ts#L19)

***

### filter?

> `optional` **filter?**: [`DataTableColumnFilter`](../../../../lib/data-table-types/type-aliases/DataTableColumnFilter.md) \| `false`

Defined in: [src/components/data-table/column-meta.ts:18](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-meta.ts#L18)

Explicit filter UI; omit to infer from `dataType` or [dbModel](#dbmodel)/[dbField](#dbfield).

***

### filterAs?

> `optional` **filterAs?**: [`DbColumnFilterAs`](../../../../lib/data-table-db-schema/type-aliases/DbColumnFilterAs.md)

Defined in: [src/components/data-table/column-meta.ts:26](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-meta.ts#L26)

Registry hint for non-scalar filter semantics.

***

### rowKind?

> `optional` **rowKind?**: [`TableRowKind`](../../../../lib/data-table-db-schema/type-aliases/TableRowKind.md)

Defined in: [src/components/data-table/column-meta.ts:24](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-meta.ts#L24)

Known row type name for registry lookup when `dbModel` is omitted.
