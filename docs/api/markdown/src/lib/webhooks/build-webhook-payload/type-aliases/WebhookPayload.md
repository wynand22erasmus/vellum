# Type Alias: WebhookPayload

> **WebhookPayload** = `object`

Defined in: src/lib/webhooks/build-webhook-payload.ts:10

Outbound webhook POST body (mirrors audit log fields).

## Properties

### auditLogId

> **auditLogId**: `string`

Defined in: src/lib/webhooks/build-webhook-payload.ts:14

***

### deliveryId

> **deliveryId**: `string`

Defined in: src/lib/webhooks/build-webhook-payload.ts:11

***

### documentId

> **documentId**: `string` \| `null`

Defined in: src/lib/webhooks/build-webhook-payload.ts:15

***

### eventType

> **eventType**: `AuditEventType`

Defined in: src/lib/webhooks/build-webhook-payload.ts:12

***

### ipAddress

> **ipAddress**: `string` \| `null`

Defined in: src/lib/webhooks/build-webhook-payload.ts:17

***

### metadata

> **metadata**: `Record`\<`string`, `unknown`\> \| `null`

Defined in: src/lib/webhooks/build-webhook-payload.ts:19

***

### timestamp

> **timestamp**: `string`

Defined in: src/lib/webhooks/build-webhook-payload.ts:13

***

### userAgent

> **userAgent**: `string` \| `null`

Defined in: src/lib/webhooks/build-webhook-payload.ts:18

***

### userId

> **userId**: `string` \| `null`

Defined in: src/lib/webhooks/build-webhook-payload.ts:16
