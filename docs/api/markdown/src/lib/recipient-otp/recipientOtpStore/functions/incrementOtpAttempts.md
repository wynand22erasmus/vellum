# Function: incrementOtpAttempts()

> **incrementOtpAttempts**(`sessionId`): `Promise`\<\{ `maxAttemptsReached`: `boolean`; `record`: [`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`; \}\>

Defined in: [src/lib/recipient-otp/recipientOtpStore.ts:137](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/recipient-otp/recipientOtpStore.ts#L137)

Increments failed attempt counter for a session (e.g. TOTP mismatch).

## Parameters

### sessionId

`string`

## Returns

`Promise`\<\{ `maxAttemptsReached`: `boolean`; `record`: [`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`; \}\>
