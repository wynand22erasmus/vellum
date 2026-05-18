/**
 * Development server: Express API + Vite middleware on a single port.
 *
 * @packageDocumentation
 * @remarks Run via `npm run dev`. Default port 5173 (`PORT` env).
 */

import { createServer as createViteServer } from 'vite';
import { createApp } from './app.ts';

const port = Number(process.env.PORT ?? 5173);
const host = '0.0.0.0';

const app = await createApp();

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

app.use(vite.middlewares);

app.listen(port, host, () => {
  console.log(`Vellum dev server listening on http://${host}:${port}`);
});
