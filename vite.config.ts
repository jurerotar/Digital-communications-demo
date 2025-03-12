import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          p5: ['p5'],
          katex: ['katex'],
        },
      },
    },
  },
  resolve: {
    alias: [
      { find: '@styles', replacement: path.resolve('./src/styles') },
      { find: '@app', replacement: path.resolve('./src/app') },
      { find: '@components', replacement: path.resolve('./src/components') },
      { find: '@helpers', replacement: path.resolve('./src/helpers') },
      { find: '@layouts', replacement: path.resolve('./src/layouts') },
      { find: '@routes', replacement: path.resolve('./src/routes') },
      { find: '@stores', replacement: path.resolve('./src/stores') },
      { find: '@interfaces', replacement: path.resolve('./src/interfaces') },
      { find: '@composables', replacement: path.resolve('./src/composables') },
    ],
  },
  plugins: [vue()],
  optimizeDeps: {
    entries: ['src/**/*.{ts,vue}'],
  },
});
