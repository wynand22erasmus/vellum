# Function: \_uint64()

> **\_uint64**\<`T`\>(`Class`, `params?`): `T`

Defined in: node\_modules/zod/v4/core/api.d.cts:147

## Type Parameters

### T

`T` *extends* [`$ZodBigIntFormat`](../interfaces/$ZodBigIntFormat.md)

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<`T`\>

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<`"bigint"`\> \| [`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<`"bigint"`\>\>\>; `message?`: `string`; `when?`: (`payload`) => `boolean`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<`"bigint"`\> \| [`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<`"bigint"`\>\>\>; `message?`: `string`; `when?`: (`payload`) => `boolean`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<`"bigint"`\> \| [`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<`"bigint"`\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### when?

(`payload`) => `boolean`

If provided, the check runs only when this returns `true`. By default, it is skipped if prior parsing produced aborting issues.

## Returns

`T`
