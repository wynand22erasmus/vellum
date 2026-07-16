# Function: resolveDevServiceUrl()

> **resolveDevServiceUrl**(`serviceId`, `services`): [`DevServiceLink`](../../dev-services/type-aliases/DevServiceLink.md) \| `undefined`

Defined in: [src/lib/dev-embed.ts:35](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/dev-embed.ts#L35)

Looks up a dev service by id from the configured service list.

## Parameters

### serviceId

`string`

Dev service id (e.g. `mailpit`)

### services

[`DevServiceLink`](../../dev-services/type-aliases/DevServiceLink.md)[]

Available dev service links

## Returns

[`DevServiceLink`](../../dev-services/type-aliases/DevServiceLink.md) \| `undefined`
