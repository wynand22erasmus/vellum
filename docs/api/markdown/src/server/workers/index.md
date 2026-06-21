# src/server/workers

Worker process entrypoint: registers BullMQ schedulers and loads all workers.

## Remarks

Run via `npm run worker`. Registers hourly file purge and monthly record purge cron jobs.
