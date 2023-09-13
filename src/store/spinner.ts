import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSpinnerStore = defineStore('SpinnerStore', () => {
	const spinner = ref(false);

	const toggleSpinner = (value: boolean) => {
		spinner.value = value;
	};

	return {
		spinner,
		toggleSpinner,
	};
});
