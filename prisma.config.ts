/**
 * Prisma CLI configuration (schema path, migrations, datasource URL).
 *
 * @packageDocumentation
 */

import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/** Prisma CLI project config (schema, migrations, `DATABASE_URL`). */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
