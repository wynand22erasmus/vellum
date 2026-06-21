# Function: verifyRecipientOtp()

> **verifyRecipientOtp**(`input`): `Promise`\<\{ `ok`: `boolean`; `reason?`: `"expired"` \| `"max_attempts"` \| `"invalid"` \| `"missing_secret"`; \}\>

Defined in: [src/lib/recipient-otp/recipientOtpService.ts:109](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/recipient-otp/recipientOtpService.ts#L109)

Verifies submitted OTP (Redis code or TOTP) for a session tied to a document link.

## Parameters

### input

#### code

`string`

#### doc

[`CommunicationContext`](../../../documents/types/type-aliases/CommunicationContext.md)

#### sessionId

`string`

## Returns

`Promise`\<\{ `ok`: `boolean`; `reason?`: `"expired"` \| `"max_attempts"` \| `"invalid"` \| `"missing_secret"`; \}\>
