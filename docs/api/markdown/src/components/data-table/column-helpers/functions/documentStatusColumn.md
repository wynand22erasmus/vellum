# Function: documentStatusColumn()

> **documentStatusColumn**\<`TData`\>(`config`): `ColumnDef`\<`TData`, `unknown`\>

Defined in: [src/components/data-table/column-helpers.ts:172](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-helpers.ts#L172)

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
