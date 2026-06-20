# Function: date()

> **date**\<`T`\>(`params?`): [`ZodCoercedDate`](../../../interfaces/ZodCoercedDate.md)\<`T`\>

Defined in: node\_modules/zod/v4/classic/coerce.d.cts:17

## Type Parameters

### T

`T` = `unknown`

## Parameters

### params?

`string` \| \{ `error?`: `string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `message?`: `string`; \}

`string`

***

#### Type Literal

\{ `error?`: `string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodCoercedDate`](../../../interfaces/ZodCoercedDate.md)\<`T`\>
