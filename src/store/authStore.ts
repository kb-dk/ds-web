import { defineStore } from 'pinia';
import { APIService } from '@/api/api-service';
import { ErrorManagerType } from '@/types/ErrorManagerType';
//Had to use the global t function as a work-around here - see comment below
import i18n from '../i18n';
import { inject, ref } from 'vue';

export const useAuthStore = defineStore('authStore', () => {
	const errorManager = inject('errorManager') as ErrorManagerType;
	/* Had to use the global t function as a work-around here. The reaseon is to
	 * avoid "message-compiler Must be called at the top of a `setup` function" error
	 * which comes from importing import { useI18n } from "vue-i18n" and calling
	 * const { t } = useI18n() so early in the app setup flow.
	 * It works all other places as they are called/initiated later in the app flow
	 **/
	const { t } = i18n.global;

	//Session time (in millis) - currently 36 hours
	const sessionTime = 129600000;

	/** Buffer time between session expire and refresh time (in millis) - currently the
	 *  refresh will run 15 minutes before session espires
	 */
	const refreshSessionBufferTime = 900000;

	let refreshTimeout: ReturnType<typeof setTimeout>;
	const isAuthenticating = ref(false); // Lock to prevent multiple authentication calls

	const authenticate = async () => {
		// Check if authentication is already in progress (omitted the if brackets on purpose here:) )
		if (isAuthenticating.value) return;

		// set flag (and lock) for indicating 'authentication' is in progress
		isAuthenticating.value = true;

		try {
			await APIService.authenticate();
			startRefreshSessionTimer();
		} catch (error) {
			errorManager.submitCustomError('auth-error', t('error.auth.serviceFailed'));
		} finally {
			isAuthenticating.value = false; // Release the authentication lock/flag in all cases
		}
	};

	const refreshSession = async () => {
		//Call authenticate to refresh but later this will be a dedicated refresh method with real OAUTH2 refresh token magic
		authenticate();
	};

	const startRefreshSessionTimer = () => {
		// Refresh before session expiration according to the refresh session buffer time so the user hopefully is not disturbed
		const timeout = sessionTime - refreshSessionBufferTime;
		// Clear any timeout already running
		clearTimeout(refreshTimeout);
		refreshTimeout = setTimeout(refreshSession, timeout);
	};

	return {
		authenticate,
		isAuthenticating,
	};
});
