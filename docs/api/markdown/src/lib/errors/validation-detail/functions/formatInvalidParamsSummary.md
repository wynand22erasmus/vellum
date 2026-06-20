# Function: formatInvalidParamsSummary()

> **formatInvalidParamsSummary**(`flattened`): `string`

Defined in: [src/lib/errors/validation-detail.ts:15](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/validation-detail.ts#L15)

Summarizes a flattened Zod error as a single human-readable string.

## Parameters

### flattened

[`$ZodFlattenedError`](../../../documents/uploadSchemas/namespaces/uploadZod/namespaces/core/type-aliases/$ZodFlattenedError.md)\<`unknown`, `string`\>

Output of `ZodError.flatten()`

## Returns

`string`
