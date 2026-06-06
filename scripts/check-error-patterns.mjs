#!/usr/bin/env node
/**
 * CI gate: fail if forbidden inline error JSON patterns remain in src/.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/\/$/, '');

const checks = [
  {
    name: 'res.status().json({ error })',
    pattern: /json\(\s*\{\s*error/,
    roots: ['src'],
  },
  {
    name: 'bare res.json() in routes (except studio.ts)',
    pattern: /res\.json\(/,
    roots: ['src/server/routes'],
    exclude: (rel) => rel.endsWith('studio.ts'),
  },
  {
    name: "raw fetch('/api/') outside allowlist",
    pattern: /fetch\(\s*['`]\/api\//,
    roots: ['src'],
    allowlist: new Set([
      'src/lib/api.ts',
      'src/lib/api-client.ts',
      'src/server/routes/studio.ts',
    ]),
  },
  {
    name: 'legacy ui/uiv3 import path',
    pattern: /ui\/uiv3/,
    roots: ['src'],
  },
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist') continue;
      walk(path, files);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) {
      files.push(path);
    }
  }
  return files;
}

let failed = false;

for (const check of checks) {
  const matches = [];
  for (const rootDir of check.roots) {
    const absRoot = join(root, rootDir);
    for (const file of walk(absRoot)) {
      const rel = relative(join(root), file).replace(/\\/g, '/');
      if (check.exclude?.(rel)) continue;
      if (check.allowlist?.has(rel)) continue;
      const content = readFileSync(file, 'utf8');
      if (check.pattern.test(content)) {
        matches.push(rel);
      }
    }
  }
  if (matches.length > 0) {
    console.error(
      `[check-error-patterns] Forbidden pattern (${check.name}) found:\n${matches.join('\n')}`,
    );
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('[check-error-patterns] OK');
