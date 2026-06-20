# Function: startRecipientOtp()

> **startRecipientOtp**(`input`): `Promise`\<\{ `channel`: `RecipientOtpChannel`; `expiresInSeconds`: `number`; \}\>

Defined in: src/lib/recipient-otp/recipientOtpService.ts:33

Creates OTP session and dispatches code for email/SMS/WhatsApp channels.

## Parameters

### input

#### doc

[`DocumentContext`](../../../documents/types/type-aliases/DocumentContext.md)

#### sessionId

`string`

## Returns

`Promise`\<\{ `channel`: `RecipientOtpChannel`; `expiresInSeconds`: `number`; \}\>
