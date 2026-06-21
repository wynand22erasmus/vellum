# Type Alias: ResolvedDbColumnMeta

> **ResolvedDbColumnMeta** = `object`

Defined in: [src/lib/data-table-db-column-registry.ts:42](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-column-registry.ts#L42)

Column meta resolved from Prisma registry and optional overrides.

## Properties

### dataType

> **dataType**: [`DataTableColumnDataType`](../../data-table-types/type-aliases/DataTableColumnDataType.md)

Defined in: [src/lib/data-table-db-column-registry.ts:43](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-column-registry.ts#L43)

***

### dbField

> **dbField**: `string`

Defined in: [src/lib/data-table-db-column-registry.ts:47](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-column-registry.ts#L47)

***

### dbModel

> **dbModel**: [`DbModelName`](../../data-table-db-schema/type-aliases/DbModelName.md)

Defined in: [src/lib/data-table-db-column-registry.ts:46](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-column-registry.ts#L46)

***

### descriptor

> **descriptor**: [`DbColumnDescriptor`](../../data-table-db-schema/type-aliases/DbColumnDescriptor.md)

Defined in: [src/lib/data-table-db-column-registry.ts:48](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-column-registry.ts#L48)

***

### enumOptions?

> `optional` **enumOptions?**: readonly [`DataTableFilterOption`](../../data-table-types/type-aliases/DataTableFilterOption.md)[]

Defined in: [src/lib/data-table-db-column-registry.ts:44](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-column-registry.ts#L44)

***

### filterAs?

> `optional` **filterAs?**: [`DbColumnDescriptor`](../../data-table-db-schema/type-aliases/DbColumnDescriptor.md)\[`"filterAs"`\]

Defined in: [src/lib/data-table-db-column-registry.ts:45](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-column-registry.ts#L45)
