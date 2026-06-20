# Interface: $ZodStringFormatInternals\<Format\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:129

## Extends

- [`$ZodStringInternals`]($ZodStringInternals.md)\<`string`\>.[`$ZodCheckStringFormatInternals`]($ZodCheckStringFormatInternals.md)

## Extended by

- [`$ZodGUIDInternals`]($ZodGUIDInternals.md)
- [`$ZodUUIDInternals`]($ZodUUIDInternals.md)
- [`$ZodEmailInternals`]($ZodEmailInternals.md)
- [`$ZodURLInternals`]($ZodURLInternals.md)
- [`$ZodEmojiInternals`]($ZodEmojiInternals.md)
- [`$ZodNanoIDInternals`]($ZodNanoIDInternals.md)
- [`$ZodCUIDInternals`]($ZodCUIDInternals.md)
- [`$ZodCUID2Internals`]($ZodCUID2Internals.md)
- [`$ZodULIDInternals`]($ZodULIDInternals.md)
- [`$ZodXIDInternals`]($ZodXIDInternals.md)
- [`$ZodKSUIDInternals`]($ZodKSUIDInternals.md)
- [`$ZodISODateTimeInternals`]($ZodISODateTimeInternals.md)
- [`$ZodISODateInternals`]($ZodISODateInternals.md)
- [`$ZodISOTimeInternals`]($ZodISOTimeInternals.md)
- [`$ZodISODurationInternals`]($ZodISODurationInternals.md)
- [`$ZodIPv4Internals`]($ZodIPv4Internals.md)
- [`$ZodIPv6Internals`]($ZodIPv6Internals.md)
- [`$ZodMACInternals`]($ZodMACInternals.md)
- [`$ZodCIDRv4Internals`]($ZodCIDRv4Internals.md)
- [`$ZodCIDRv6Internals`]($ZodCIDRv6Internals.md)
- [`$ZodBase64Internals`]($ZodBase64Internals.md)
- [`$ZodBase64URLInternals`]($ZodBase64URLInternals.md)
- [`$ZodE164Internals`]($ZodE164Internals.md)
- [`$ZodJWTInternals`]($ZodJWTInternals.md)
- [`$ZodCustomStringFormatInternals`]($ZodCustomStringFormatInternals.md)

## Type Parameters

### Format

`Format` *extends* `string` = `string`

## Properties

### def

> **def**: [`$ZodStringFormatDef`]($ZodStringFormatDef.md)\<`Format`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:130

Schema definition.

#### Overrides

[`$ZodStringInternals`]($ZodStringInternals.md).[`def`]($ZodStringInternals.md#def)

***

### issc

> **issc**: [`$ZodIssueInvalidStringFormat`]($ZodIssueInvalidStringFormat.md)

Defined in: node\_modules/zod/v4/core/checks.d.cts:168

The set of issues this check might throw.

#### Inherited from

[`$ZodCheckStringFormatInternals`]($ZodCheckStringFormatInternals.md).[`issc`]($ZodCheckStringFormatInternals.md#issc)

***

### ~~isst~~

> **isst**: [`$ZodIssueInvalidType`]($ZodIssueInvalidType.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:115

#### Deprecated

Internal API, use with caution (not deprecated)

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`isst`]($ZodStringInternals.md#isst)

***

### onattach

> **onattach**: (`schema`) => `void`[]

Defined in: node\_modules/zod/v4/core/checks.d.cts:18

#### Parameters

##### schema

[`$ZodType`]($ZodType-1.md)

#### Returns

`void`

#### Inherited from

[`$ZodCheckStringFormatInternals`]($ZodCheckStringFormatInternals.md).[`onattach`]($ZodCheckStringFormatInternals.md#onattach)

***

### ~~pattern~~

> **pattern**: `RegExp`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:113

#### Deprecated

Internal API, use with caution (not deprecated)

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`pattern`]($ZodStringInternals.md#pattern)

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`toJSONSchema`]($ZodStringInternals.md#tojsonschema)

***

### version

> **version**: `object`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:42

The `@zod/core` version of this schema

#### major

> `readonly` **major**: `4`

#### minor

> `readonly` **minor**: `4`

#### patch

> `readonly` **patch**: `number`

#### Inherited from

[`$ZodStringInternals`]($ZodStringInternals.md).[`version`]($ZodStringInternals.md#version)

## Methods

### check()

> **check**(`payload`): [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

Defined in: node\_modules/zod/v4/core/checks.d.cts:17

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)\<`string`\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

#### Inherited from

[`$ZodCheckStringFormatInternals`]($ZodCheckStringFormatInternals.md).[`check`]($ZodCheckStringFormatInternals.md#check)
