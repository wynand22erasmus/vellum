# Function: refine()

> **refine**\<`T`\>(`fn`, `_params?`): [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<`T`\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:742

## Type Parameters

### T

`T`

## Parameters

### fn

(`arg`) => `unknown`

### \_params?

`string` \| \{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; `when?`: (`payload`) => `boolean`; \}

`string`

***

#### Type Literal

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; `when?`: (`payload`) => `boolean`; \}

##### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

##### params?

`Record`\<`string`, `any`\>

##### path?

`PropertyKey`[]

##### when?

(`payload`) => `boolean`

If provided, the check runs only when this returns `true`. By default, it is skipped if prior parsing produced aborting issues.

## Returns

[`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<`T`\>
