import {createApp} from 'vue';
import App from './App.vue';
import {router} from './routes/routes.js';
import './css/index.css';
import store from "./store/store";
//import functions from "./plugins/functions";
import canvas from "./plugins/canvas";

/**
 * Returns a random element from an array
 * @returns {any}
 */
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
}

/**
 * Font awesome icons and library
 */
import {library} from '@fortawesome/fontawesome-svg-core'
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {faGithub} from "@fortawesome/free-brands-svg-icons";

library.add(faGithub, faChevronRight);

/*
Run these commands when postcss supports vue 3
npm uninstall tailwindcss @tailwindcss/postcss7-compat
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
 */

const app = createApp(App).use(router).use(store);

/**
 * Mount functions plugin to be available globally
 */
//app.config.globalProperties.$f = functions;

/**
 * Mount canvas functions to be available globally
 */
app.config.globalProperties.$c = canvas;
app.mount('#app');

