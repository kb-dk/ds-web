/* Core */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

/* Stylesheets */
import './assets/styles/style.scss';

/* Javscript */
import './assets/js/slick.js';
import './assets/js/choices.js';
import './assets/js/popper.js';
import './assets/js/bootstrap.js';
import './assets/js/jquery.dataTables.js';
import './assets/js/app.js';

/* Third party */
import { createPinia } from 'pinia';
const pinia = createPinia();
createApp(App).use(router).use(pinia).mount('#app');
