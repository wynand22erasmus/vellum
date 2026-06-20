# Interface: $ZodCustomDef\<O\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1163

## Extends

- [`$ZodTypeDef`]($ZodTypeDef.md).[`$ZodCheckDef`]($ZodCheckDef.md)

## Type Parameters

### O

`O` = `unknown`

## Properties

### abort?

> `optional` **abort?**: `boolean`

Defined in: node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

#### Inherited from

[`$ZodCheckDef`]($ZodCheckDef.md).[`abort`]($ZodCheckDef.md#abort)

***

### check

> **check**: `"custom"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1165

#### Overrides

[`$ZodCheckDef`]($ZodCheckDef.md).[`check`]($ZodCheckDef.md#check)

***

### checks?

> `optional` **checks?**: [`$ZodCheck`]($ZodCheck.md)\<`never`\>[]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:38

#### Inherited from

[`$ZodTypeDef`]($ZodTypeDef.md).[`checks`]($ZodTypeDef.md#checks)

***

### error?

> `optional` **error?**: [`$ZodErrorMap`]($ZodErrorMap.md)\<[`$ZodIssue`](../type-aliases/$ZodIssue.md)\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1167

#### Overrides

[`$ZodTypeDef`]($ZodTypeDef.md).[`error`]($ZodTypeDef.md#error)

***

### fn

> **fn**: (`arg`) => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1169

#### Parameters

##### arg

`O`

#### Returns

`unknown`

***

### params?

> `optional` **params?**: `Record`\<`string`, `any`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1168

***

### path?

> `optional` **path?**: `PropertyKey`[]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1166

***

### type

> **type**: `"custom"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1164

#### Overrides

[`$ZodTypeDef`]($ZodTypeDef.md).[`type`]($ZodTypeDef.md#type)

***

### when?

> `optional` **when?**: (`payload`) => `boolean`

Defined in: node\_modules/zod/v4/core/checks.d.cts:11

If provided, the check runs only when this returns `true`. By default, it is skipped if prior parsing produced aborting issues.

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)

#### Returns

`boolean`

#### Inherited from

[`$ZodCheckDef`]($ZodCheckDef.md).[`when`]($ZodCheckDef.md#when)
