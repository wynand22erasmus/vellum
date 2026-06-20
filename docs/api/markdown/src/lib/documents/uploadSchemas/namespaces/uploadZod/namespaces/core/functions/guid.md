# Function: \_guid()

> **\_guid**\<`T`\>(`Class`, `params?`): `T`

Defined in: node\_modules/zod/v4/core/api.d.cts:30

## Type Parameters

### T

`T` *extends* [`$ZodGUID`](../interfaces/$ZodGUID.md)

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<`T`\>

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; \} \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

`T`
