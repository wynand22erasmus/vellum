# Function: resendOtpCode()

> **resendOtpCode**(`sessionId`): `Promise`\<\{ `code?`: `string`; `ok`: `boolean`; `reason?`: `"expired"` \| `"max_resends"` \| `"authenticator"`; \}\>

Defined in: [src/lib/recipient-otp/recipientOtpStore.ts:112](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/recipient-otp/recipientOtpStore.ts#L112)

Rotates OTP code for resend (email/SMS/WhatsApp only).

## Parameters

### sessionId

`string`

## Returns

`Promise`\<\{ `code?`: `string`; `ok`: `boolean`; `reason?`: `"expired"` \| `"max_resends"` \| `"authenticator"`; \}\>
