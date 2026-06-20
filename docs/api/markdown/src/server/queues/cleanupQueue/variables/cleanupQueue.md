# Variable: cleanupQueue

> `const` **cleanupQueue**: `Queue`\<`any`, `any`, `string`, `any`, `any`, `string`\>

Defined in: [src/server/queues/cleanupQueue.ts:14](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/cleanupQueue.ts#L14)

BullMQ queue name: `cleanup-queue`.
Scheduled jobs: `scrub-files` (hourly), `scrub-records` (monthly).
