# Variable: queryKeys

> `const` **queryKeys**: `object`

Defined in: [src/lib/queries/query-keys.ts:41](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/queries/query-keys.ts#L41)

Query key factory for list and admin queries.

## Type Declaration

### admin

> **admin**: `object`

#### admin.all

> **all**: readonly \[`"admin"`\]

#### admin.AuditLog

> **AuditLog**: (`params?`) => readonly \[`"admin"`, `"AuditLog"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"AuditLog"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.Communication

> **Communication**: (`params?`) => readonly \[`"admin"`, `"Communication"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"Communication"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.CommunicationDetail

> **CommunicationDetail**: (`id`) => readonly \[`"admin"`, `"Communication"`, `string`\]

##### Parameters

###### id

`string`

##### Returns

readonly \[`"admin"`, `"Communication"`, `string`\]

#### admin.Document

> **Document**: (`params?`) => readonly \[`"admin"`, `"Document"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"Document"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.DocumentDetail

> **DocumentDetail**: (`id`) => readonly \[`"admin"`, `"Document"`, `string`\]

##### Parameters

###### id

`string`

##### Returns

readonly \[`"admin"`, `"Document"`, `string`\]

#### admin.File

> **File**: (`params?`) => readonly \[`"admin"`, `"File"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"File"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.FileDetail

> **FileDetail**: (`id`) => readonly \[`"admin"`, `"File"`, `string`\]

##### Parameters

###### id

`string`

##### Returns

readonly \[`"admin"`, `"File"`, `string`\]

#### admin.list

> **list**: (`endpoint`, `dataKey`, `params?`) => readonly \[`"admin"`, `"list"`, `string`, `string`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### endpoint

`string`

###### dataKey

`string`

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"list"`, `string`, `string`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.ProcessError

> **ProcessError**: (`params?`) => readonly \[`"admin"`, `"ProcessError"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"ProcessError"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.Recipient

> **Recipient**: (`params?`) => readonly \[`"admin"`, `"Recipient"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"Recipient"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.RecipientDetail

> **RecipientDetail**: (`id`) => readonly \[`"admin"`, `"Recipient"`, `string`\]

##### Parameters

###### id

`string`

##### Returns

readonly \[`"admin"`, `"Recipient"`, `string`\]

#### admin.User

> **User**: (`params?`) => readonly \[`"admin"`, `"User"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"User"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

### Document

> **Document**: `object`

#### Document.all

> **all**: readonly \[`"Document"`\]

#### Document.list

> **list**: () => readonly \[`"Document"`, `"list"`\]

##### Returns

readonly \[`"Document"`, `"list"`\]
