# Function: revokeDocument()

> **revokeDocument**(`options`): `Promise`\<`void`\>

Defined in: src/lib/revoke-document.ts:22

Revokes a recipient link. Shared S3 objects are not deleted (other links may reference them).

## Parameters

### options

[`RevokeDocumentOptions`](../type-aliases/RevokeDocumentOptions.md)

## Returns

`Promise`\<`void`\>
