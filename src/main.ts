/* Core */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { provideErrorManager } from './error-handling/error-manager';

import './assets/global-styles.css';

import './assets/fonts/iconfont/material-icons.css';

/* Third party */
import i18n from './i18n';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App).use(router).use(pinia).use(i18n);

//Attach to error manager globally
provideErrorManager(app);
app.mount('#app');
