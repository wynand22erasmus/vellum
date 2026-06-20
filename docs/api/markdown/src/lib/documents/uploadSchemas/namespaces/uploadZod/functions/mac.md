# Function: mac()

> **mac**(`params?`): [`ZodMAC`](../interfaces/ZodMAC.md)

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:260

## Parameters

### params?

`string` \| \{ `abort?`: `boolean`; `delimiter?`: `string`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `delimiter?`: `string`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### delimiter?

`string`

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodMAC`](../interfaces/ZodMAC.md)
