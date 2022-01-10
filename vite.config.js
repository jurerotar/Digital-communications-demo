import vue from '@vitejs/plugin-vue';
import path from "path";
import {defineConfig} from "vite";
import html from 'vite-plugin-html';
import visualizer from "rollup-plugin-visualizer";

const baseUrl = (command, mode) => {
  if(command === 'build' && mode === 'prod') {
    return 'https://digital-communications-demo.netlify.app';
  }
  else if(command === 'build' && mode === 'dev') {
    return 'http://localhost:5000';
  }
  return 'http://localhost:3000';
}

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const base = baseUrl(command, mode);

  return {
    base: '/',
    publicDir: 'public',
    build: {
      manifest: true,
      outDir: 'dist',
      target: 'esnext',
      sourcemap: false,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          scripts: path.resolve(__dirname, 'src/js/app.ts')
        },
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        }
      }
    },
    resolve: {
      alias: [
        {
          find: '@', replacement: path.resolve('src')
        },
      ]
    },
    plugins: [
      vue(),
      visualizer({
        filename: './analyzer/bundle-analyzer.html',
        open: false,
        template: 'treemap', //sunburst, treemap, network.
        json: false,
        gzipSize: true,
        brotliSize: true,
      }),
      html({
        inject: {
          data: command === 'serve' ?
            {
              injectScripts: `
            <script type="module" src="${base}/@vite/client"></script>
            <script type="module" src="${base}/src/js/app.ts"></script>
            `
            } :
            {
              injectScripts: `
              <link rel="stylesheet" href="${base}/assets/scripts.css" />
              <script type="module" src="${base}/assets/scripts.js"></script>
            `
            }
        },
        minify: false
      }),
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
      ]
    }
  }
});
