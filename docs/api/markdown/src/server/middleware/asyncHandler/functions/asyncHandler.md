# Function: asyncHandler()

> **asyncHandler**(`fn`): `RequestHandler`

Defined in: [src/server/middleware/asyncHandler.ts:14](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/middleware/asyncHandler.ts#L14)

Catches promise rejections from async route handlers and forwards them to `next(err)`.

## Parameters

### fn

(`req`, `res`, `next`) => `Promise`\<`void` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Async Express handler

## Returns

`RequestHandler`
