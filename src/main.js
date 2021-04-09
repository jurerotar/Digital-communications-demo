import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/routes.js';
import './css/index.css';
import functions from "./plugins/functions";


/*
Run these commands when postcss supports vue 3
npm uninstall tailwindcss @tailwindcss/postcss7-compat
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
 */

const app = createApp(App).use(router);

/**
 * Mount functions plugin to be available globally
 */
app.config.globalProperties.$f = functions;
app.mount('#app');
