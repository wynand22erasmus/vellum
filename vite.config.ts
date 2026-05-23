import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { configureAdminerProxy } from './vite-adminer-proxy.ts';
import { configureMailpitProxy } from './vite-mailpit-proxy.ts';
import { configureMinioConsoleProxy } from './vite-minio-console-proxy.ts';

export default defineConfig(({ mode }) => {
  const repoRoot = import.meta.dirname;
  const env = loadEnv(mode, repoRoot, '');
  const vellumHost = env.VELLUM_HOST?.trim() || process.env.VELLUM_HOST?.trim();
  const allowedHosts = vellumHost
    ? [vellumHost, 'localhost', '127.0.0.1']
    : true;
  const apiTarget = process.env.VELLUM_API_URL ?? 'http://127.0.0.1:5173';
  const inCompose = apiTarget.includes('app:5173');
  const devHost = vellumHost ?? 'localhost';
  const mailpitTarget =
    process.env.DEV_PROXY_MAILPIT ?? (inCompose ? 'http://mailpit:8025' : `http://${devHost}:8025`);
  const minioConsoleTarget =
    process.env.DEV_PROXY_MINIO_CONSOLE ??
    (inCompose ? 'http://minio:9001' : `http://${devHost}:9001`);
  const prismaStudioTarget =
    process.env.DEV_PROXY_PRISMA_STUDIO ??
    (inCompose ? 'http://postgres:5555' : `http://${devHost}:5555`);
  const dbAdminTarget =
    process.env.DEV_PROXY_DB_ADMIN ??
    (inCompose ? 'http://postgres:8081' : `http://${devHost}:8081`);

  return {
    root: repoRoot,
    publicDir: path.resolve(repoRoot, 'public'),
    resolve: {
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
      alias: {
        '@': path.resolve(repoRoot, 'src'),
        react: path.resolve(repoRoot, 'node_modules/react'),
        'react-dom': path.resolve(repoRoot, 'node_modules/react-dom'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5174,
      strictPort: true,
      allowedHosts,
      fs: {
        allow: [repoRoot],
      },
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/docs': { target: apiTarget, changeOrigin: true },
        '/dev-proxy/mailpit': {
          target: mailpitTarget,
          changeOrigin: false,
          ws: true,
          selfHandleResponse: true,
          configure: configureMailpitProxy,
        },
        '/dev-proxy/minio-console': {
          target: minioConsoleTarget,
          changeOrigin: true,
          ws: true,
          selfHandleResponse: true,
          configure: configureMinioConsoleProxy,
          rewrite: (p) => p.replace(/^\/dev-proxy\/minio-console/, '') || '/',
        },
        '/dev-proxy/prisma-studio': {
          target: prismaStudioTarget,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-proxy\/prisma-studio/, '') || '/',
        },
        '/dev-proxy/db-admin': {
          target: dbAdminTarget,
          changeOrigin: true,
          selfHandleResponse: true,
          configure: configureAdminerProxy,
          rewrite: (p) => p.replace(/^\/dev-proxy\/db-admin/, '') || '/',
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
  };
});
