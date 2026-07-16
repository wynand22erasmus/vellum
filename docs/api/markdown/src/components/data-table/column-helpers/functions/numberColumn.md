# Function: numberColumn()

> **numberColumn**\<`TData`\>(`accessorKey`, `header`, `extra?`): `ColumnDef`\<`TData`, `unknown`\>

Defined in: [src/components/data-table/column-helpers.ts:107](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-helpers.ts#L107)

Numeric column with equality or substring filter.

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
