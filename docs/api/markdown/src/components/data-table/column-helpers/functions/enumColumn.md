# Function: enumColumn()

> **enumColumn**\<`TData`\>(`config`): `ColumnDef`\<`TData`, `unknown`\>

Defined in: [src/components/data-table/column-helpers.ts:147](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-helpers.ts#L147)

Enum column with searchable multiselect filter.

## Type Parameters

### TData

`TData`

## Parameters

### config

#### accessorFn?

(`row`) => `unknown`

#### accessorKey?

keyof `TData` & `string`

#### cell?

`ColumnDefTemplate`\<`CellContext`\<`TData`, `unknown`\>\>

#### header

`string`

#### id?

`string`

#### options

readonly [`DataTableFilterOption`](../../../../lib/data-table-types/type-aliases/DataTableFilterOption.md)[]

## Returns

`ColumnDef`\<`TData`, `unknown`\>
