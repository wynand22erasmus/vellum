# Interface: Request

Defined in: node\_modules/@types/express-serve-static-core/index.d.ts:10

## Properties

### errorCommunicationId?

> `optional` **errorCommunicationId?**: `string`

Defined in: [src/types/express.d.ts:17](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/types/express.d.ts#L17)

Document link context for process-error linking on public routes.

***

### errorCorrelationId?

> `optional` **errorCorrelationId?**: `string`

Defined in: [src/types/express.d.ts:15](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/types/express.d.ts#L15)

Shared incident UUID for audit + process-error linking (e.g. verify wrong password).

***

### file?

> `optional` **file?**: [`File`](../namespaces/Multer/interfaces/File.md)

Defined in: node\_modules/@types/multer/index.d.ts:41

`Multer.File` object populated by `single()` middleware.

***

### files?

> `optional` **files?**: \{\[`fieldname`: `string`\]: [`File`](../namespaces/Multer/interfaces/File.md)[]; \} \| [`File`](../namespaces/Multer/interfaces/File.md)[]

Defined in: node\_modules/@types/multer/index.d.ts:46

Array or dictionary of `Multer.File` object populated by `array()`,
`fields()`, and `any()` middleware.

***

### requestId?

> `optional` **requestId?**: `string`

Defined in: [src/types/express.d.ts:13](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/types/express.d.ts#L13)

Set by `requestId`.

***

### user?

> `optional` **user?**: [`AuthUser`](../../../../../lib/auth/types/interfaces/AuthUser.md)

Defined in: [src/types/express.d.ts:19](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/types/express.d.ts#L19)

Set by `dashboardAuth` or `adminAuth`.
