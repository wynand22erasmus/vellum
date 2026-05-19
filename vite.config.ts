import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const vellumHost = env.VELLUM_HOST?.trim();
  const allowedHosts = vellumHost
    ? [vellumHost, 'localhost', '127.0.0.1']
    : true;

  return {
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts,
  },
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
};
});
