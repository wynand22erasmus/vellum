# Function: verifyWebhookSignature()

> **verifyWebhookSignature**(`rawBody`, `signatureHeader`, `secret`): `boolean`

Defined in: [src/lib/webhooks/sign-payload.ts:29](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/webhooks/sign-payload.ts#L29)

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
