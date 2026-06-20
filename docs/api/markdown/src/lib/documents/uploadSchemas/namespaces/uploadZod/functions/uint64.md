# Function: uint64()

> **uint64**(`params?`): [`ZodBigIntFormat`](../interfaces/ZodBigIntFormat.md)

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:393

## Parameters

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`"bigint"`\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`"bigint"`\>\>\>; `message?`: `string`; `when?`: (`payload`) => `boolean`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`"bigint"`\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`"bigint"`\>\>\>; `message?`: `string`; `when?`: (`payload`) => `boolean`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`"bigint"`\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`"bigint"`\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### when?

(`payload`) => `boolean`

If provided, the check runs only when this returns `true`. By default, it is skipped if prior parsing produced aborting issues.

## Returns

[`ZodBigIntFormat`](../interfaces/ZodBigIntFormat.md)
