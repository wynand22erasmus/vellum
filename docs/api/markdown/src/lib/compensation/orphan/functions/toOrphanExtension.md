# Function: toOrphanExtension()

> **toOrphanExtension**(`resources`, `compensationAttempted?`, `compensationFailed?`): `Record`\<`string`, `unknown`\>

Defined in: [src/lib/compensation/orphan.ts:23](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/compensation/orphan.ts#L23)

Builds RFC 9457 extension members for orphaned resources.

## Parameters

### resources

[`OrphanedResource`](../type-aliases/OrphanedResource.md)[]

Resources that could not be cleaned up

### compensationAttempted?

`boolean` = `true`

Whether undo steps were attempted

### compensationFailed?

`boolean` = `true`

Whether any undo step failed

## Returns

`Record`\<`string`, `unknown`\>
