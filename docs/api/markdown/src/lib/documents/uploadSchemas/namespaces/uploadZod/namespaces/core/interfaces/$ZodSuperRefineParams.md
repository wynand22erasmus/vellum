# Interface: $ZodSuperRefineParams

Defined in: node\_modules/zod/v4/core/api.d.cts:302

## Properties

### when?

> `optional` **when?**: (`payload`) => `boolean`

Defined in: node\_modules/zod/v4/core/api.d.cts:304

If provided, the refinement runs only when this returns `true`. By default, it is skipped if prior parsing produced aborting issues.

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)

#### Returns

`boolean`
