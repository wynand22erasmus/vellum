# Class: EmailService

Defined in: [src/lib/email/EmailService.ts:22](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/email/EmailService.ts#L22)

Sends recipient emails using the configured provider (`local` or `ses`).

## Constructors

### Constructor

> **new EmailService**(): `EmailService`

Defined in: [src/lib/email/EmailService.ts:26](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/email/EmailService.ts#L26)

Selects [LocalEmailProvider](../../providers/LocalEmailProvider/classes/LocalEmailProvider.md) or [SesEmailProvider](../../providers/SesEmailProvider/classes/SesEmailProvider.md) from `EMAIL_PROVIDER`.

#### Returns

`EmailService`

## Methods

### sendAccountEmailVerification()

> **sendAccountEmailVerification**(`to`, `verificationUrl`): `Promise`\<`void`\>

Defined in: [src/lib/email/EmailService.ts:37](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/email/EmailService.ts#L37)

Sends a dashboard account email verification link (development / Mailpit).

#### Parameters

##### to

`string`

Recipient email

##### verificationUrl

`string`

Full URL to `GET /api/auth/verify-email`

#### Returns

`Promise`\<`void`\>

***

### sendDownloadLink()

> **sendDownloadLink**(`to`, `token`, `fileName`): `Promise`\<`void`\>

Defined in: [src/lib/email/EmailService.ts:64](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/email/EmailService.ts#L64)

#### Parameters

##### to

`string`

##### token

`string`

##### fileName

`string`

#### Returns

`Promise`\<`void`\>

***

### sendRecipientOtp()

> **sendRecipientOtp**(`to`, `code`, `fileName`, `expiresInSeconds`): `Promise`\<`void`\>

Defined in: [src/lib/email/EmailService.ts:98](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/email/EmailService.ts#L98)

Sends a one-time download verification code to the recipient (second factor).

#### Parameters

##### to

`string`

##### code

`string`

##### fileName

`string`

##### expiresInSeconds

`number`

#### Returns

`Promise`\<`void`\>
