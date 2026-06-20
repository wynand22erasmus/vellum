# Type Alias: ParsedApiResponse\<T\>

> **ParsedApiResponse**\<`T`\> = \{ `data`: `T`; `ok`: `true`; `result`: [`VellumResult`](../../vellum-result/interfaces/VellumResult.md)\<`T`\>; \} \| \{ `ok`: `false`; `problem`: [`ProblemDetails`](../../problem-details/interfaces/ProblemDetails.md); \}

Defined in: [src/lib/http/parse-envelope.ts:16](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/http/parse-envelope.ts#L16)

Parsed HTTP response — success payload or RFC 9457 problem.

## Type Parameters

### T

`T`
