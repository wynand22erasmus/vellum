# Interface: $ZodCheckLessThanDef

Defined in: node\_modules/zod/v4/core/checks.d.cts:24

## Extends

- [`$ZodCheckDef`]($ZodCheckDef.md)

## Properties

### abort?

> `optional` **abort?**: `boolean`

Defined in: node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

#### Inherited from

[`$ZodCheckDef`]($ZodCheckDef.md).[`abort`]($ZodCheckDef.md#abort)

***

### check

> **check**: `"less_than"`

Defined in: node\_modules/zod/v4/core/checks.d.cts:25

#### Overrides

[`$ZodCheckDef`]($ZodCheckDef.md).[`check`]($ZodCheckDef.md#check)

***

### error?

> `optional` **error?**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/zod/v4/core/checks.d.cts:7

#### Inherited from

[`$ZodCheckDef`]($ZodCheckDef.md).[`error`]($ZodCheckDef.md#error)

***

### inclusive

> **inclusive**: `boolean`

Defined in: node\_modules/zod/v4/core/checks.d.cts:27

***

### value

> **value**: [`Numeric`](../../util/type-aliases/Numeric.md)

Defined in: node\_modules/zod/v4/core/checks.d.cts:26

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
