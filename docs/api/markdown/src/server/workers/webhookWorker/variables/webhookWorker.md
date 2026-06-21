# Variable: webhookWorker

> `const` **webhookWorker**: `Worker`\<`any`, `any`, `string`\>

Defined in: [src/server/workers/webhookWorker.ts:36](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/workers/webhookWorker.ts#L36)

Consumes `deliver-webhook` jobs: POST signed JSON to the configured target URL.
