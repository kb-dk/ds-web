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

	const getMonthQueryString = (months: string[]) => {
		let selectedMonths = '';
		if (months.length > 0) {
			selectedMonths = '&fq=temporal_start_month:(';
		}
		months.forEach((item, index) => {
			selectedMonths += `${item}`;
			if (index !== months.length - 1) {
				selectedMonths += ' OR ';
			}
		});
		if (months.length > 0) {
			selectedMonths += ')';
		}
		return selectedMonths;
	};

	const getDayQueryString = (days: string[]) => {
		let selectedDays = '';
		if (days.length > 0) {
			selectedDays = '&fq=temporal_start_day_da:(';
		}
		days.forEach((item, index) => {
			selectedDays += `"${item}"`;
			if (index !== days.length - 1) {
				selectedDays += ' OR ';
			}
		});
		if (days.length > 0) {
			selectedDays += ')';
		}
		return selectedDays;
	};

	const getTimeslotQueryString = (timeslots: string[]) => {
		let selectedDays = '';
		if (timeslots.length > 0) {
			selectedDays = '&fq=temporal_start_hour_da:(';
		}
		timeslots.forEach((item, index) => {
			selectedDays += `${item}`;
			if (index !== timeslots.length - 1) {
				selectedDays += ' OR ';
			}
		});
		if (timeslots.length > 0) {
			selectedDays += ')';
		}
		return selectedDays;
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
			const selectedMonths = getMonthQueryString(months);
			const selectedDays = getDayQueryString(days);
			const selectedTImeslots = getTimeslotQueryString(timeslots);

			searchFired.value = true;
			loading.value = true;
			const responseData = await APIService.getTimeSearchResults(
				start,
				end,
				selectedMonths,
				selectedDays,
				selectedTImeslots,
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
		numFound,
	};
});
