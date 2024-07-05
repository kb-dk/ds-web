/* Core */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { provideErrorManager } from '@/components/global/error-handling/error-manager';
import { useAuthStore } from '@/store/authStore';

import '@/assets/fonts/iconfont/material-icons.css';

/* Third party */
import i18n from './i18n';
import { createPinia } from 'pinia';

const pinia = createPinia();

const app = createApp(App).use(router).use(pinia).use(i18n);

//Attach to error manager globally
provideErrorManager(app);

app.mount('#app');

const authStore = useAuthStore();
// Wrapped in anonymous async function to avoid top-level 'await' to support older browsers
(async () => {
	try {
		await authStore.authenticate();
	} catch (error) {
		//Fail silently - user messaged from store
	}
})();
