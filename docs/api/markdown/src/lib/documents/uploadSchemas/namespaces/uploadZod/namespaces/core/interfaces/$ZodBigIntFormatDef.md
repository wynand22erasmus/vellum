# Interface: $ZodBigIntFormatDef

Defined in: node\_modules/zod/v4/core/schemas.d.cts:451

## Extends

- [`$ZodBigIntDef`]($ZodBigIntDef.md).[`$ZodCheckBigIntFormatDef`]($ZodCheckBigIntFormatDef.md)

## Properties

### abort?

> `optional` **abort?**: `boolean`

Defined in: node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

#### Inherited from

[`$ZodCheckBigIntFormatDef`]($ZodCheckBigIntFormatDef.md).[`abort`]($ZodCheckBigIntFormatDef.md#abort)

***

### check

> **check**: `"bigint_format"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:452

#### Overrides

[`$ZodCheckBigIntFormatDef`]($ZodCheckBigIntFormatDef.md).[`check`]($ZodCheckBigIntFormatDef.md#check)

***

### checks?

> `optional` **checks?**: [`$ZodCheck`]($ZodCheck.md)\<`never`\>[]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:38

#### Inherited from

[`$ZodBigIntDef`]($ZodBigIntDef.md).[`checks`]($ZodBigIntDef.md#checks)

***

### coerce?

> `optional` **coerce?**: `boolean`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:434

#### Inherited from

[`$ZodBigIntDef`]($ZodBigIntDef.md).[`coerce`]($ZodBigIntDef.md#coerce)

***

### error?

> `optional` **error?**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:37

#### Inherited from

[`$ZodBigIntDef`]($ZodBigIntDef.md).[`error`]($ZodBigIntDef.md#error)

***

### format

> **format**: [`$ZodBigIntFormats`](../type-aliases/$ZodBigIntFormats.md) \| `undefined`

Defined in: node\_modules/zod/v4/core/checks.d.cts:78

#### Inherited from

[`$ZodCheckBigIntFormatDef`]($ZodCheckBigIntFormatDef.md).[`format`]($ZodCheckBigIntFormatDef.md#format)

***

### type

> **type**: `"bigint"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:433

#### Inherited from

[`$ZodBigIntDef`]($ZodBigIntDef.md).[`type`]($ZodBigIntDef.md#type)

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

[`$ZodCheckBigIntFormatDef`]($ZodCheckBigIntFormatDef.md).[`when`]($ZodCheckBigIntFormatDef.md#when)
