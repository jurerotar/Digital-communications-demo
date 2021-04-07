import {createApp} from 'vue';
import App from './App.vue';
import './css/index.css';


/*
Run these commands when postcss supports vue 3
npm uninstall tailwindcss @tailwindcss/postcss7-compat
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
 */

createApp(App).mount('#app');
