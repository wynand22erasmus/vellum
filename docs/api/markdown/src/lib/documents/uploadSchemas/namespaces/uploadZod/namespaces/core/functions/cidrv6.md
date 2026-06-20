# Function: \_cidrv6()

> **\_cidrv6**\<`T`\>(`Class`, `params?`): `T`

Defined in: node\_modules/zod/v4/core/api.d.cts:96

## Type Parameters

### T

`T` *extends* [`$ZodCIDRv6`](../interfaces/$ZodCIDRv6.md)

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<`T`\>

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; `version?`: `"v6"`; \} \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `version?`: `"v6"`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; `version?`: `"v6"`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### version?

`"v6"`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `version?`: `"v6"`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### version?

`"v6"`

## Returns

`T`
