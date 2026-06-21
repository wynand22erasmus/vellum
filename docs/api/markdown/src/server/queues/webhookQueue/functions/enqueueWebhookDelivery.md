# Function: enqueueWebhookDelivery()

> **enqueueWebhookDelivery**(`auditLogId`, `eventType`): `void`

Defined in: [src/server/queues/webhookQueue.ts:36](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/webhookQueue.ts#L36)

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
