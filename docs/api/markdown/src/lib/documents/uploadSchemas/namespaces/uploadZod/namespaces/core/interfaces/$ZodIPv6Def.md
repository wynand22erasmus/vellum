# Interface: $ZodIPv6Def

Defined in: node\_modules/zod/v4/core/schemas.d.cts:298

## Extends

- [`$ZodStringFormatDef`]($ZodStringFormatDef.md)\<`"ipv6"`\>

## Properties

### abort?

> `optional` **abort?**: `boolean`

Defined in: node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`abort`]($ZodStringFormatDef.md#abort)

***

### check

> **check**: `"string_format"`

Defined in: node\_modules/zod/v4/core/checks.d.cts:162

#### Inherited from

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`check`]($ZodCheckStringFormatDef.md#check)

***

### checks?

> `optional` **checks?**: [`$ZodCheck`]($ZodCheck.md)\<`string`\>[]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:108

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`checks`]($ZodStringFormatDef.md#checks)

***

### coerce?

> `optional` **coerce?**: `boolean`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:107

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`coerce`]($ZodStringFormatDef.md#coerce)

***

### error?

> `optional` **error?**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:37

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`error`]($ZodStringFormatDef.md#error)

***

### format

> **format**: `"ipv6"`

Defined in: node\_modules/zod/v4/core/checks.d.cts:163

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`format`]($ZodStringFormatDef.md#format-1)

***

### pattern?

> `optional` **pattern?**: `RegExp`

Defined in: node\_modules/zod/v4/core/checks.d.cts:164

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`pattern`]($ZodStringFormatDef.md#pattern)

***

### type

> **type**: `"string"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:106

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`type`]($ZodStringFormatDef.md#type)

***

### version?

> `optional` **version?**: `"v6"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:299

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

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`when`]($ZodStringFormatDef.md#when)
