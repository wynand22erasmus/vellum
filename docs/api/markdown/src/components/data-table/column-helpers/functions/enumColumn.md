# Function: enumColumn()

> **enumColumn**\<`TData`\>(`config`): `ColumnDef`\<`TData`, `unknown`\>

Defined in: [src/components/data-table/column-helpers.ts:147](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/components/data-table/column-helpers.ts#L147)

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
