import { createApp } from './app.ts';
import { env } from './lib/env.ts';

const app = await createApp();

app.listen(env.port, '0.0.0.0', () => {
  console.log(`Vellum API listening on port ${env.port}`);
});
