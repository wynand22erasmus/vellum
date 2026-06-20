# Variable: queryKeys

> `const` **queryKeys**: `object`

Defined in: [src/lib/queries/query-keys.ts:44](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/queries/query-keys.ts#L44)

Query key factory for list and admin queries.

## Type Declaration

### admin

> **admin**: `object`

#### admin.all

> **all**: readonly \[`"admin"`\]

#### admin.auditLogs

> **auditLogs**: (`params?`) => readonly \[`"admin"`, `"audit-logs"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"audit-logs"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.document

> **document**: (`id`) => readonly \[`"admin"`, `"document"`, `string`\]

##### Parameters

###### id

`string`

##### Returns

readonly \[`"admin"`, `"document"`, `string`\]

#### admin.documentFile

> **documentFile**: (`id`) => readonly \[`"admin"`, `"document-file"`, `string`\]

##### Parameters

###### id

`string`

##### Returns

readonly \[`"admin"`, `"document-file"`, `string`\]

#### admin.documentFiles

> **documentFiles**: (`params?`) => readonly \[`"admin"`, `"document-files"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"document-files"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.documents

> **documents**: (`params?`) => readonly \[`"admin"`, `"documents"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"documents"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.failedAuditLogs

> **failedAuditLogs**: (`params?`) => readonly \[`"admin"`, `"failed-audit-logs"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"failed-audit-logs"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.failedProcessErrors

> **failedProcessErrors**: (`params?`) => readonly \[`"admin"`, `"failed-process-errors"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"failed-process-errors"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

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

#### admin.processErrors

> **processErrors**: (`params?`) => readonly \[`"admin"`, `"process-errors"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"process-errors"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

#### admin.users

> **users**: (`params?`) => readonly \[`"admin"`, `"users"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

##### Parameters

###### params?

[`AdminListParams`](../type-aliases/AdminListParams.md)

##### Returns

readonly \[`"admin"`, `"users"`, [`AdminListParams`](../type-aliases/AdminListParams.md)\]

### documents

> **documents**: `object`

#### documents.all

> **all**: readonly \[`"documents"`\]

#### documents.list

> **list**: () => readonly \[`"documents"`, `"list"`\]

##### Returns

readonly \[`"documents"`, `"list"`\]
