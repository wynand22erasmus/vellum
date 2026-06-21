# Class: SesEmailProvider

Defined in: [src/lib/email/providers/SesEmailProvider.ts:14](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/email/providers/SesEmailProvider.ts#L14)

Sends mail via AWS SES (`AWS_SES_REGION`, default `us-east-1`).

## Implements

- [`IEmailProvider`](../../../IEmailProvider/interfaces/IEmailProvider.md)

## Constructors

### Constructor

> **new SesEmailProvider**(): `SesEmailProvider`

#### Returns

`SesEmailProvider`

## Methods

### send()

> **send**(`payload`): `Promise`\<`void`\>

Defined in: [src/lib/email/providers/SesEmailProvider.ts:20](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/email/providers/SesEmailProvider.ts#L20)

Delivers one message.

#### Parameters

##### payload

[`EmailPayload`](../../../IEmailProvider/interfaces/EmailPayload.md)

Recipient, subject, and body

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEmailProvider`](../../../IEmailProvider/interfaces/IEmailProvider.md).[`send`](../../../IEmailProvider/interfaces/IEmailProvider.md#send)
