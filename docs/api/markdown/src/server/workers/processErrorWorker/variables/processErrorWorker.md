# Variable: processErrorWorker

> `const` **processErrorWorker**: `Worker`\<`any`, `any`, `string`\>

Defined in: [src/server/workers/processErrorWorker.ts:20](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/workers/processErrorWorker.ts#L20)

Consumes `persist-process-error` jobs and inserts `ProcessError` rows.
