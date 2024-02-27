import { defineStore } from 'pinia';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { APIService } from '@/api/api-service';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { AxiosError } from 'axios';
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FacetResultType } from '@/types/GenericSearchResultTypes';
import { SpellCheckType } from '@/types/SpellCheckType';
import { LocationQueryValue } from 'vue-router';
import { APIAutocompleteTerm } from '@/types/APIResponseTypes';

export const useSearchResultStore = defineStore('searchResults', () => {
	let currentSearchUUID = '';
	let comparisonSearchUUID = '';
	const searchResult = ref([] as Array<GenericSearchResultType>);
	const spellCheck = ref({} as unknown as SpellCheckType);
	const facetResult = ref(Object as unknown as FacetResultType);
	const AutocompleteResult = ref([] as Array<APIAutocompleteTerm>);
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
	const showFacets = ref(true);

	const toggleShowFacets = (value: boolean) => {
		showFacets.value = value;
	};

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
	const resetSpellCheck = () => {
		spellCheck.value = {} as SpellCheckType;
	};

	const setSortValue = (value: string) => {
		sort.value = value;
	};

	const resetSearch = () => {
		resetFilters();
		resetResults();
		resetStart();
		resetSort();
		resetSpellCheck();
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

	const resetAutocomplete = () => {
		AutocompleteResult.value = [];
	};

	const removeFilter = (filter: string) => {
		filters.value.splice(filters.value.indexOf(filter), 1);
	};

	const getAutocompleteResults = async (query: string) => {
		const autocompleteReponse = await APIService.getAutocomplete(query);
		const autocompleteSelectedTerm = autocompleteReponse.data.suggest.dr_title_suggest;
		AutocompleteResult.value = autocompleteSelectedTerm[Object.keys(autocompleteSelectedTerm)[0]].suggestions;
	};

	const responseMatchesCurrentSearch = (uuid: string): boolean => {
		return uuid === currentSearchUUID;
	};

	const getSearchResults = async (query: string) => {
		resetAutocomplete();
		let searchFilters = '';
		if (filters.value.length > 0) {
			filters.value.forEach((filt: string) => {
				searchFilters += `&${filt}`;
			});
		}
		const startParam = start.value === '' ? '' : `&start=${start.value}`;
		const sortParam = sort.value === '' ? '' : `&sort=${sort.value}`;

		//https://stackoverflow.com/a/62359248
		//to get a _GOOD_ uuid, we use the functionality from the createObjectURL method, that creates one, and just get that one.

		const url = URL.createObjectURL(new Blob());
		currentSearchUUID = url.toString().split('/').reverse()[0];
		URL.revokeObjectURL(url);

		try {
			searchFired.value = true;
			console.log('Querying Solr with query', query, 'and filters', searchFilters, start.value, sort.value);
			//spinnerStore.toggleSpinner(true);
			loading.value = true;
			const responseData = await APIService.getSearchResults(
				query,
				searchFilters,
				startParam as string,
				sortParam as string,
				currentSearchUUID,
			);
			const facetData = await APIService.getFacetResults(
				query,
				searchFilters,
				startParam as string,
				sortParam as string,
			);

			comparisonSearchUUID = responseData.data.responseHeader.params.queryUUID || '';

			if (responseMatchesCurrentSearch(comparisonSearchUUID)) {
				currentQuery.value = query;
				searchResult.value = responseData.data.response.docs;
				spellCheck.value = responseData.data.spellcheck;
				facetResult.value = facetData.data.facet_counts.facet_fields as FacetResultType;
				numFound.value = responseData.data.response.numFound;
				noHits.value = numFound.value === 0;
			}
		} catch (err: unknown) {
			error.value = (err as AxiosError).message;
			errorManager.submitError(err as AxiosError, t('error.searchfailed'));
		} finally {
			if (responseMatchesCurrentSearch(comparisonSearchUUID)) {
				//console.log('Current search finished, we remove spinner.');
				//spinnerStore.toggleSpinner(false);
				loading.value = false;
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	};

	return {
		searchResult,
		facetResult,
		AutocompleteResult,
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
		showFacets,
		spellCheck,
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
		toggleShowFacets,
		getAutocompleteResults,
		resetAutocomplete,
	};
});
