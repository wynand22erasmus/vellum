# Function: listDbColumnsForModel()

> **listDbColumnsForModel**(`model`): readonly [`DbColumnDescriptor`](../../data-table-db-schema/type-aliases/DbColumnDescriptor.md)[]

Defined in: [src/lib/data-table-db-column-registry.ts:32](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-column-registry.ts#L32)

All field descriptors for a model.

## Parameters

### model

`"DeadLetter"` \| `"User"` \| `"Document"` \| `"File"` \| `"Communication"` \| `"AuditLog"` \| `"Recipient"` \| `"ProcessError"` \| `"WebhookDelivery"`

## Returns

readonly [`DbColumnDescriptor`](../../data-table-db-schema/type-aliases/DbColumnDescriptor.md)[]
