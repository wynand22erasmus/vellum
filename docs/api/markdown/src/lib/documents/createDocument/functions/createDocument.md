# Function: createDocument()

> **createDocument**(`input`): `Promise`\<\{ `batchId`: `string` \| `null`; `createdAt`: `Date`; `documentId`: `string`; `downloadCount`: `number`; `fileId`: `string`; `lastVerifiedAt`: `Date` \| `null`; `maxDownloads`: `number`; `passwordHash`: `string`; `recipientId`: `string`; `updatedAt`: `Date`; `verifySuccessCount`: `number`; \}\>

Defined in: src/lib/documents/createDocument.ts:24

Creates a document envelope with hashed password.

## Parameters

### input

[`CreateDocumentInput`](../type-aliases/CreateDocumentInput.md)

## Returns

`Promise`\<\{ `batchId`: `string` \| `null`; `createdAt`: `Date`; `documentId`: `string`; `downloadCount`: `number`; `fileId`: `string`; `lastVerifiedAt`: `Date` \| `null`; `maxDownloads`: `number`; `passwordHash`: `string`; `recipientId`: `string`; `updatedAt`: `Date`; `verifySuccessCount`: `number`; \}\>
