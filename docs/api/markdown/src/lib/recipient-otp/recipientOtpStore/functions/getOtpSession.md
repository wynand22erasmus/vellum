# Function: getOtpSession()

> **getOtpSession**(`sessionId`): `Promise`\<[`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`\>

Defined in: src/lib/recipient-otp/recipientOtpStore.ts:70

Loads an OTP session or null when missing/expired.

## Parameters

### sessionId

`string`

## Returns

`Promise`\<[`OtpSessionRecord`](../type-aliases/OtpSessionRecord.md) \| `null`\>
