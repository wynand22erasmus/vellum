# Type Alias: DbColumnDescriptor

> **DbColumnDescriptor** = `object`

Defined in: [src/lib/data-table-db-schema.ts:42](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-schema.ts#L42)

Metadata for one database column used to pick filter controls.

## Properties

### dataType

> **dataType**: [`DataTableColumnDataType`](../../data-table-types/type-aliases/DataTableColumnDataType.md)

Defined in: [src/lib/data-table-db-schema.ts:50](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-schema.ts#L50)

***

### enumOptions?

> `optional` **enumOptions?**: readonly [`DataTableFilterOption`](../../data-table-types/type-aliases/DataTableFilterOption.md)[]

Defined in: [src/lib/data-table-db-schema.ts:51](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-schema.ts#L51)

***

### field

> **field**: `string`

Defined in: [src/lib/data-table-db-schema.ts:44](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-schema.ts#L44)

***

### filterAs?

> `optional` **filterAs?**: [`DbColumnFilterAs`](DbColumnFilterAs.md)

Defined in: [src/lib/data-table-db-schema.ts:53](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-schema.ts#L53)

When the stored type differs from filter semantics (e.g. nullable datetime → yes/no).

***

### indexed?

> `optional` **indexed?**: `boolean`

Defined in: [src/lib/data-table-db-schema.ts:49](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-schema.ts#L49)

***

### model

> **model**: [`DbModelName`](DbModelName.md)

Defined in: [src/lib/data-table-db-schema.ts:43](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-schema.ts#L43)

***

### nullable?

> `optional` **nullable?**: `boolean`

Defined in: [src/lib/data-table-db-schema.ts:47](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-schema.ts#L47)

***

### prismaEnum?

> `optional` **prismaEnum?**: `string`

Defined in: [src/lib/data-table-db-schema.ts:46](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-schema.ts#L46)

***

### scalar

> **scalar**: [`DbScalarKind`](DbScalarKind.md)

Defined in: [src/lib/data-table-db-schema.ts:45](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-schema.ts#L45)

***

### unique?

> `optional` **unique?**: `boolean`

Defined in: [src/lib/data-table-db-schema.ts:48](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-schema.ts#L48)
