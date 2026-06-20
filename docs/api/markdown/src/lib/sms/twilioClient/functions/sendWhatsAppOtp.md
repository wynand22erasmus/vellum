# Function: sendWhatsAppOtp()

> **sendWhatsAppOtp**(`to`, `code`, `fileName`, `expiresInSeconds`): `Promise`\<[`SmsSendResult`](../type-aliases/SmsSendResult.md)\>

Defined in: src/lib/sms/twilioClient.ts:89

Sends an OTP via WhatsApp. Uses Twilio WhatsApp sandbox/from prefix when configured.

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
