# Function: resolveDbColumnMeta()

> **resolveDbColumnMeta**(`field`, `rowKind?`, `explicitModel?`): [`ResolvedDbColumnMeta`](../type-aliases/ResolvedDbColumnMeta.md) \| `undefined`

Defined in: [src/lib/data-table-db-column-registry.ts:67](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/data-table-db-column-registry.ts#L67)

Resolves filter metadata for a column accessor on a known row kind.
Checks derived fields first, then Prisma fields on the row's model.

## Parameters

### field

`string`

### rowKind?

`"AdminUserRow"` \| `"AdminDocumentRow"` \| `"AdminDocumentFileRow"` \| `"DocumentRow"` \| `"AuditLogRow"` \| `"AuditRow"` \| `"FailedAuditLogRow"` \| `"ProcessErrorRow"` \| `"FailedProcessErrorRow"` \| `"WebhookDeliveryRow"` \| `"FailedWebhookDeliveryRow"`

### explicitModel?

`"FailedProcessError"` \| `"User"` \| `"DocumentUserLink"` \| `"DocumentFile"` \| `"FailedAuditLog"` \| `"AuditLog"` \| `"ProcessError"` \| `"WebhookDelivery"` \| `"FailedWebhookDelivery"`

## Returns

[`ResolvedDbColumnMeta`](../type-aliases/ResolvedDbColumnMeta.md) \| `undefined`
