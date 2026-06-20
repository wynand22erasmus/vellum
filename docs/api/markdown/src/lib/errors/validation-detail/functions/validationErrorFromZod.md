# Function: validationErrorFromZod()

> **validationErrorFromZod**(`err`, `preamble?`): [`AppError`](../../app-error/classes/AppError.md)

Defined in: [src/lib/errors/validation-detail.ts:36](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/validation-detail.ts#L36)

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
