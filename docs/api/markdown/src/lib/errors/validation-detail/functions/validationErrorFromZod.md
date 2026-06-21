# Function: validationErrorFromZod()

> **validationErrorFromZod**(`err`, `preamble?`): [`AppError`](../../app-error/classes/AppError.md)

Defined in: [src/lib/errors/validation-detail.ts:36](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/validation-detail.ts#L36)

Maps a Zod failure to [AppError.badRequest](../../app-error/classes/AppError.md#badrequest) with `invalidParams` extension.

## Parameters

### err

[`ZodError`](../../../documents/uploadSchemas/namespaces/uploadZod/interfaces/ZodError.md)

Zod validation error

### preamble?

`string` = `'Validation failed.'`

Prefix before field-level summary

## Returns

[`AppError`](../../app-error/classes/AppError.md)
