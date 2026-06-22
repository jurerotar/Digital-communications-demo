import canvas from '@helpers/canvas';
import { router } from '@routes/routes';
import { pinia } from '@stores/store';
import { createApp } from 'vue';
import '@styles/index.css';
import App from './App.vue';

const app = createApp(App).use(router).use(pinia);

// TODO: Remove global properties
// Mount canvas functions to be available globally
app.config.globalProperties.$c = canvas;
app.mount('#app');
