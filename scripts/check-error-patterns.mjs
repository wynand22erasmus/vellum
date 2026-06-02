#!/usr/bin/env node
/**
 * CI gate: fail if forbidden inline error JSON patterns remain in src/.
 */
import { execSync } from 'node:child_process';

const checks = [
  {
    name: 'res.status().json({ error })',
    pattern: String.raw`json\(\s*\{\s*error`,
    path: 'src',
  },
  {
    name: 'frontend data.error',
    pattern: String.raw`data\.error`,
    path: 'src/pages',
  },
];

let failed = false;

for (const check of checks) {
  try {
    execSync(`rg -n "${check.pattern}" ${check.path}`, { stdio: 'pipe' });
    console.error(`[check-error-patterns] Forbidden pattern (${check.name}) found in ${check.path}/`);
    failed = true;
  } catch {
    // rg exits 1 when no matches — expected
  }
}

if (failed) {
  process.exit(1);
}

console.log('[check-error-patterns] OK');
