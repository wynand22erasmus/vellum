# Function: duration()

> **duration**(`params?`): [`ZodISODuration`](../../../interfaces/ZodISODuration.md)

Defined in: node\_modules/zod/v4/classic/iso.d.cts:22

## Parameters

### params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../../core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; `pattern?`: `RegExp`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../../core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; `pattern?`: `RegExp`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../../core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../../core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../../core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### pattern?

`RegExp`

## Returns

[`ZodISODuration`](../../../interfaces/ZodISODuration.md)
