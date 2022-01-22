import vue from '@vitejs/plugin-vue';
import path from "path";
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
      {find: '@', replacement: path.resolve('src')},
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
    ],
  }
});
