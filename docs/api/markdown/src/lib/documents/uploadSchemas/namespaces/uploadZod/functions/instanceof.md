# Function: instanceof()

> **instanceof**\<`T`\>(`cls`, `params?`): [`ZodCustom`](../interfaces/ZodCustom.md)\<`InstanceType`\<`T`\>, `InstanceType`\<`T`\>\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:747

## Type Parameters

### T

`T` *extends* *typeof* [`Class`](../namespaces/util/classes/Class.md)

## Parameters

### cls

`T`

### params?

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueCustom`](../namespaces/core/interfaces/$ZodIssueCustom.md)\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### when?

(`payload`) => `boolean`

If provided, the check runs only when this returns `true`. By default, it is skipped if prior parsing produced aborting issues.

## Returns

[`ZodCustom`](../interfaces/ZodCustom.md)\<`InstanceType`\<`T`\>, `InstanceType`\<`T`\>\>
