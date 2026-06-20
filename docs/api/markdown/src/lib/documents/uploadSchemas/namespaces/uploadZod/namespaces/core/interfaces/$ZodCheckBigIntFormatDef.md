# Interface: $ZodCheckBigIntFormatDef

Defined in: node\_modules/zod/v4/core/checks.d.cts:76

## Extends

- [`$ZodCheckDef`]($ZodCheckDef.md)

## Extended by

- [`$ZodBigIntFormatDef`]($ZodBigIntFormatDef.md)

## Properties

### abort?

> `optional` **abort?**: `boolean`

Defined in: node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

#### Inherited from

[`$ZodCheckDef`]($ZodCheckDef.md).[`abort`]($ZodCheckDef.md#abort)

***

### check

> **check**: `"bigint_format"`

Defined in: node\_modules/zod/v4/core/checks.d.cts:77

#### Overrides

[`$ZodCheckDef`]($ZodCheckDef.md).[`check`]($ZodCheckDef.md#check)

***

### error?

> `optional` **error?**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/zod/v4/core/checks.d.cts:7

#### Inherited from

[`$ZodCheckDef`]($ZodCheckDef.md).[`error`]($ZodCheckDef.md#error)

***

### format

> **format**: [`$ZodBigIntFormats`](../type-aliases/$ZodBigIntFormats.md) \| `undefined`

Defined in: node\_modules/zod/v4/core/checks.d.cts:78

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
