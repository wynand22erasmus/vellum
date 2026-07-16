# Variable: processErrorWorker

> `const` **processErrorWorker**: `Worker`\<`any`, `any`, `string`\>

Defined in: [src/server/workers/processErrorWorker.ts:22](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/workers/processErrorWorker.ts#L22)

Consumes `persist-process-error` jobs and inserts `ProcessError` rows.
