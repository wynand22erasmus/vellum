# Class: CompensationStack

Defined in: [src/lib/compensation/compensation-stack.ts:20](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/compensation/compensation-stack.ts#L20)

Registers undo steps and runs them in reverse order when `main` throws.

## Constructors

### Constructor

> **new CompensationStack**(): `CompensationStack`

#### Returns

`CompensationStack`

## Methods

### registerUndo()

> **registerUndo**(`label`, `fn`, `orphanOnFail?`): `void`

Defined in: [src/lib/compensation/compensation-stack.ts:30](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/compensation/compensation-stack.ts#L30)

Registers an undo step executed LIFO if a later step fails.

#### Parameters

##### label

`string`

Human-readable step name for logs

##### fn

() => `Promise`\<`void`\>

Idempotent cleanup function

##### orphanOnFail?

() => [`OrphanedResource`](../../orphan/type-aliases/OrphanedResource.md) \| [`OrphanedResource`](../../orphan/type-aliases/OrphanedResource.md)[]

Resource descriptor if undo fails

#### Returns

`void`

***

### run()

> **run**\<`T`\>(`main`): `Promise`\<`T`\>

Defined in: [src/lib/compensation/compensation-stack.ts:43](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/compensation/compensation-stack.ts#L43)

Runs `main`; on failure executes registered undos and rethrows or wraps orphans.

#### Type Parameters

##### T

`T`

#### Parameters

##### main

() => `Promise`\<`T`\>

Primary mutation sequence

#### Returns

`Promise`\<`T`\>
