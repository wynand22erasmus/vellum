/**
 * Development API server (Express only, no Vite UI).
 *
 * @packageDocumentation
 * @remarks Run via `npm run dev:api`. Default port 5173 (`PORT` env).
 * Use `npm run dev` for the Vite dev server (proxies `/api` here).
 */

import { createApp } from './app.ts';

const port = Number(process.env.PORT ?? 5173);
const host = '0.0.0.0';

const app = await createApp();

app.listen(port, host, () => {
  console.log(`Vellum API listening on http://${host}:${port}`);
});
