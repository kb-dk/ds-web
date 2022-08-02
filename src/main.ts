/* Core */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

/* Stylesheets */
import './assets/styles/style.scss';

/* Third party */
import { createPinia } from 'pinia';
const pinia = createPinia();
createApp(App).use(router).use(pinia).mount('#app');
