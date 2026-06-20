# Function: sendSmsOtp()

> **sendSmsOtp**(`to`, `code`, `fileName`, `expiresInSeconds`): `Promise`\<[`SmsSendResult`](../type-aliases/SmsSendResult.md)\>

Defined in: src/lib/sms/twilioClient.ts:60

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
