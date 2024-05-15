import { defineStore } from 'pinia';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { inject, ref } from 'vue';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { APIService } from '@/api/api-service';
import { AxiosError } from 'axios';
import { useI18n } from 'vue-i18n';

export const useTimeSearchStore = defineStore('timeSearchStore', () => {
	const loading = ref(false);
	const timeResults = ref([] as Array<GenericSearchResultType>);
	let currentSearchUUID = '';
	let comparisonSearchUUID = '';
	const searchFired = ref(false);
	const numFound = ref(0);
	const noHits = ref(false);
	const errorManager = inject('errorManager') as ErrorManagerType;
	const error = ref('');
	const { t } = useI18n();
	const dir = ref('sort=score%2520desc');

	const sortFunction = (a: GenericSearchResultType, b: GenericSearchResultType) => {
		const dateA = new Date(a.startTime).getTime();
		const dateB = new Date(b.startTime).getTime();
		return dateA > dateB ? 1 : -1;
	};

	const setLoading = (value: boolean) => {
		loading.value = value;
	};
	const responseMatchesCurrentSearch = (uuid: string): boolean => {
		return uuid === currentSearchUUID;
	};

	const getTimeSearchResults = async (start: string, end: string) => {
		//https://stackoverflow.com/a/62359248
		//to get a _GOOD_ uuid, we use the functionality from the createObjectURL method, that creates one, and just get that one.

		const url = URL.createObjectURL(new Blob());
		currentSearchUUID = url.toString().split('/').reverse()[0];
		URL.revokeObjectURL(url);

		try {
			if (dir.value === 'sort=score desc') {
				dir.value = 'sort=score asc';
			} else {
				dir.value = 'sort=score desc';
			}

			searchFired.value = true;
			loading.value = true;
			const responseData = await APIService.getTimeSearchResults(start, end, dir.value, currentSearchUUID);

			comparisonSearchUUID = responseData.data.responseHeader.params.queryUUID || '';

			if (responseMatchesCurrentSearch(comparisonSearchUUID) && searchFired.value) {
				timeResults.value = responseData.data.response.docs;
				timeResults.value.sort(sortFunction);
				numFound.value = responseData.data.response.numFound;
				noHits.value = numFound.value === 0;
			}
		} catch (err: unknown) {
			error.value = (err as AxiosError).message;
			errorManager.submitError(err as AxiosError, t('error.searchfailed'));
		} finally {
			if (responseMatchesCurrentSearch(comparisonSearchUUID)) {
				loading.value = false;
				//window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	};

	return {
		loading,
		timeResults,
		setLoading,
		getTimeSearchResults,
	};
});
