# Function: \_file()

> **\_file**(`Class`, `params?`): [`$ZodFile`](../interfaces/$ZodFile.md)

Defined in: node\_modules/zod/v4/core/api.d.cts:264

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodFile`](../interfaces/$ZodFile.md)\>

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

[`$ZodFile`](../interfaces/$ZodFile.md)
