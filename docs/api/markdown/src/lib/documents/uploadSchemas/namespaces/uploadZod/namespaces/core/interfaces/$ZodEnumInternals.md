# Interface: $ZodEnumInternals\<T\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:796

## Type Parameters

### T

`T` *extends* [`EnumLike`](../../util/type-aliases/EnumLike.md) = [`EnumLike`](../../util/type-aliases/EnumLike.md)

## Properties

### def

> **def**: [`$ZodEnumDef`]($ZodEnumDef.md)\<`T`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:799

Schema definition.

#### Overrides

`$ZodTypeInternals.def`

***

### ~~pattern~~

> **pattern**: `RegExp`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:803

#### Deprecated

Internal API, use with caution (not deprecated)

#### Overrides

`$ZodTypeInternals.pattern`

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

### ~~values~~

> **values**: [`PrimitiveSet`](../../util/type-aliases/PrimitiveSet.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:801

#### Deprecated

Internal API, use with caution (not deprecated)

#### Overrides

`$ZodTypeInternals.values`

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
