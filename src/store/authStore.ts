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
	 * It works all other places as the are called/initiated later in the app flow
	 **/
	const { t } = i18n.global;
	const authenticate = async () => {
		try {
			await APIService.authenticate();
		} catch (error) {
			console.error('Error authenticating:', error);
			errorManager.submitCustomError('auth-error', t('error.auto.serviceFailed'));
		}
	};

	return {
		authenticate,
	};
});
