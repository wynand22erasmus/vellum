# Interface: $ZodISODurationInternals

Defined in: node\_modules/zod/v4/core/schemas.d.cts:282

## Extends

- [`$ZodStringFormatInternals`]($ZodStringFormatInternals.md)\<`"duration"`\>

## Properties

### def

> **def**: [`$ZodStringFormatDef`]($ZodStringFormatDef.md)\<`"duration"`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:130

Schema definition.

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`def`]($ZodStringFormatInternals.md#def)

***

### issc

> **issc**: [`$ZodIssueInvalidStringFormat`]($ZodIssueInvalidStringFormat.md)

Defined in: node\_modules/zod/v4/core/checks.d.cts:168

The set of issues this check might throw.

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`issc`]($ZodStringFormatInternals.md#issc)

***

### ~~isst~~

> **isst**: [`$ZodIssueInvalidType`]($ZodIssueInvalidType.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:115

#### Deprecated

Internal API, use with caution (not deprecated)

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`isst`]($ZodStringFormatInternals.md#isst)

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

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`onattach`]($ZodStringFormatInternals.md#onattach)

***

### ~~pattern~~

> **pattern**: `RegExp`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:113

#### Deprecated

Internal API, use with caution (not deprecated)

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`pattern`]($ZodStringFormatInternals.md#pattern)

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`toJSONSchema`]($ZodStringFormatInternals.md#tojsonschema)

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

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`version`]($ZodStringFormatInternals.md#version)

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

[`$ZodStringFormatInternals`]($ZodStringFormatInternals.md).[`check`]($ZodStringFormatInternals.md#check)
