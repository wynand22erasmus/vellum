# Function: stringFormat()

> **stringFormat**\<`Format`\>(`format`, `fnOrRegex`, `_params?`): [`ZodCustomStringFormat`](../interfaces/ZodCustomStringFormat.md)\<`Format`\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:301

## Type Parameters

### Format

`Format` *extends* `string`

## Parameters

### format

`Format`

### fnOrRegex

`RegExp` \| ((`arg`) => `unknown`)

### \_params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `message?`: `string`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodCustomStringFormat`](../interfaces/ZodCustomStringFormat.md)\<`Format`\>
