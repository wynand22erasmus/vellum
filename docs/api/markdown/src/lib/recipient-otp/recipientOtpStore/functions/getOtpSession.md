# Function: getOtpSession()

> **getOtpSession**(`sessionId`): `Promise`\<[`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`\>

Defined in: [src/lib/recipient-otp/recipientOtpStore.ts:73](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/recipient-otp/recipientOtpStore.ts#L73)

Loads an OTP session or null when missing/expired.

## Parameters

### sessionId

`string`

## Returns

`Promise`\<[`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`\>
