# Interface: $ZodTemplateLiteralInternals\<Template\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1072

## Type Parameters

### Template

`Template` *extends* `string` = `string`

## Properties

### def

> **def**: [`$ZodTemplateLiteralDef`]($ZodTemplateLiteralDef.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1074

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
