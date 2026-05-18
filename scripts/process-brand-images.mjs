import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const assetsDir = join(__dirname, '..', '..', '..', 'home', 'devman', '.cursor', 'projects', 'apps-vellum', 'assets');

/** Remove near-white pixels; soften edges for anti-aliasing. */
function removeWhiteBackground(buffer) {
  const data = Buffer.from(buffer);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lightness = (r + g + b) / 3;

    if (lightness >= 248 && max - min < 12) {
      data[i + 3] = 0;
      continue;
    }

    if (lightness >= 225) {
      const t = Math.min(1, (lightness - 225) / 28);
      data[i + 3] = Math.round(data[i + 3] * (1 - t));
    }
  }
  return data;
}

async function processImage(inputPath, outputPath, resize) {
  let pipeline = sharp(inputPath).ensureAlpha();
  if (resize) {
    pipeline = pipeline.resize(resize, resize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }

  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  const transparent = removeWhiteBackground(data);

  await sharp(transparent, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Wrote ${outputPath} (${info.width}x${info.height})`);
}

const logoSrc =
  process.env.LOGO_SRC ??
  join(publicDir, 'logo.png');
const markSrc =
  process.env.MARK_SRC ??
  join(publicDir, 'favicon.png');

await processImage(logoSrc, join(publicDir, 'logo.png'), 640);
await processImage(markSrc, join(publicDir, 'favicon.png'), 512);
await processImage(markSrc, join(publicDir, 'favicon-32.png'), 32);
await processImage(markSrc, join(publicDir, 'apple-touch-icon.png'), 180);

console.log('Done.');
