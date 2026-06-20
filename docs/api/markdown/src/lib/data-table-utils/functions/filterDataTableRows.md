# Function: filterDataTableRows()

> **filterDataTableRows**\<`T`\>(`rows`, `columns`, `columnFilters`): `T`[]

Defined in: [src/lib/data-table-utils.ts:216](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/data-table-utils.ts#L216)

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
