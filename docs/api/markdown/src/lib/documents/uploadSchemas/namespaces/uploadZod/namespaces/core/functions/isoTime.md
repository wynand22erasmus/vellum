# Function: \_isoTime()

> **\_isoTime**\<`T`\>(`Class`, `params?`): `T`

Defined in: node\_modules/zod/v4/core/api.d.cts:124

## Type Parameters

### T

`T` *extends* [`$ZodISOTime`](../interfaces/$ZodISOTime.md)

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<`T`\>

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `precision?`: `number` \| `null`; \} \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; `precision?`: `number` \| `null`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>; `message?`: `string`; `precision?`: `number` \| `null`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### precision?

`number` \| `null`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; `precision?`: `number` \| `null`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### precision?

`number` \| `null`

## Returns

`T`
