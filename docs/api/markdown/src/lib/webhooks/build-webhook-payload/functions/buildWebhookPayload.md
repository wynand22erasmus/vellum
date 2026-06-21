# Function: buildWebhookPayload()

> **buildWebhookPayload**(`auditLog`, `deliveryId`): [`WebhookPayload`](../type-aliases/WebhookPayload.md)

Defined in: [src/lib/webhooks/build-webhook-payload.ts:29](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/webhooks/build-webhook-payload.ts#L29)

Builds the webhook JSON body from a persisted audit log row.

## Parameters

### auditLog

`Pick`\<`AuditLog`, `"auditLogId"` \| `"eventType"` \| `"createdAt"` \| `"documentId"` \| `"communicationId"` \| `"userId"` \| `"ipAddress"` \| `"userAgent"` \| `"metadata"`\>

Source audit row

### deliveryId

`string`

Unique id for this delivery attempt

## Returns

[`WebhookPayload`](../type-aliases/WebhookPayload.md)
