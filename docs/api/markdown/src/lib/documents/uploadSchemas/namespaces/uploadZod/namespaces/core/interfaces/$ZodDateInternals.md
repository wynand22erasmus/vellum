# Interface: $ZodDateInternals\<T\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:546

## Type Parameters

### T

`T` = `unknown`

## Properties

### def

> **def**: [`$ZodDateDef`]($ZodDateDef.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:547

Schema definition.

#### Overrides

`$ZodTypeInternals.def`

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

`$ZodTypeInternals.toJSONSchema`

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

`$ZodTypeInternals.version`
