# Function: documentStatusColumn()

> **documentStatusColumn**\<`TData`\>(`config`): `ColumnDef`\<`TData`, `unknown`\>

Defined in: [src/components/data-table/column-helpers.ts:172](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/components/data-table/column-helpers.ts#L172)

Document status facet column (link/file/downloaded/deleted tags).

## Type Parameters

### TData

`TData` *extends* [`DocumentStatusSource`](../../../../lib/document-status-filter-options/type-aliases/DocumentStatusSource.md)

## Parameters

### config

#### cell

`ColumnDefTemplate`\<`CellContext`\<`TData`, `unknown`\>\> \| `undefined`

#### header

`string`

#### id?

`string`

## Returns

`ColumnDef`\<`TData`, `unknown`\>
