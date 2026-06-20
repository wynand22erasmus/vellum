# Function: incrementOtpAttempts()

> **incrementOtpAttempts**(`sessionId`): `Promise`\<\{ `maxAttemptsReached`: `boolean`; `record`: [`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`; \}\>

Defined in: src/lib/recipient-otp/recipientOtpStore.ts:134

Increments failed attempt counter for a session (e.g. TOTP mismatch).

## Parameters

### sessionId

`string`

## Returns

`Promise`\<\{ `maxAttemptsReached`: `boolean`; `record`: [`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`; \}\>
