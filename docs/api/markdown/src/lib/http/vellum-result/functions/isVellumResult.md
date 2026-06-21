# Function: isVellumResult()

> **isVellumResult**\<`T`\>(`doc`): `doc is VellumResult<T>`

Defined in: [src/lib/http/vellum-result.ts:15](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/http/vellum-result.ts#L15)

Returns true when `doc` is a result envelope (by URI namespace or status).

## Type Parameters

### T

`T` = `unknown`

## Parameters

### doc

[`Rfc9457Document`](../../rfc9457/interfaces/Rfc9457Document.md)

## Returns

`doc is VellumResult<T>`
