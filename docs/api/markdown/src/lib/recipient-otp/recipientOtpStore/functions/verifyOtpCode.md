# Function: verifyOtpCode()

> **verifyOtpCode**(`sessionId`, `code`): `Promise`\<\{ `ok`: `boolean`; `reason?`: `"expired"` \| `"max_attempts"` \| `"invalid"`; `record`: [`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`; \}\>

Defined in: src/lib/recipient-otp/recipientOtpStore.ts:84

Verifies a submitted code against the session hash. Returns updated attempts.

## Parameters

### sessionId

`string`

### code

`string`

## Returns

`Promise`\<\{ `ok`: `boolean`; `reason?`: `"expired"` \| `"max_attempts"` \| `"invalid"`; `record`: [`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`; \}\>
