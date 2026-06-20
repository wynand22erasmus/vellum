# Function: \_nonpositive()

> **\_nonpositive**(`params?`): [`$ZodCheckLessThan`](../interfaces/$ZodCheckLessThan.md)

Defined in: node\_modules/zod/v4/core/api.d.cts:181

## Parameters

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../../util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../../util/type-aliases/Numeric.md)\>\>; `message?`: `string`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<[`Numeric`](../../util/type-aliases/Numeric.md)\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodCheckLessThan`](../interfaces/$ZodCheckLessThan.md)
