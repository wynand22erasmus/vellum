# Function: buildRecipientOtpMessage()

> **buildRecipientOtpMessage**(`channel`, `code`, `fileName`, `expiresInSeconds`, `preset?`): `string`

Defined in: [src/lib/sms/twilioClient.ts:37](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/sms/twilioClient.ts#L37)

Build branded OTP body for SMS or WhatsApp from the active preset.

## Parameters

### channel

`"sms"` \| `"whatsapp"`

### code

`string`

### fileName

`string`

### expiresInSeconds

`number`

### preset?

[`BrandPreset`](../../../brand/presets/type-aliases/BrandPreset.md) = `...`

## Returns

`string`
