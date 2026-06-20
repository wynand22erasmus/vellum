# Interface: $ZodBigIntFormatInternals

Defined in: node\_modules/zod/v4/core/schemas.d.cts:454

## Extends

- [`$ZodBigIntInternals`]($ZodBigIntInternals.md)\<`bigint`\>.[`$ZodCheckBigIntFormatInternals`]($ZodCheckBigIntFormatInternals.md)

## Properties

### issc

> **issc**: [`$ZodIssueTooBig`]($ZodIssueTooBig.md)\<`"bigint"`\> \| [`$ZodIssueTooSmall`]($ZodIssueTooSmall.md)\<`"bigint"`\>

Defined in: node\_modules/zod/v4/core/checks.d.cts:82

The set of issues this check might throw.

#### Inherited from

[`$ZodCheckBigIntFormatInternals`]($ZodCheckBigIntFormatInternals.md).[`issc`]($ZodCheckBigIntFormatInternals.md#issc)

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

[`$ZodCheckBigIntFormatInternals`]($ZodCheckBigIntFormatInternals.md).[`onattach`]($ZodCheckBigIntFormatInternals.md#onattach)

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`toJSONSchema`]($ZodBigIntInternals.md#tojsonschema)

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

[`$ZodBigIntInternals`]($ZodBigIntInternals.md).[`version`]($ZodBigIntInternals.md#version)

## Methods

### check()

> **check**(`payload`): [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

Defined in: node\_modules/zod/v4/core/checks.d.cts:17

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)\<`bigint`\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

#### Inherited from

[`$ZodCheckBigIntFormatInternals`]($ZodCheckBigIntFormatInternals.md).[`check`]($ZodCheckBigIntFormatInternals.md#check)
