# Interface: $ZodPreprocessInternals\<B\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1042

## Extends

- [`$ZodPipeInternals`]($ZodPipeInternals.md)\<[`$ZodTransform`]($ZodTransform.md), `B`\>

## Type Parameters

### B

`B` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

## Properties

### def

> **def**: [`$ZodPreprocessDef`]($ZodPreprocessDef.md)\<`B`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1043

Schema definition.

#### Overrides

[`$ZodPipeInternals`]($ZodPipeInternals.md).[`def`]($ZodPipeInternals.md#def)

***

### optin

> **optin**: `B`\[`"_zod"`\]\[`"optin"`\]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1044

#### Overrides

`$ZodPipeInternals.optin`

***

### optout

> **optout**: `B`\[`"_zod"`\]\[`"optout"`\]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1045

#### Overrides

`$ZodPipeInternals.optout`

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodPipeInternals`]($ZodPipeInternals.md).[`toJSONSchema`]($ZodPipeInternals.md#tojsonschema)

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

[`$ZodPipeInternals`]($ZodPipeInternals.md).[`version`]($ZodPipeInternals.md#version)
