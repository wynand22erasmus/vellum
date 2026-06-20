# Function: dateColumn()

> **dateColumn**\<`TData`\>(`accessorKey`, `header`, `extra?`): `ColumnDef`\<`TData`, `unknown`\>

Defined in: [src/components/data-table/column-helpers.ts:95](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/components/data-table/column-helpers.ts#L95)

ISO datetime column with prefix date filter.

## Type Parameters

### TData

`TData`

## Parameters

### accessorKey

keyof `TData` & `string`

### header

`string`

### extra?

`Partial`\<`ColumnDef`\<`TData`, `unknown`\>\>

## Returns

`ColumnDef`\<`TData`, `unknown`\>
