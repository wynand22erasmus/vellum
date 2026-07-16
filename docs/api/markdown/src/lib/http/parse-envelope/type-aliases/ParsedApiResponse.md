# Type Alias: ParsedApiResponse\<T\>

> **ParsedApiResponse**\<`T`\> = \{ `data`: `T`; `ok`: `true`; `result`: [`VellumResult`](../../vellum-result/interfaces/VellumResult.md)\<`T`\>; \} \| \{ `ok`: `false`; `problem`: [`ProblemDetails`](../../problem-details/interfaces/ProblemDetails.md); \}

Defined in: [src/lib/http/parse-envelope.ts:16](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/http/parse-envelope.ts#L16)

Parsed HTTP response — success payload or RFC 9457 problem.

## Type Parameters

### T

`T`
