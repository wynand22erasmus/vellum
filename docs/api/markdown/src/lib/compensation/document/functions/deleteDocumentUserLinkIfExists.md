# Function: deleteDocumentUserLinkIfExists()

> **deleteDocumentUserLinkIfExists**(`id`): `Promise`\<`void`\>

Defined in: [src/lib/compensation/document.ts:21](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/compensation/document.ts#L21)

Deletes a recipient link row if it exists (idempotent).

## Parameters

### id

`string`

DocumentUserLink primary key (legacy "document id")

## Returns

`Promise`\<`void`\>
