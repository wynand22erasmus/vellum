# Function: dbColumn()

> **dbColumn**\<`TData`\>(`model`, `field`, `header`, `extra?`): `ColumnDef`\<`TData`, `unknown`\>

Defined in: [src/components/data-table/column-helpers.ts:38](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/column-helpers.ts#L38)

Builds a column using Prisma schema metadata for filter type inference.
Falls back to text when the field is not in the registry.

## Type Parameters

### TData

`TData`

## Parameters

### model

`"DeadLetter"` \| `"User"` \| `"Document"` \| `"File"` \| `"Communication"` \| `"AuditLog"` \| `"Recipient"` \| `"ProcessError"` \| `"WebhookDelivery"`

### field

`string`

### header

`string`

### extra?

`Partial`\<`ColumnDef`\<`TData`, `unknown`\>\>

## Returns

`ColumnDef`\<`TData`, `unknown`\>
