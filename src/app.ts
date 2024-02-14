import {createApp} from 'vue';
import {router} from '@routes/routes';
import {store} from "@stores/store";
import canvas from "@helpers/canvas.js";
import '@styles/index.css';
import 'katex/dist/katex.css';
import App from './App.vue';

const app = createApp(App)
  .use(router)
  .use(store);

// TODO: Remove global properties
// Mount canvas functions to be available globally
app.config.globalProperties.$c = canvas;
app.mount('#app');

