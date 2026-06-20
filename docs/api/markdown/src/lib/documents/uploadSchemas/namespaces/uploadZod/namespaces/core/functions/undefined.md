# Function: \_undefined()

> **\_undefined**\<`T`\>(`Class`, `params?`): `T`

Defined in: node\_modules/zod/v4/core/api.d.cts:151

## Type Parameters

### T

`T` *extends* [`$ZodUndefined`](../interfaces/$ZodUndefined.md)

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<`T`\>

### params?

`string` \| \{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `message?`: `string`; \}

`string`

***

#### Type Literal

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

`T`
