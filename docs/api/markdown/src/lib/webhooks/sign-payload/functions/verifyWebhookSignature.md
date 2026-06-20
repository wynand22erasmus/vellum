# Function: verifyWebhookSignature()

> **verifyWebhookSignature**(`rawBody`, `signatureHeader`, `secret`): `boolean`

Defined in: src/lib/webhooks/sign-payload.ts:29

Verifies an incoming webhook signature over the raw request body.

## Parameters

### rawBody

`string`

Exact bytes received in the POST body

### signatureHeader

`string`

Value of `X-Vellum-Signature`

### secret

`string`

Shared HMAC secret

## Returns

`boolean`
