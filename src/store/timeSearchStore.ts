import { defineStore } from 'pinia';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { inject, ref } from 'vue';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { APIService } from '@/api/api-service';
import { AxiosError } from 'axios';
import { useI18n } from 'vue-i18n';
import { LocationQueryValue } from 'vue-router';
import { Priority, Severity } from '@/types/NotificationType';
import {
	days,
	endDate,
	endYear,
	months,
	startDate,
	startYear,
	timeslots,
} from '@/components/common/timeSearch/TimeSearchInitValues';
import { SelectorData } from '@/types/TimeSearchTypes';
import { resetAllSelectorValues } from '@/utils/time-search-utils';
import { normalizeFq } from '@/utils/filter-utils';

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
	const filterSearchReady = ref(true);

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

	const setFilterSearchReady = (val: boolean) => {
		filterSearchReady.value = val;
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

	const setFiltersFromUrl = (URLFilters: string[] | LocationQueryValue[] | string) => {
		resetAllSelectorValues(days.value);
		resetAllSelectorValues(months.value);
		resetAllSelectorValues(timeslots.value);

		const filters = normalizeFq(URLFilters as string[]);
		if (filters !== undefined) {
			if (filters instanceof Array) {
				filters.forEach((filter) => {
					if (typeof filter === 'string') {
						if (filter.includes('startTime')) {
							const splitYears = decodeURIComponent(filter)
								.replace('startTime:', '')
								.replace(/[[\]]/g, '')
								.split(' TO ');
							setYearTimes(splitYears[0], splitYears[1]);
						}
						if (filter.includes('temporal_start_day_da')) {
							const splitDays = decodeURIComponent(filter).split(':')[1].replace(/[()]/g, '').split(' OR ');
							setTimeFilter(days.value, splitDays);
						}
						if (filter.includes('temporal_start_month')) {
							const splitMonths = decodeURIComponent(filter).split(':')[1].replace(/[()]/g, '').split(' OR ');
							setTimeFilter(months.value, splitMonths);
						}
						if (filter.includes('temporal_start_hour_da')) {
							const splitTimes = decodeURIComponent(filter).split(':')[1].replace(/[()]/g, '').split(' OR ');
							setTimeFilter(timeslots.value, splitTimes);
						}
					}
				});
				const foundString = filters.find((str) => str?.includes('startTime'));
				if (!foundString) {
					const startHolder = new Date(startYear.value.getTime());
					const endHolder = new Date(endYear.value.getTime());
					startDate.value = startHolder;
					endDate.value = endHolder;
					setTimeFacetsOpen(false);
				} else {
					setTimeFacetsOpen(true);
				}
			}
			setNewSearchReqMet(false);
		}
	};

	const setYearTimes = (firstYear: string, lastYear: string) => {
		const facetStartDate = new Date(firstYear);
		const facetEndDate = new Date(lastYear);
		startDate.value = facetStartDate;
		endDate.value = facetEndDate;
	};

	const setTimeFilter = (TimeArray: SelectorData[], facetArray: string[]) => {
		facetArray.forEach((item: string) => {
			const val = TimeArray.find((obj: SelectorData) => obj.value === item) as SelectorData;
			if (val) {
				val.selected = true;
			}
		});
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
			errorManager.submitCustomError(
				'time-search-error',
				t('error.infoError.title'),
				t('error.infoError.timeMachine'),
				Severity.ERROR,
				false,
				Priority.MEDIUM,
			);
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
		setFiltersFromUrl,
		filterSearchReady,
		setFilterSearchReady,
	};
});
