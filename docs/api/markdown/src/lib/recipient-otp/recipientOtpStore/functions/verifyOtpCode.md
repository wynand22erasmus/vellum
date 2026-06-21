# Function: verifyOtpCode()

> **verifyOtpCode**(`sessionId`, `code`): `Promise`\<\{ `ok`: `boolean`; `reason?`: `"expired"` \| `"max_attempts"` \| `"invalid"`; `record`: [`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`; \}\>

Defined in: [src/lib/recipient-otp/recipientOtpStore.ts:87](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/recipient-otp/recipientOtpStore.ts#L87)

Verifies a submitted code against the session hash. Returns updated attempts.

## Parameters

### sessionId

`string`

### code

`string`

## Returns

`Promise`\<\{ `ok`: `boolean`; `reason?`: `"expired"` \| `"max_attempts"` \| `"invalid"`; `record`: [`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`; \}\>
