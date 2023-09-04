/* Core */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/fonts/iconfont/material-icons.css';

/* Third party */
import i18n from './i18n';
import { createPinia } from 'pinia';
const pinia = createPinia();

createApp(App).use(router).use(pinia).use(i18n).mount('#app');
