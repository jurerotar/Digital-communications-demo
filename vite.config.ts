import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
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
    alias: {
      vuex: fileURLToPath(
        new URL('./node_modules/vuex/dist/vuex.mjs', import.meta.url),
      ),
    },
    tsconfigPaths: true,
  },
  plugins: [tailwindcss(), vue()],
  optimizeDeps: {
    entries: ['src/**/*.{ts,vue}'],
  },
});
