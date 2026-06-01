#!/usr/bin/env node
/**
 * Start the local dev stack: Express API on :5173 and Vite UI on :5174.
 *
 * Invoked via `npm run dev:stack`. Spawns `dev:api` and `dev` concurrently and
 * forwards SIGINT/SIGTERM to both child processes.
 */
import { spawn } from 'node:child_process';

function run(script) {
  const child = spawn('npm', ['run', script], {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

run('dev:api');
run('dev');

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
