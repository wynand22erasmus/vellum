# Function: revertDocumentLinkState()

> **revertDocumentLinkState**(`id`, `snapshot`): `Promise`\<`void`\>

Defined in: [src/lib/compensation/document.ts:43](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/compensation/document.ts#L43)

Restores link-related fields from a snapshot taken before mutation.

## Parameters

### id

`string`

DocumentUserLink primary key

### snapshot

[`DocumentLinkSnapshot`](../interfaces/DocumentLinkSnapshot.md)

Prior token, expiry, and used flag

## Returns

`Promise`\<`void`\>
