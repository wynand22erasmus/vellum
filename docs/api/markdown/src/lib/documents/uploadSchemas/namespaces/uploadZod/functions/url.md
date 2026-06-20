# Function: url()

> **url**(`params?`): [`ZodURL`](../interfaces/ZodURL.md)

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:197

## Parameters

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `hostname?`: `RegExp`; `message?`: `string`; `normalize?`: `boolean`; `pattern?`: `RegExp`; `protocol?`: `RegExp`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `hostname?`: `RegExp`; `message?`: `string`; `normalize?`: `boolean`; `pattern?`: `RegExp`; `protocol?`: `RegExp`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>

##### hostname?

`RegExp`

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### normalize?

`boolean`

##### pattern?

`RegExp`

##### protocol?

`RegExp`

## Returns

[`ZodURL`](../interfaces/ZodURL.md)
