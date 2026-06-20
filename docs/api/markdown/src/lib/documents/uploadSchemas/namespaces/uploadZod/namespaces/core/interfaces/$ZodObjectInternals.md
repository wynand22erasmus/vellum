# Interface: $ZodObjectInternals\<Shape, Config\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:624

## Extends

- [`_$ZodTypeInternals`]($ZodTypeInternals.md)

## Type Parameters

### Shape

`Shape` *extends* [`$ZodShape`](../type-aliases/$ZodShape.md) = [`$ZodShape`](../type-aliases/$ZodShape.md)

### Config

`Config` *extends* [`$ZodObjectConfig`](../type-aliases/$ZodObjectConfig.md) = [`$ZodObjectConfig`](../type-aliases/$ZodObjectConfig.md)

## Properties

### config

> **config**: `Config`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:628

***

### def

> **def**: [`$ZodObjectDef`]($ZodObjectDef.md)\<`Shape`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:627

Schema definition.

#### Overrides

[`_$ZodTypeInternals`]($ZodTypeInternals.md).[`def`]($ZodTypeInternals.md#def)

***

### input

> **input**: [`$InferObjectInput`](../type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:632

***

### output

> **output**: [`$InferObjectOutput`](../type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:631

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`_$ZodTypeInternals`]($ZodTypeInternals.md).[`toJSONSchema`]($ZodTypeInternals.md#tojsonschema)

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

[`_$ZodTypeInternals`]($ZodTypeInternals.md).[`version`]($ZodTypeInternals.md#version)
