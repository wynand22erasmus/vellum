# Function: datetime()

> **datetime**(`params?`): [`ZodISODateTime`](../../../interfaces/ZodISODateTime.md)

Defined in: node\_modules/zod/v4/classic/iso.d.cts:7

## Parameters

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../../core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `local?`: `boolean`; `message?`: `string`; `offset?`: `boolean`; `precision?`: `number` \| `null`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../../core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `local?`: `boolean`; `message?`: `string`; `offset?`: `boolean`; `precision?`: `number` \| `null`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../../core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>

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

[`ZodISODateTime`](../../../interfaces/ZodISODateTime.md)
