import {createApp} from 'vue';
import App from '@/js/App.vue';
import {router} from '@/js/routes/routes';
import '@/css/index.css';
import {store} from "@/js/store/store";
import canvas from "@/js/helpers/canvas.js";
import '@/js/helpers/prototypes/array';

/**
 * Font awesome icons and library
 */
import {library} from '@fortawesome/fontawesome-svg-core'
import {faChevronRight, faCodeBranch} from "@fortawesome/free-solid-svg-icons";
import {faMoon, faSun} from "@fortawesome/free-regular-svg-icons";
import {faGithub} from "@fortawesome/free-brands-svg-icons";

library.add(faGithub, faCodeBranch, faChevronRight, faMoon, faSun);

/*
Run these commands when postcss supports vue 3
npm uninstall tailwindcss @tailwindcss/postcss7-compat
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
 */

const app = createApp(App)
  .use(router)
  .use(store);

/**
 * Mount canvas functions to be available globally
 */
app.config.globalProperties.$c = canvas;
app.mount('#app');

