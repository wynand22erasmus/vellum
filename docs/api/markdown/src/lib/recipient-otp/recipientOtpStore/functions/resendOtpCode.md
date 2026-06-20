# Function: resendOtpCode()

> **resendOtpCode**(`sessionId`): `Promise`\<\{ `code?`: `string`; `ok`: `boolean`; `reason?`: `"authenticator"` \| `"expired"` \| `"max_resends"`; \}\>

Defined in: src/lib/recipient-otp/recipientOtpStore.ts:109

Rotates OTP code for resend (email/SMS/WhatsApp only).

## Parameters

### sessionId

`string`

## Returns

`Promise`\<\{ `code?`: `string`; `ok`: `boolean`; `reason?`: `"authenticator"` \| `"expired"` \| `"max_resends"`; \}\>
