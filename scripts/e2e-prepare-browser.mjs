#!/usr/bin/env node
/**
 * Downloads Puppeteer Chrome into `.cache/puppeteer` and ensures the binary is extracted.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const cacheDir = path.resolve('.cache/puppeteer');
process.env.PUPPETEER_CACHE_DIR = cacheDir;

execSync('npx puppeteer browsers install chrome', {
  stdio: 'inherit',
  env: process.env,
});

const chromeDir = path.join(cacheDir, 'chrome');
const versionDir = fs.readdirSync(chromeDir).find((entry) => entry.startsWith('linux-'));
if (!versionDir) {
  throw new Error(`[test:e2e:prepare] No Chrome version directory under ${chromeDir}`);
}

const binaryPath = path.join(chromeDir, versionDir, 'chrome-linux64', 'chrome');
if (fs.existsSync(binaryPath)) {
  console.log(`[test:e2e:prepare] OK ${binaryPath}`);
  process.exit(0);
}

const zipName = fs
  .readdirSync(chromeDir)
  .find((entry) => entry.endsWith('-chrome-linux64.zip'));
if (!zipName) {
  throw new Error(`[test:e2e:prepare] Chrome zip missing under ${chromeDir}`);
}

console.log(`[test:e2e:prepare] Extracting ${zipName}…`);
execSync(`unzip -qo "${path.join(chromeDir, zipName)}" -d "${path.join(chromeDir, versionDir)}"`, {
  stdio: 'inherit',
});

if (!fs.existsSync(binaryPath)) {
  throw new Error(`[test:e2e:prepare] Chrome binary still missing at ${binaryPath}`);
}

console.log(`[test:e2e:prepare] OK ${binaryPath}`);
