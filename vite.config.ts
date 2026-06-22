import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    target: 'esnext',
    sourcemap: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [vue()],
  optimizeDeps: {
    entries: ['src/**/*.{ts,vue}'],
  },
});
