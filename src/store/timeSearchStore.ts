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
	const newSearchReqMet = ref(false);
	const timeFacetsOpen = ref(false);

	const sortFunction = (a: GenericSearchResultType, b: GenericSearchResultType) => {
		const dateA = new Date(a.startTime).getTime();
		const dateB = new Date(b.startTime).getTime();
		return dateA > dateB ? 1 : -1;
	};

	const setTimeFacetsOpen = (val: boolean) => {
		timeFacetsOpen.value = val;
	};

	const setNewSearchReqMet = (val: boolean) => {
		newSearchReqMet.value = val;
	};

	const setLoading = (value: boolean) => {
		loading.value = value;
	};
	const responseMatchesCurrentSearch = (uuid: string): boolean => {
		return uuid === currentSearchUUID;
	};

	const getQueryStringFromArray = (array: string[], prefix: string) => {
		let selected = '';
		if (array.length > 0) {
			selected = prefix;
		}
		array.forEach((item, index) => {
			selected += encodeURIComponent(`${item}`);
			if (index !== array.length - 1) {
				selected += ' OR ';
			}
		});
		if (array.length > 0) {
			selected += ')';
		}
		return selected;
	};

	const getTimeSearchResults = async (
		start: string,
		end: string,
		months: string[],
		days: string[],
		timeslots: string[],
	) => {
		//https://stackoverflow.com/a/62359248
		//to get a _GOOD_ uuid, we use the functionality from the createObjectURL method, that creates one, and just get that one.

		const url = URL.createObjectURL(new Blob());
		currentSearchUUID = url.toString().split('/').reverse()[0];
		URL.revokeObjectURL(url);

		try {
			const selectedMonths = getQueryStringFromArray(months, '&fq=temporal_start_month:(');
			const selectedDays = getQueryStringFromArray(days, '&fq=temporal_start_day_da:(');
			const selectedTimeslots = getQueryStringFromArray(timeslots, '&fq=temporal_start_hour_da:(');

			searchFired.value = true;
			loading.value = true;
			const responseData = await APIService.getTimeSearchResults(
				start,
				end,
				selectedMonths,
				selectedDays,
				selectedTimeslots,
				currentSearchUUID,
			);

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
			loading.value = false;
		} finally {
			loading.value = false;
		}
	};

	return {
		loading,
		timeResults,
		setLoading,
		getTimeSearchResults,
		numFound,
		newSearchReqMet,
		setNewSearchReqMet,
		timeFacetsOpen,
		setTimeFacetsOpen,
	};
});
