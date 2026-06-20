# Type Alias: ExtractIndexSignature\<T\>

> **ExtractIndexSignature**\<`T`\> = `{ [K in keyof T as string extends K ? K : K extends string ? never : K]: T[K] }`

Defined in: node\_modules/zod/v4/core/util.d.cts:73

## Type Parameters

### T

`T`
