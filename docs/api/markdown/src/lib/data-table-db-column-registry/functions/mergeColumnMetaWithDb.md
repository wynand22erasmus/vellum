# Function: mergeColumnMetaWithDb()

> **mergeColumnMetaWithDb**(`field`, `meta`, `rowKind?`): [`DataTableColumnMeta`](../../../components/data-table/column-meta/type-aliases/DataTableColumnMeta.md)

Defined in: [src/lib/data-table-db-column-registry.ts:108](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-column-registry.ts#L108)

Merges explicit column meta with DB registry lookup (explicit wins).

## Parameters

### field

`string`

### meta

[`DataTableColumnMeta`](../../../components/data-table/column-meta/type-aliases/DataTableColumnMeta.md) \| `undefined`

### rowKind?

`"DeadLetter"` \| `"User"` \| `"Document"` \| `"File"` \| `"Communication"` \| `"AuditLog"` \| `"Recipient"` \| `"ProcessError"` \| `"WebhookDelivery"`

## Returns

[`DataTableColumnMeta`](../../../components/data-table/column-meta/type-aliases/DataTableColumnMeta.md)
