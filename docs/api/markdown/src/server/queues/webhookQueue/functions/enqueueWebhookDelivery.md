# Function: enqueueWebhookDelivery()

> **enqueueWebhookDelivery**(`auditLogId`, `eventType`): `void`

Defined in: src/server/queues/webhookQueue.ts:36

Enqueues webhook delivery when webhooks are enabled and a target URL is configured.

## Parameters

### auditLogId

`string`

Persisted audit row id

### eventType

`AuditEventType`

Event type that was logged

## Returns

`void`
