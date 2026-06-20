# ~~Function: cuid()~~

> **cuid**(`params?`): [`ZodCUID`](../interfaces/ZodCUID.md)

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:230

Validates a CUID v1 string.

## Parameters

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; `pattern?`: `RegExp`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; `pattern?`: `RegExp`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### pattern?

`RegExp`

## Returns

[`ZodCUID`](../interfaces/ZodCUID.md)

## Deprecated

CUID v1 is deprecated by its authors due to information leakage
(timestamps embedded in the id). Use [\`z.cuid2()\`](cuid2.md) instead.
See https://github.com/paralleldrive/cuid.
