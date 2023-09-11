import { defineStore } from 'pinia';

export const useSpinnerStore = defineStore({
	id: 'SpinnerStore',
	state: () => ({
		spinner: false,
	}),

	getters: {},

	actions: {
		toggleSpinner(value: boolean) {
			this.spinner = value;
		},
	},
});
