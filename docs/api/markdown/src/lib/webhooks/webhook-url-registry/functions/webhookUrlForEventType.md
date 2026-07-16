# Function: webhookUrlForEventType()

> **webhookUrlForEventType**(`eventType`): `string` \| `undefined`

Defined in: [src/lib/webhooks/webhook-url-registry.ts:39](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/webhooks/webhook-url-registry.ts#L39)

Returns the configured webhook target URL for an event type, if delivery is enabled.

## Parameters

### eventType

`AuditEventType`

Audit event that was persisted

## Returns

`string` \| `undefined`
