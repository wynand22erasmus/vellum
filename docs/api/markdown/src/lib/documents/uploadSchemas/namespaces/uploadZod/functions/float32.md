# Function: float32()

> **float32**(`params?`): [`ZodFloat32`](../interfaces/ZodFloat32.md)

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:350

## Parameters

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`"number"`\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`"number"`\>\>\>; `message?`: `string`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`"number"`\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`"number"`\>\>\>; `message?`: `string`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`"number"`\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`"number"`\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodFloat32`](../interfaces/ZodFloat32.md)
