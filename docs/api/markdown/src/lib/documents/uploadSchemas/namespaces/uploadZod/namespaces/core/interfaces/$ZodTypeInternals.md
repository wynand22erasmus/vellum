# Interface: \_$ZodTypeInternals

Defined in: node\_modules/zod/v4/core/schemas.d.cts:40

## Extended by

- [`$ZodArrayInternals`]($ZodArrayInternals.md)
- [`$ZodObjectInternals`]($ZodObjectInternals.md)
- [`$ZodUnionInternals`]($ZodUnionInternals.md)
- [`$ZodIntersectionInternals`]($ZodIntersectionInternals.md)
- [`$ZodTupleInternals`]($ZodTupleInternals.md)

## Properties

### def

> **def**: [`$ZodTypeDef`]($ZodTypeDef.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:44

Schema definition.

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

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
