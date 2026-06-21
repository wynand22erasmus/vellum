# Function: getDbColumnDescriptor()

> **getDbColumnDescriptor**(`model`, `field`): [`DbColumnDescriptor`](../../data-table-db-schema/type-aliases/DbColumnDescriptor.md) \| `undefined`

Defined in: [src/lib/data-table-db-column-registry.ts:19](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-column-registry.ts#L19)

Raw descriptor for a Prisma model field, if registered.

## Parameters

### model

`"DeadLetter"` \| `"User"` \| `"Document"` \| `"File"` \| `"Communication"` \| `"AuditLog"` \| `"Recipient"` \| `"ProcessError"` \| `"WebhookDelivery"`

### field

`string`

## Returns

[`DbColumnDescriptor`](../../data-table-db-schema/type-aliases/DbColumnDescriptor.md) \| `undefined`
