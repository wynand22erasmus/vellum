# Function: verifyHcaptcha()

> **verifyHcaptcha**(`token`, `remoteIp?`): `Promise`\<[`HcaptchaVerifyResult`](../type-aliases/HcaptchaVerifyResult.md)\>

Defined in: src/lib/captcha/verifyHcaptcha.ts:20

Validates an hCaptcha response token with the provider siteverify endpoint.

## Parameters

### token

`string`

Client-side hCaptcha response token

### remoteIp?

`string`

Optional client IP forwarded to hCaptcha

## Returns

`Promise`\<[`HcaptchaVerifyResult`](../type-aliases/HcaptchaVerifyResult.md)\>
