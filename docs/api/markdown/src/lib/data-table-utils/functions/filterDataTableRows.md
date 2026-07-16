# Function: filterDataTableRows()

> **filterDataTableRows**\<`T`\>(`rows`, `columns`, `columnFilters`): `T`[]

Defined in: [src/lib/data-table-utils.ts:216](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-utils.ts#L216)

Filters rows using per-column filter functions and current filter values.

## Type Parameters

### T

`T`

## Parameters

### rows

readonly `T`[]

### columns

readonly [`DataTableColumnFilterConfig`](../type-aliases/DataTableColumnFilterConfig.md)\<`T`\>[]

### columnFilters

`Record`\<`string`, `string`\>

## Returns

`T`[]
