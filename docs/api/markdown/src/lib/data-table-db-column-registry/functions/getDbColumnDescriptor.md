# Function: getDbColumnDescriptor()

> **getDbColumnDescriptor**(`model`, `field`): [`DbColumnDescriptor`](../../data-table-db-schema/type-aliases/DbColumnDescriptor.md) \| `undefined`

Defined in: [src/lib/data-table-db-column-registry.ts:20](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/data-table-db-column-registry.ts#L20)

Raw descriptor for a Prisma model field, if registered.

## Parameters

### model

`"FailedProcessError"` \| `"User"` \| `"DocumentUserLink"` \| `"DocumentFile"` \| `"FailedAuditLog"` \| `"AuditLog"` \| `"ProcessError"` \| `"WebhookDelivery"` \| `"FailedWebhookDelivery"`

### field

`string`

## Returns

[`DbColumnDescriptor`](../../data-table-db-schema/type-aliases/DbColumnDescriptor.md) \| `undefined`
