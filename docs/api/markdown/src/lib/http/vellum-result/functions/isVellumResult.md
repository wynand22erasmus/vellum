# Function: isVellumResult()

> **isVellumResult**\<`T`\>(`doc`): `doc is VellumResult<T>`

Defined in: [src/lib/http/vellum-result.ts:15](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/http/vellum-result.ts#L15)

Returns true when `doc` is a result envelope (by URI namespace or status).

## Type Parameters

### T

`T` = `unknown`

## Parameters

### doc

[`Rfc9457Document`](../../rfc9457/interfaces/Rfc9457Document.md)

## Returns

`doc is VellumResult<T>`
