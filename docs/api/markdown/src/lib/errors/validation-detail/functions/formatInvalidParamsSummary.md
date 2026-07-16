# Function: formatInvalidParamsSummary()

> **formatInvalidParamsSummary**(`flattened`): `string`

Defined in: [src/lib/errors/validation-detail.ts:15](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/validation-detail.ts#L15)

Summarizes a flattened Zod error as a single human-readable string.

## Parameters

### flattened

[`$ZodFlattenedError`](../../../documents/uploadSchemas/namespaces/uploadZod/namespaces/core/type-aliases/$ZodFlattenedError.md)\<`unknown`, `string`\>

Output of `ZodError.flatten()`

## Returns

`string`
