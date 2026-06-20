# Function: custom()

> **custom**\<`O`\>(`fn?`, `_params?`): [`ZodCustom`](../interfaces/ZodCustom.md)\<`O`, `O`\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:741

## Type Parameters

### O

`O`

## Parameters

### fn?

(`data`) => `unknown`

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

[`ZodCustom`](../interfaces/ZodCustom.md)\<`O`, `O`\>
