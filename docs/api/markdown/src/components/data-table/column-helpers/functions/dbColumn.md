# Function: dbColumn()

> **dbColumn**\<`TData`\>(`model`, `field`, `header`, `extra?`): `ColumnDef`\<`TData`, `unknown`\>

Defined in: [src/components/data-table/column-helpers.ts:38](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/components/data-table/column-helpers.ts#L38)

Builds a column using Prisma schema metadata for filter type inference.
Falls back to text when the field is not in the registry.

## Type Parameters

### TData

`TData`

## Parameters

### model

`"FailedProcessError"` \| `"User"` \| `"DocumentUserLink"` \| `"DocumentFile"` \| `"FailedAuditLog"` \| `"AuditLog"` \| `"ProcessError"` \| `"WebhookDelivery"` \| `"FailedWebhookDelivery"`

### field

`string`

### header

`string`

### extra?

`Partial`\<`ColumnDef`\<`TData`, `unknown`\>\>

## Returns

`ColumnDef`\<`TData`, `unknown`\>
