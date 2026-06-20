# Function: verifyRecipientOtp()

> **verifyRecipientOtp**(`input`): `Promise`\<\{ `ok`: `boolean`; `reason?`: `"expired"` \| `"max_attempts"` \| `"invalid"` \| `"missing_secret"`; \}\>

Defined in: src/lib/recipient-otp/recipientOtpService.ts:108

Verifies submitted OTP (Redis code or TOTP) for a session tied to a document.

## Parameters

### input

#### code

`string`

#### doc

[`DocumentContext`](../../../documents/types/type-aliases/DocumentContext.md)

#### sessionId

`string`

## Returns

`Promise`\<\{ `ok`: `boolean`; `reason?`: `"expired"` \| `"max_attempts"` \| `"invalid"` \| `"missing_secret"`; \}\>
