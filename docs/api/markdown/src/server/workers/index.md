# src/server/workers

Worker process entrypoint: registers BullMQ schedulers and loads all workers.

## Remarks

Run via `npm run worker`. Registers hourly file scrub and monthly record scrub cron jobs.
