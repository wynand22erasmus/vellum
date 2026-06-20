# Class: LocalEmailProvider

Defined in: [src/lib/email/providers/LocalEmailProvider.ts:14](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/email/providers/LocalEmailProvider.ts#L14)

Sends mail through Mailpit (`MAILPIT_HOST` / `MAILPIT_PORT`).

## Implements

- [`IEmailProvider`](../../../IEmailProvider/interfaces/IEmailProvider.md)

## Constructors

### Constructor

> **new LocalEmailProvider**(): `LocalEmailProvider`

#### Returns

`LocalEmailProvider`

## Methods

### send()

> **send**(`payload`): `Promise`\<`void`\>

Defined in: [src/lib/email/providers/LocalEmailProvider.ts:22](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/email/providers/LocalEmailProvider.ts#L22)

Delivers one message.

#### Parameters

##### payload

[`EmailPayload`](../../../IEmailProvider/interfaces/EmailPayload.md)

Recipient, subject, and body

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEmailProvider`](../../../IEmailProvider/interfaces/IEmailProvider.md).[`send`](../../../IEmailProvider/interfaces/IEmailProvider.md#send)
