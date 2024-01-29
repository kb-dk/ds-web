import { defineStore } from 'pinia';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { APIService } from '@/api/api-service';
import { useSpinnerStore } from '@/store/spinnerStore';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { AxiosError } from 'axios';
import { inject, ref, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { FacetResultType } from '@/types/GenericSearchResultTypes';
import { LocationQueryValue } from 'vue-router';
import { SearchValidationType } from '@/types/SearchValidationType';

export const useSearchResultStore = defineStore('searchResults', () => {
	const currentSearchValue = ref({} as SearchValidationType);
	const comparisonValues = ref({} as SearchValidationType);
	const searchResult = ref([] as Array<GenericSearchResultType>);
	const facetResult = ref(Object as unknown as FacetResultType);
	const errorManager = inject('errorManager') as ErrorManagerType;
	const searchFired = ref(false);
	const { t } = useI18n();
	const numFound = ref(0);
	const loading = ref(false);
	const start = ref('');
	const sort = ref('');
	const error = ref('');
	const currentQuery = ref('');
	const noHits = ref(false);
	const filters = ref([] as Array<string>);
	const spinnerStore = useSpinnerStore();

	const addFilter = (filter: string) => {
		if (!filters.value.includes(filter)) {
			filters.value.push(filter);
		}
	};

	const setFiltersFromURL = (URLFilters: string[] | LocationQueryValue[] | string) => {
		filters.value = [];
		if (URLFilters !== undefined) {
			if (URLFilters instanceof Array) {
				URLFilters.forEach((filter) => {
					filter !== '' ? filters.value.push(`fq=${filter}`) : null;
				});
			} else {
				URLFilters !== '' ? filters.value.push(`fq=${URLFilters}`) : null;
			}
		}
	};
	const setStartFromURL = (URLStart: string | undefined) => {
		if (URLStart) {
			//Check if url param string is actually some kind of numeric value
			if (!Number.isNaN(Number(URLStart))) {
				start.value = URLStart === '0' ? '' : URLStart;
			}
		}
	};

	const setSortFromURL = (URLSort: string | undefined) => {
		if (URLSort) {
			sort.value = URLSort;
		} else {
			sort.value = '';
		}
	};

	const resetStart = () => {
		start.value = '0';
	};

	const resetSort = () => {
		sort.value = '';
	};

	const setSortValue = (value: string) => {
		sort.value = value;
	};

	const resetSearch = () => {
		resetFilters();
		resetResults();
		resetStart();
		resetSort();
		currentQuery.value = '';
		searchFired.value = false;
	};

	const resetResults = () => {
		searchResult.value = [];
	};

	const resetFilters = () => {
		filters.value = [];
		facetResult.value = {} as FacetResultType;
	};

	const removeFilter = (filter: string) => {
		filters.value.splice(filters.value.indexOf(filter), 1);
	};

	const validateCurrentSearch = (args: SearchValidationType): boolean => {
		return JSON.stringify(args) === JSON.stringify(currentSearchValue.value);
	};

	const getSearchResults = async (query: string) => {
		let searchFilters = '';
		if (filters.value.length > 0) {
			filters.value.forEach((filt: string) => {
				searchFilters += `&${filt}`;
			});
		}
		const startParam = start.value === '' ? '' : `&start=${start.value}`;
		const sortParam = sort.value === '' ? '' : `&sort=${sort.value}`;

		const filtarr = [] as string[];

		filters.value.forEach((i) => {
			filtarr.push(decodeURIComponent(i).replace('fq=', ''));
		});

		currentSearchValue.value.q = query;
		currentSearchValue.value.fq = [...filtarr];
		currentSearchValue.value.start = start.value || '0';
		currentSearchValue.value.sort = decodeURI(sort.value) || undefined;

		try {
			searchFired.value = true;
			console.log('Querying Solr with query', query, 'and filters', searchFilters, start.value, sort.value);
			spinnerStore.toggleSpinner(true);
			loading.value = true;
			const responseData = await APIService.getSearchResults(
				query,
				searchFilters,
				startParam as string,
				sortParam as string,
			);
			const facetData = await APIService.getFacetResults(
				query,
				searchFilters,
				startParam as string,
				sortParam as string,
			);

			comparisonValues.value.q = responseData.data.responseHeader.params.q || undefined;
			comparisonValues.value.fq = Array.isArray(responseData.data.responseHeader.params.fq)
				? toRaw(responseData.data.responseHeader.params.fq.slice(0, -1))
				: toRaw([]) || undefined;
			comparisonValues.value.start = responseData.data.responseHeader.params.start || undefined;
			comparisonValues.value.sort = responseData.data.responseHeader.params.sort || undefined;

			if (validateCurrentSearch(comparisonValues.value)) {
				currentQuery.value = query;
				searchResult.value = responseData.data.response.docs;
				facetResult.value = facetData.data.facet_counts.facet_fields as FacetResultType;
				numFound.value = responseData.data.response.numFound;
				noHits.value = numFound.value === 0;
			}
		} catch (err: unknown) {
			error.value = (err as AxiosError).message;
			errorManager.submitError(err as AxiosError, t('error.searchfailed'));
		} finally {
			if (validateCurrentSearch(comparisonValues.value)) {
				//console.log('Current search finished, we remove spinner.');
				spinnerStore.toggleSpinner(false);
				loading.value = false;
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	};

	return {
		searchResult,
		facetResult,
		errorManager,
		numFound,
		loading,
		error,
		currentQuery,
		noHits,
		filters,
		searchFired,
		start,
		sort,
		addFilter,
		resetFilters,
		removeFilter,
		getSearchResults,
		resetSearch,
		setFiltersFromURL,
		setStartFromURL,
		resetStart,
		setSortFromURL,
		resetSort,
		setSortValue,
	};
});
