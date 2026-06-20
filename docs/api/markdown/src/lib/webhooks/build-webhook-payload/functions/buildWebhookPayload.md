# Function: buildWebhookPayload()

> **buildWebhookPayload**(`auditLog`, `deliveryId`): [`WebhookPayload`](../type-aliases/WebhookPayload.md)

Defined in: src/lib/webhooks/build-webhook-payload.ts:28

Builds the webhook JSON body from a persisted audit log row.

## Parameters

### auditLog

`Pick`\<`AuditLog`, `"id"` \| `"eventType"` \| `"timestamp"` \| `"documentId"` \| `"userId"` \| `"ipAddress"` \| `"userAgent"` \| `"metadata"`\>

Source audit row

### deliveryId

`string`

Unique id for this delivery attempt

## Returns

[`WebhookPayload`](../type-aliases/WebhookPayload.md)
