# Interface: IEmailProvider

Defined in: [src/lib/email/IEmailProvider.ts:24](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/email/IEmailProvider.ts#L24)

Sends transactional email (implemented by Mailpit SMTP or AWS SES).

## Methods

### send()

> **send**(`payload`): `Promise`\<`void`\>

Defined in: [src/lib/email/IEmailProvider.ts:30](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/email/IEmailProvider.ts#L30)

Delivers one message.

#### Parameters

##### payload

[`EmailPayload`](EmailPayload.md)

Recipient, subject, and body

#### Returns

`Promise`\<`void`\>
