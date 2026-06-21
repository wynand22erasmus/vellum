# Function: createOtpSession()

> **createOtpSession**(`input`): `Promise`\<\{ `code`: `string` \| `null`; \}\>

Defined in: [src/lib/recipient-otp/recipientOtpStore.ts:43](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/recipient-otp/recipientOtpStore.ts#L43)

Creates a new OTP session after successful password verification.

## Parameters

### input

#### channel

`RecipientOtpChannel`

#### code?

`string`

#### communicationId

`string`

#### documentId

`string`

#### sessionId

`string`

## Returns

`Promise`\<\{ `code`: `string` \| `null`; \}\>
