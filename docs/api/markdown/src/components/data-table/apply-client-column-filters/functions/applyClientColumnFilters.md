# Function: applyClientColumnFilters()

> **applyClientColumnFilters**\<`TData`\>(`rows`, `columns`, `filters`): `TData`[]

Defined in: [src/components/data-table/apply-client-column-filters.ts:68](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/apply-client-column-filters.ts#L68)

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
