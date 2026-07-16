# Function: sendSmsOtp()

> **sendSmsOtp**(`to`, `code`, `fileName`, `expiresInSeconds`): `Promise`\<[`SmsSendResult`](../type-aliases/SmsSendResult.md)\>

Defined in: [src/lib/sms/twilioClient.ts:60](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/sms/twilioClient.ts#L60)

Sends an OTP via SMS. Logs to console when Twilio is not configured (dev fallback).

## Parameters

### to

`string`

### code

`string`

### fileName

`string`

### expiresInSeconds

`number`

## Returns

`Promise`\<[`SmsSendResult`](../type-aliases/SmsSendResult.md)\>
