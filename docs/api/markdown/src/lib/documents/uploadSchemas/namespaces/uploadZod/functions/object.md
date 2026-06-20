# Function: object()

> **object**\<`T`\>(`shape?`, `params?`): [`ZodObject`](../interfaces/ZodObject.md)\<\{ -readonly \[P in string \| number \| symbol\]: T\[P\] \}, [`$strip`](../namespaces/core/type-aliases/$strip.md)\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:490

## Type Parameters

### T

`T` *extends* [`$ZodLooseShape`](../namespaces/core/type-aliases/$ZodLooseShape.md) = `Partial`\<`Record`\<`never`, [`SomeType`](../namespaces/core/type-aliases/SomeType.md)\>\>

## Parameters

### shape?

`T`

### params?

`string` \| \{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueUnrecognizedKeys`](../namespaces/core/interfaces/$ZodIssueUnrecognizedKeys.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; \}

`string`

***

#### Type Literal

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueUnrecognizedKeys`](../namespaces/core/interfaces/$ZodIssueUnrecognizedKeys.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueUnrecognizedKeys`](../namespaces/core/interfaces/$ZodIssueUnrecognizedKeys.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodObject`](../interfaces/ZodObject.md)\<\{ -readonly \[P in string \| number \| symbol\]: T\[P\] \}, [`$strip`](../namespaces/core/type-aliases/$strip.md)\>
