# Interface: $ZodLazyInternals\<T\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1149

## Type Parameters

### T

`T` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

## Properties

### def

> **def**: [`$ZodLazyDef`]($ZodLazyDef.md)\<`T`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1150

Schema definition.

#### Overrides

`$ZodTypeInternals.def`

***

### innerType

> **innerType**: `T`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1153

Auto-cached way to retrieve the inner schema

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
