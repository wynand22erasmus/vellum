# Type Alias: ConvertPartsToStringTuple\<Parts\>

> **ConvertPartsToStringTuple**\<`Parts`\> = `` { [K in keyof Parts]: Parts[K] extends LiteralPart ? `${UndefinedToEmptyString<Parts[K]>}` : Parts[K] extends $ZodType ? `${output<Parts[K]> extends infer T extends LiteralPart ? UndefinedToEmptyString<T> : never}` : never } ``

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1094

## Type Parameters

### Parts

`Parts` *extends* [`$ZodTemplateLiteralPart`]($ZodTemplateLiteralPart.md)[]
