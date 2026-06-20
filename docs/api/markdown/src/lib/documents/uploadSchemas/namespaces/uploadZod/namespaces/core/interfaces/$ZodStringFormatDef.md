# Interface: $ZodStringFormatDef\<Format\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:127

## Extends

- [`$ZodStringDef`]($ZodStringDef.md).[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md)\<`Format`\>

## Extended by

- [`$ZodGUIDDef`]($ZodGUIDDef.md)
- [`$ZodUUIDDef`]($ZodUUIDDef.md)
- [`$ZodEmailDef`]($ZodEmailDef.md)
- [`$ZodURLDef`]($ZodURLDef.md)
- [`$ZodEmojiDef`]($ZodEmojiDef.md)
- [`$ZodNanoIDDef`]($ZodNanoIDDef.md)
- [`$ZodCUIDDef`]($ZodCUIDDef.md)
- [`$ZodCUID2Def`]($ZodCUID2Def.md)
- [`$ZodULIDDef`]($ZodULIDDef.md)
- [`$ZodXIDDef`]($ZodXIDDef.md)
- [`$ZodKSUIDDef`]($ZodKSUIDDef.md)
- [`$ZodISODateTimeDef`]($ZodISODateTimeDef.md)
- [`$ZodISODateDef`]($ZodISODateDef.md)
- [`$ZodISOTimeDef`]($ZodISOTimeDef.md)
- [`$ZodISODurationDef`]($ZodISODurationDef.md)
- [`$ZodIPv4Def`]($ZodIPv4Def.md)
- [`$ZodIPv6Def`]($ZodIPv6Def.md)
- [`$ZodMACDef`]($ZodMACDef.md)
- [`$ZodCIDRv4Def`]($ZodCIDRv4Def.md)
- [`$ZodCIDRv6Def`]($ZodCIDRv6Def.md)
- [`$ZodBase64Def`]($ZodBase64Def.md)
- [`$ZodBase64URLDef`]($ZodBase64URLDef.md)
- [`$ZodE164Def`]($ZodE164Def.md)
- [`$ZodJWTDef`]($ZodJWTDef.md)
- [`$ZodCustomStringFormatDef`]($ZodCustomStringFormatDef.md)

## Type Parameters

### Format

`Format` *extends* `string` = `string`

## Properties

### abort?

> `optional` **abort?**: `boolean`

Defined in: node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

#### Inherited from

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`abort`]($ZodCheckStringFormatDef.md#abort)

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

[`$ZodStringDef`]($ZodStringDef.md).[`checks`]($ZodStringDef.md#checks)

***

### coerce?

> `optional` **coerce?**: `boolean`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:107

#### Inherited from

[`$ZodStringDef`]($ZodStringDef.md).[`coerce`]($ZodStringDef.md#coerce)

***

### error?

> `optional` **error?**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:37

#### Inherited from

[`$ZodStringDef`]($ZodStringDef.md).[`error`]($ZodStringDef.md#error)

***

### format

> **format**: `Format`

Defined in: node\_modules/zod/v4/core/checks.d.cts:163

#### Inherited from

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`format`]($ZodCheckStringFormatDef.md#format-1)

***

### pattern?

> `optional` **pattern?**: `RegExp`

Defined in: node\_modules/zod/v4/core/checks.d.cts:164

#### Inherited from

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`pattern`]($ZodCheckStringFormatDef.md#pattern)

***

### type

> **type**: `"string"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:106

#### Inherited from

[`$ZodStringDef`]($ZodStringDef.md).[`type`]($ZodStringDef.md#type)

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

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`when`]($ZodCheckStringFormatDef.md#when)
