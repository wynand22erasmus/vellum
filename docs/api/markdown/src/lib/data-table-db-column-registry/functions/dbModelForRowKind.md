# Function: dbModelForRowKind()

> **dbModelForRowKind**(`rowKind`): `"FailedProcessError"` \| `"User"` \| `"DocumentUserLink"` \| `"DocumentFile"` \| `"FailedAuditLog"` \| `"AuditLog"` \| `"ProcessError"` \| `"WebhookDelivery"` \| `"FailedWebhookDelivery"`

Defined in: [src/lib/data-table-db-column-registry.ts:38](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/data-table-db-column-registry.ts#L38)

Primary Prisma model for a known table row type name.

## Parameters

### rowKind

`"AdminUserRow"` \| `"AdminDocumentRow"` \| `"AdminDocumentFileRow"` \| `"DocumentRow"` \| `"AuditLogRow"` \| `"AuditRow"` \| `"FailedAuditLogRow"` \| `"ProcessErrorRow"` \| `"FailedProcessErrorRow"` \| `"WebhookDeliveryRow"` \| `"FailedWebhookDeliveryRow"`

## Returns

`"FailedProcessError"` \| `"User"` \| `"DocumentUserLink"` \| `"DocumentFile"` \| `"FailedAuditLog"` \| `"AuditLog"` \| `"ProcessError"` \| `"WebhookDelivery"` \| `"FailedWebhookDelivery"`
