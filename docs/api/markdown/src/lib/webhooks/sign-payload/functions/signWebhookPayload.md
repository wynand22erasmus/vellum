# Function: signWebhookPayload()

> **signWebhookPayload**(`rawBody`, `secret`): `string`

Defined in: [src/lib/webhooks/sign-payload.ts:17](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/webhooks/sign-payload.ts#L17)

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
