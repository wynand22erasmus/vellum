# Interface: EmailPayload

Defined in: [src/lib/email/IEmailProvider.ts:8](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/email/IEmailProvider.ts#L8)

Plain-text and HTML email content passed to a provider implementation.

## Properties

### body

> **body**: `string`

Defined in: [src/lib/email/IEmailProvider.ts:14](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/email/IEmailProvider.ts#L14)

Plain-text body (always sent)

***

### from?

> `optional` **from?**: `string`

Defined in: [src/lib/email/IEmailProvider.ts:18](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/email/IEmailProvider.ts#L18)

Optional RFC5322 From header (defaults to provider preset).

***

### html?

> `optional` **html?**: `string`

Defined in: [src/lib/email/IEmailProvider.ts:16](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/email/IEmailProvider.ts#L16)

Branded HTML body (multipart/alternative when present)

***

### subject

> **subject**: `string`

Defined in: [src/lib/email/IEmailProvider.ts:12](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/email/IEmailProvider.ts#L12)

Message subject line

***

### to

> **to**: `string`

Defined in: [src/lib/email/IEmailProvider.ts:10](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/email/IEmailProvider.ts#L10)

Recipient address
