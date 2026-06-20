# Function: createOtpSession()

> **createOtpSession**(`input`): `Promise`\<\{ `code`: `string` \| `null`; \}\>

Defined in: src/lib/recipient-otp/recipientOtpStore.ts:42

Creates a new OTP session after successful password verification.

## Parameters

### input

#### channel

`RecipientOtpChannel`

#### code?

`string`

#### documentId

`string`

#### sessionId

`string`

## Returns

`Promise`\<\{ `code`: `string` \| `null`; \}\>
