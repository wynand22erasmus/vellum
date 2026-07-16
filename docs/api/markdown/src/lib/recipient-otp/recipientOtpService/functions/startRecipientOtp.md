# Function: startRecipientOtp()

> **startRecipientOtp**(`input`): `Promise`\<\{ `channel`: `RecipientOtpChannel`; `expiresInSeconds`: `number`; \}\>

Defined in: [src/lib/recipient-otp/recipientOtpService.ts:33](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/recipient-otp/recipientOtpService.ts#L33)

Creates OTP session and dispatches code for email/SMS/WhatsApp channels.

## Parameters

### input

#### doc

[`CommunicationContext`](../../../documents/types/type-aliases/CommunicationContext.md)

#### sessionId

`string`

## Returns

`Promise`\<\{ `channel`: `RecipientOtpChannel`; `expiresInSeconds`: `number`; \}\>
