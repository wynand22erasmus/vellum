# Variable: cleanupQueue

> `const` **cleanupQueue**: `Queue`\<`any`, `any`, `string`, `any`, `any`, `string`\>

Defined in: [src/server/queues/cleanupQueue.ts:14](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/cleanupQueue.ts#L14)

BullMQ queue name: `cleanup-queue`.
Scheduled jobs: `purge-files` (hourly), `purge-records` (monthly).
