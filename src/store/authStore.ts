import { defineStore } from 'pinia';
import { APIService } from '@/api/api-service';
import { ErrorManagerType } from '@/types/ErrorManagerType';
//Had to use the global t function as a work-around here - see comment below
import i18n from '../i18n';
import { inject } from 'vue';

export const useAuthStore = defineStore('authStore', () => {
	const errorManager = inject('errorManager') as ErrorManagerType;
	/*Had to use the global t function as a work-around here. The reaseon is to
	 * avoid "message-compiler Must be called at the top of a `setup` function" error
	 * which comes from importing import { useI18n } from "vue-i18n" and calling
	 * const { t } = useI18n() so early in the app setup flow.
	 * It works all other places as they are called/initiated later in the app flow
	 **/
	const { t } = i18n.global;

	//Session time (in millis)
	const sessionTime = 900000;

	//Buffer time between session expire and refresh time (in millis)
	const refreshSessionBufferTime = 60 * 1000;

	let refreshTimeout: ReturnType<typeof setTimeout>;

	const authenticate = async () => {
		try {
			await APIService.authenticate();
			startRefreshSessionTimer();
		} catch (error) {
			errorManager.submitCustomError('auth-error', t('error.auth.serviceFailed'));
			//Retry according to refresh session buffer (could actually be any value one sees fit)
			setTimeout(refreshSession, refreshSessionBufferTime);
		}
	};

	const refreshSession = async () => {
		//Call authenticate to refresh but later this will be a dedicated refresh method
		authenticate();
	};

	const startRefreshSessionTimer = () => {
		// Refresh before session expiration according to the refresh session buffer time
		const timeout = sessionTime - refreshSessionBufferTime;
		// Clear any timeout already running
		clearTimeout(refreshTimeout);
		refreshTimeout = setTimeout(refreshSession, timeout);
	};

	return {
		authenticate,
	};
});
