# Function: applyClientColumnFilters()

> **applyClientColumnFilters**\<`TData`\>(`rows`, `columns`, `filters`): `TData`[]

Defined in: [src/components/data-table/apply-client-column-filters.ts:68](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/components/data-table/apply-client-column-filters.ts#L68)

Filters rows using active client-only column filters and column filter fns.

## Type Parameters

### TData

`TData`

## Parameters

### rows

readonly `TData`[]

### columns

readonly `ColumnDef`\<`TData`, `unknown`\>[]

### filters

`ColumnFiltersState`

## Returns

`TData`[]
