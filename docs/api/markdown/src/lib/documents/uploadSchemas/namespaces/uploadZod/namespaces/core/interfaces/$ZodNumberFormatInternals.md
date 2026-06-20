# Interface: $ZodNumberFormatInternals

Defined in: node\_modules/zod/v4/core/schemas.d.cts:410

## Extends

- [`$ZodNumberInternals`]($ZodNumberInternals.md)\<`number`\>.[`$ZodCheckNumberFormatInternals`]($ZodCheckNumberFormatInternals.md)

## Properties

### def

> **def**: [`$ZodNumberFormatDef`]($ZodNumberFormatDef.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:411

Schema definition.

#### Overrides

[`$ZodNumberInternals`]($ZodNumberInternals.md).[`def`]($ZodNumberInternals.md#def)

***

### issc

> **issc**: [`$ZodIssueInvalidType`]($ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`]($ZodIssueTooBig.md)\<`"number"`\> \| [`$ZodIssueTooSmall`]($ZodIssueTooSmall.md)\<`"number"`\>

Defined in: node\_modules/zod/v4/core/checks.d.cts:69

The set of issues this check might throw.

#### Inherited from

`$ZodNumberFormatInternals`.[`issc`](#issc)

***

### ~~isst~~

> **isst**: [`$ZodIssueInvalidType`]($ZodIssueInvalidType.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:412

#### Deprecated

Internal API, use with caution (not deprecated)

#### Overrides

[`$ZodNumberInternals`]($ZodNumberInternals.md).[`isst`]($ZodNumberInternals.md#isst)

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

[`$ZodCheckNumberFormatInternals`]($ZodCheckNumberFormatInternals.md).[`onattach`]($ZodCheckNumberFormatInternals.md#onattach)

***

### ~~pattern~~

> **pattern**: `RegExp`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:392

#### Deprecated

Internal API, use with caution (not deprecated)

#### Inherited from

[`$ZodNumberInternals`]($ZodNumberInternals.md).[`pattern`]($ZodNumberInternals.md#pattern)

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodNumberInternals`]($ZodNumberInternals.md).[`toJSONSchema`]($ZodNumberInternals.md#tojsonschema)

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

[`$ZodNumberInternals`]($ZodNumberInternals.md).[`version`]($ZodNumberInternals.md#version)

## Methods

### check()

> **check**(`payload`): [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

Defined in: node\_modules/zod/v4/core/checks.d.cts:17

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)\<`number`\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<`void`\>

#### Inherited from

[`$ZodCheckNumberFormatInternals`]($ZodCheckNumberFormatInternals.md).[`check`]($ZodCheckNumberFormatInternals.md#check)
