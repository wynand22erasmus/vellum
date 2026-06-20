# Function: signWebhookPayload()

> **signWebhookPayload**(`rawBody`, `secret`): `string`

Defined in: src/lib/webhooks/sign-payload.ts:17

Computes the `X-Vellum-Signature` header value for a raw JSON body.

## Parameters

### rawBody

`string`

Exact bytes sent in the POST body

### secret

`string`

`WEBHOOK_SECRET` value

## Returns

`string`
