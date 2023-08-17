/* Core */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/fonts/iconfont/material-icons.css';

/* Third party */
import { createPinia } from 'pinia';
const pinia = createPinia();
createApp(App).use(router).use(pinia).mount('#app');
