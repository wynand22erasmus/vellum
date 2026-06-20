# Type Alias: SafeExtendShape\<Base, Ext\>

> **SafeExtendShape**\<`Base`, `Ext`\> = `{ [K in keyof Ext]: K extends keyof Base ? output<Ext[K]> extends output<Base[K]> ? input<Ext[K]> extends input<Base[K]> ? Ext[K] : never : never : Ext[K] }`

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:449

## Type Parameters

### Base

`Base` *extends* [`$ZodShape`](../namespaces/core/type-aliases/$ZodShape.md)

### Ext

`Ext` *extends* [`$ZodLooseShape`](../namespaces/core/type-aliases/$ZodLooseShape.md)
