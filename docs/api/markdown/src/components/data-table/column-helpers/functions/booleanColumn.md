# Function: booleanColumn()

> **booleanColumn**\<`TData`\>(`config`): `ColumnDef`\<`TData`, `unknown`\>

Defined in: [src/components/data-table/column-helpers.ts:119](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/components/data-table/column-helpers.ts#L119)

Boolean column with yes/no multiselect filter.

## Type Parameters

### TData

`TData`

## Parameters

### config

#### accessorFn?

(`row`) => `boolean`

#### accessorKey?

keyof `TData` & `string`

#### cell?

`ColumnDefTemplate`\<`CellContext`\<`TData`, `unknown`\>\>

#### header

`string`

#### id?

`string`

## Returns

`ColumnDef`\<`TData`, `unknown`\>
