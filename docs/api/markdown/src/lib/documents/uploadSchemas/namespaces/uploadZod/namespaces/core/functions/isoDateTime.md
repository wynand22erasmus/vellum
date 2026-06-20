# Function: \_isoDateTime()

> **\_isoDateTime**\<`T`\>(`Class`, `params?`): `T`

Defined in: node\_modules/zod/v4/core/api.d.cts:118

## Type Parameters

### T

`T` *extends* [`$ZodISODateTime`](../interfaces/$ZodISODateTime.md)

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<`T`\>

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>; `local?`: `boolean`; `message?`: `string`; `offset?`: `boolean`; `precision?`: `number` \| `null`; \} \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `local?`: `boolean`; `message?`: `string`; `offset?`: `boolean`; `precision?`: `number` \| `null`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>; `local?`: `boolean`; `message?`: `string`; `offset?`: `boolean`; `precision?`: `number` \| `null`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md)\>

##### local?

`boolean`

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### offset?

`boolean`

##### precision?

`number` \| `null`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `local?`: `boolean`; `message?`: `string`; `offset?`: `boolean`; `precision?`: `number` \| `null`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>

##### local?

`boolean`

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### offset?

`boolean`

##### precision?

`number` \| `null`

## Returns

`T`
