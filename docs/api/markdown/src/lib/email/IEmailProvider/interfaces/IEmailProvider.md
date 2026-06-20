# Interface: IEmailProvider

Defined in: [src/lib/email/IEmailProvider.ts:24](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/email/IEmailProvider.ts#L24)

Sends transactional email (implemented by Mailpit SMTP or AWS SES).

## Methods

### send()

> **send**(`payload`): `Promise`\<`void`\>

Defined in: [src/lib/email/IEmailProvider.ts:30](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/email/IEmailProvider.ts#L30)

Delivers one message.

#### Parameters

##### payload

[`EmailPayload`](EmailPayload.md)

Recipient, subject, and body

#### Returns

`Promise`\<`void`\>
