/**
 * Regenerates docs/doc-inventory.json via doc-coverage (no threshold failure).
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coverageScript = path.join(__dirname, 'doc-coverage.mjs');

const result = spawnSync(process.execPath, [coverageScript], {
  env: { ...process.env, DOCS_COVERAGE_MIN: '0' },
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
