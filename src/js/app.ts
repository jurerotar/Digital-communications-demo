import {createApp} from 'vue';
import {router} from '@/js/routes/routes';
import {store} from "@/js/store/store";
import canvas from "@/js/helpers/canvas.js";
import App from '@/js/App.vue';
import '@/js/helpers/prototypes/array';
import '@/js/helpers/prototypes/math';
import '@/css/index.css';
import {KatexOptions} from "katex";

// Register katex as a window property
declare global {
  interface Window {
    katex: KatexOptions;
  }
}

const app = createApp(App)
  .use(router)
  .use(store);

// TODO: Remove global properties
// Mount canvas functions to be available globally
app.config.globalProperties.$c = canvas;
app.mount('#app');

