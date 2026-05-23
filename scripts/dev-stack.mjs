#!/usr/bin/env node
/** Local dev: API (5173) + Vite (5174). */
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
