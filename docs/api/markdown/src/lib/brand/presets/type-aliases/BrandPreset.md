# Type Alias: BrandPreset

> **BrandPreset** = `object`

Defined in: [src/lib/brand/presets.ts:8](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L8)

White-label configuration consumed by the SPA and EmailService.

## Properties

### displayName

> **displayName**: `string`

Defined in: [src/lib/brand/presets.ts:10](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L10)

***

### documentTitle

> **documentTitle**: `string`

Defined in: [src/lib/brand/presets.ts:13](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L13)

***

### email

> **email**: `object`

Defined in: [src/lib/brand/presets.ts:21](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L21)

#### footerHtml?

> `optional` **footerHtml?**: `string`

HTML footer fragment (overridable via `BRAND_FOOTER_HTML`).

#### fromAddress

> **fromAddress**: `string`

#### fromName

> **fromName**: `string`

#### logoUrl?

> `optional` **logoUrl?**: `string`

Absolute logo URL for HTML emails (defaults to `{APP_URL}{logos.full}`).

#### primaryColor?

> `optional` **primaryColor?**: `string`

Hex color for CTA buttons and accent bar (overridable via `BRAND_PRIMARY_COLOR`).

#### subjects

> **subjects**: `object`

##### subjects.downloadLink

> **downloadLink**: `string`

##### subjects.emailVerification

> **emailVerification**: `string`

##### subjects.recipientOtp

> **recipientOtp**: `string`

#### supportEmail?

> `optional` **supportEmail?**: `string`

Support contact shown in the footer (overridable via `BRAND_SUPPORT_EMAIL`).

#### templates

> **templates**: `object`

##### templates.downloadLink

> **downloadLink**: `string`

##### templates.emailVerification

> **emailVerification**: `string`

##### templates.recipientOtp

> **recipientOtp**: `string`

***

### id

> **id**: `string`

Defined in: [src/lib/brand/presets.ts:9](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L9)

***

### legal?

> `optional` **legal?**: `object`

Defined in: [src/lib/brand/presets.ts:56](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L56)

Optional footer links on auth pages.

#### privacyUrl

> **privacyUrl**: `string`

#### termsUrl

> **termsUrl**: `string`

***

### logos

> **logos**: `object`

Defined in: [src/lib/brand/presets.ts:15](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L15)

#### appleTouchIcon?

> `optional` **appleTouchIcon?**: `string`

#### favicon

> **favicon**: `string`

#### full

> **full**: `string`

#### mark

> **mark**: `string`

***

### shortName

> **shortName**: `string`

Defined in: [src/lib/brand/presets.ts:11](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L11)

***

### sms

> **sms**: `object`

Defined in: [src/lib/brand/presets.ts:44](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L44)

Twilio SMS body templates (`{{displayName}}`, `{{code}}`, `{{fileName}}`, `{{expiresMinutes}}`).

#### templates

> **templates**: `object`

##### templates.recipientOtp

> **recipientOtp**: `string`

***

### tagline

> **tagline**: `string`

Defined in: [src/lib/brand/presets.ts:12](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L12)

***

### whatsapp

> **whatsapp**: `object`

Defined in: [src/lib/brand/presets.ts:50](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L50)

Twilio WhatsApp body templates (same placeholders as [BrandPreset.sms](#sms)).

#### templates

> **templates**: `object`

##### templates.recipientOtp

> **recipientOtp**: `string`

***

### wordmark?

> `optional` **wordmark?**: `string`

Defined in: [src/lib/brand/presets.ts:14](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/brand/presets.ts#L14)
