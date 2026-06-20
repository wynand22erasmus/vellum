# Function: webhookUrlForEventType()

> **webhookUrlForEventType**(`eventType`): `string` \| `undefined`

Defined in: src/lib/webhooks/webhook-url-registry.ts:39

Returns the configured webhook target URL for an event type, if delivery is enabled.

## Parameters

### eventType

`AuditEventType`

Audit event that was persisted

## Returns

`string` \| `undefined`
