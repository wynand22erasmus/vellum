# Function: mergeColumnMetaWithDb()

> **mergeColumnMetaWithDb**(`field`, `meta`, `rowKind?`): [`DataTableColumnMeta`](../../../components/data-table/column-meta/type-aliases/DataTableColumnMeta.md)

Defined in: [src/lib/data-table-db-column-registry.ts:109](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/data-table-db-column-registry.ts#L109)

Merges explicit column meta with DB registry lookup (explicit wins).

## Parameters

### field

`string`

### meta

[`DataTableColumnMeta`](../../../components/data-table/column-meta/type-aliases/DataTableColumnMeta.md) \| `undefined`

### rowKind?

`"AdminUserRow"` \| `"AdminDocumentRow"` \| `"AdminDocumentFileRow"` \| `"DocumentRow"` \| `"AuditLogRow"` \| `"AuditRow"` \| `"FailedAuditLogRow"` \| `"ProcessErrorRow"` \| `"FailedProcessErrorRow"` \| `"WebhookDeliveryRow"` \| `"FailedWebhookDeliveryRow"`

## Returns

[`DataTableColumnMeta`](../../../components/data-table/column-meta/type-aliases/DataTableColumnMeta.md)
