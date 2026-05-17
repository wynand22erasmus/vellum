import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig(({ command }) => ({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    ...(command === 'serve'
      ? VitePluginNode({
          adapter: 'express',
          appPath: './src/server.ts',
          exportName: 'viteNodeApp',
          reloadAppOnFileChange: true,
        })
      : []),
  ],
}));
