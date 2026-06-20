# Function: \_set()

> **\_set**\<`Value`\>(`Class`, `valueType`, `params?`): [`$ZodSet`](../interfaces/$ZodSet.md)\<`Value`\>

Defined in: node\_modules/zod/v4/core/api.d.cts:248

## Type Parameters

### Value

`Value` *extends* [`$ZodObject`](../interfaces/$ZodObject.md)\<`Readonly`\<`Readonly`\<\{\[`k`: `string`\]: [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\>\>, [`$ZodObjectConfig`](../type-aliases/$ZodObjectConfig.md)\>

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodSet`](../interfaces/$ZodSet.md)\<[`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\>\>

### valueType

`Value`

### params?

`string` \| \{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `message?`: `string`; \}

`string`

***

#### Type Literal

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodSet`](../interfaces/$ZodSet.md)\<`Value`\>
