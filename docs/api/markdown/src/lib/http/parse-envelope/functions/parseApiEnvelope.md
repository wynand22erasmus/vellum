# Function: parseApiEnvelope()

> **parseApiEnvelope**\<`T`\>(`res`): `Promise`\<[`ParsedApiResponse`](../type-aliases/ParsedApiResponse.md)\<`T`\>\>

Defined in: [src/lib/http/parse-envelope.ts:69](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/http/parse-envelope.ts#L69)

Parses JSON body, Content-Type, and status into a typed envelope.

## Type Parameters

### T

`T`

## Parameters

### res

`Response`

Fetch Response (body consumed once)

## Returns

`Promise`\<[`ParsedApiResponse`](../type-aliases/ParsedApiResponse.md)\<`T`\>\>
