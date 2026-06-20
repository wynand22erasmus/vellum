# Variable: fileScrubWorker

> `const` **fileScrubWorker**: `Worker`\<`any`, `any`, `string`\>

Defined in: [src/server/workers/fileScrubWorker.ts:24](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/workers/fileScrubWorker.ts#L24)

Handles `cleanup-queue` jobs named `scrub-files`.

## Remarks

DB update before S3 delete; per-file compensation on failure.
