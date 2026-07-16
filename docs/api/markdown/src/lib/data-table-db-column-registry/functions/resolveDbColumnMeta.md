# Function: resolveDbColumnMeta()

> **resolveDbColumnMeta**(`field`, `rowKind?`, `explicitModel?`): [`ResolvedDbColumnMeta`](../type-aliases/ResolvedDbColumnMeta.md) \| `undefined`

Defined in: [src/lib/data-table-db-column-registry.ts:66](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-db-column-registry.ts#L66)

Resolves filter metadata for a column accessor on a known row kind.
Checks derived fields first, then Prisma fields on the row's model.

## Parameters

### field

`string`

### rowKind?

`"DeadLetter"` \| `"User"` \| `"Document"` \| `"File"` \| `"Communication"` \| `"AuditLog"` \| `"Recipient"` \| `"ProcessError"` \| `"WebhookDelivery"`

### explicitModel?

`"DeadLetter"` \| `"User"` \| `"Document"` \| `"File"` \| `"Communication"` \| `"AuditLog"` \| `"Recipient"` \| `"ProcessError"` \| `"WebhookDelivery"`

## Returns

[`ResolvedDbColumnMeta`](../type-aliases/ResolvedDbColumnMeta.md) \| `undefined`
