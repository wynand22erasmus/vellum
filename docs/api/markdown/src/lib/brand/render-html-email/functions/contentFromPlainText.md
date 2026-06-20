# Function: contentFromPlainText()

> **contentFromPlainText**(`plainBody`, `options?`): [`BrandedEmailContent`](../type-aliases/BrandedEmailContent.md)

Defined in: src/lib/brand/render-html-email.ts:40

Derive structured HTML content from a plain-text template body.
The first non-empty line becomes the headline; http(s) lines become the CTA URL.

## Parameters

### plainBody

`string`

### options?

#### codeBlock?

`string`

#### ctaLabel?

`string`

#### ctaUrl?

`string`

#### headline?

`string`

#### preheader?

`string`

## Returns

[`BrandedEmailContent`](../type-aliases/BrandedEmailContent.md)
