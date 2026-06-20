# Function: hash()

> **hash**\<`Alg`, `Enc`\>(`alg`, `params?`): [`ZodCustomStringFormat`](../interfaces/ZodCustomStringFormat.md)\<`` `${Alg}_${Enc}` ``\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:304

## Type Parameters

### Alg

`Alg` *extends* [`HashAlgorithm`](../namespaces/util/type-aliases/HashAlgorithm.md)

### Enc

`Enc` *extends* [`HashEncoding`](../namespaces/util/type-aliases/HashEncoding.md) = `"hex"`

## Parameters

### alg

`Alg`

### params?

`object` & `object`

## Returns

[`ZodCustomStringFormat`](../interfaces/ZodCustomStringFormat.md)\<`` `${Alg}_${Enc}` ``\>
