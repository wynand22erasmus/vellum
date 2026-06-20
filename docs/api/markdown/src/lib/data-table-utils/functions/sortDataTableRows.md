# Function: sortDataTableRows()

> **sortDataTableRows**\<`T`\>(`rows`, `sort`, `getValue`, `compare?`): `T`[]

Defined in: [src/lib/data-table-utils.ts:242](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/data-table-utils.ts#L242)

Sorts rows by the active column using the provided accessor and optional custom comparator.

## Type Parameters

### T

`T`

## Parameters

### rows

readonly `T`[]

### sort

[`DataTableSort`](../type-aliases/DataTableSort.md) \| `null`

### getValue

(`row`, `columnId`) => `unknown`

### compare?

(`a`, `b`, `sort`) => `number`

## Returns

`T`[]
