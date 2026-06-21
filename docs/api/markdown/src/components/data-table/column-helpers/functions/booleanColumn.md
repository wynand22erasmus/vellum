# Function: booleanColumn()

> **booleanColumn**\<`TData`\>(`config`): `ColumnDef`\<`TData`, `unknown`\>

Defined in: [src/components/data-table/column-helpers.ts:119](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-helpers.ts#L119)

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
