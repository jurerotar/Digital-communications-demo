import vue from '@vitejs/plugin-vue';
import path from "node:path";
import {defineConfig} from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  publicDir: 'public',
  build: {
    manifest: true,
    outDir: 'dist',
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    }
  },
  resolve: {
    alias: [
      {find: '@styles', replacement: path.resolve('./src/styles')},
      {find: '@app', replacement: path.resolve('./src/app')},
      {find: '@components', replacement: path.resolve('./src/components')},
      {find: '@helpers', replacement: path.resolve('./src/helpers')},
      {find: '@layouts', replacement: path.resolve('./src/layouts')},
      {find: '@routes', replacement: path.resolve('./src/routes')},
      {find: '@stores', replacement: path.resolve('./src/stores')},
      {find: '@interfaces', replacement: path.resolve('./src/interfaces')},
      {find: '@composables', replacement: path.resolve('./src/composables')},
    ]
  },
  plugins: [
    vue(),
  ],
  optimizeDeps: {
    include: [
      'vue',
      'vuex',
      'vue-router',
      'fft.js',
      'p5',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-brands-svg-icons',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/free-regular-svg-icons',
      '@fortawesome/vue-fontawesome',
      'katex',
      "Complex",
      'window-function'
    ],
  }
});
