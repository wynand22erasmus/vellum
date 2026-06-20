# Interface: $ZodTypeDiscriminableInternals\<Disc\>

Defined in: node\_modules/zod/v4/core/api.d.cts:228

## Type Parameters

### Disc

`Disc` *extends* `string` = `string`

## Properties

### def

> **def**: [`$ZodTypeDef`]($ZodTypeDef.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:44

Schema definition.

#### Inherited from

`schemas.$ZodTypeInternals.def`

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

`schemas.$ZodTypeInternals.toJSONSchema`

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

`schemas.$ZodTypeInternals.version`
