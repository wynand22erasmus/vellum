# Type Alias: DataTableProps\<T\>

> **DataTableProps**\<`T`\> = `object`

Defined in: [src/lib/data-table-types.ts:55](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L55)

Props for `DataTable`.

## Type Parameters

### T

`T`

## Properties

### className?

> `optional` **className?**: `string`

Defined in: [src/lib/data-table-types.ts:70](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L70)

***

### clientFilterColumnIds?

> `optional` **clientFilterColumnIds?**: readonly `string`[]

Defined in: [src/lib/data-table-types.ts:66](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L66)

Apply these filters locally even when `manualFiltering` is true (e.g. current page facets).

***

### clientSortColumnIds?

> `optional` **clientSortColumnIds?**: readonly `string`[]

Defined in: [src/lib/data-table-types.ts:68](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L68)

Apply sort locally for these columns when `manualSorting` is true.

***

### columnFilters?

> `optional` **columnFilters?**: `Record`\<`string`, `string`\>

Defined in: [src/lib/data-table-types.ts:61](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L61)

***

### columns

> **columns**: readonly [`DataTableColumn`](DataTableColumn.md)\<`T`\>[]

Defined in: [src/lib/data-table-types.ts:57](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L57)

***

### data

> **data**: readonly `T`[]

Defined in: [src/lib/data-table-types.ts:56](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L56)

***

### emptyMessage?

> `optional` **emptyMessage?**: `React.ReactNode`

Defined in: [src/lib/data-table-types.ts:69](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L69)

***

### getRowKey

> **getRowKey**: (`row`) => `string`

Defined in: [src/lib/data-table-types.ts:58](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L58)

#### Parameters

##### row

`T`

#### Returns

`string`

***

### manualFiltering?

> `optional` **manualFiltering?**: `boolean`

Defined in: [src/lib/data-table-types.ts:64](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L64)

***

### manualSorting?

> `optional` **manualSorting?**: `boolean`

Defined in: [src/lib/data-table-types.ts:63](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L63)

***

### onColumnFiltersChange?

> `optional` **onColumnFiltersChange?**: (`filters`) => `void`

Defined in: [src/lib/data-table-types.ts:62](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L62)

#### Parameters

##### filters

`Record`\<`string`, `string`\>

#### Returns

`void`

***

### onSortChange?

> `optional` **onSortChange?**: (`sort`) => `void`

Defined in: [src/lib/data-table-types.ts:60](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L60)

#### Parameters

##### sort

[`DataTableSort`](../../data-table-utils/type-aliases/DataTableSort.md) \| `null`

#### Returns

`void`

***

### sort?

> `optional` **sort?**: [`DataTableSort`](../../data-table-utils/type-aliases/DataTableSort.md) \| `null`

Defined in: [src/lib/data-table-types.ts:59](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L59)

***

### tableClassName?

> `optional` **tableClassName?**: `string`

Defined in: [src/lib/data-table-types.ts:71](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L71)
