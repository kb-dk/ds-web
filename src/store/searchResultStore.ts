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
	const autocompleteResult = ref([] as Array<APIAutocompleteTerm>);
	const errorManager = inject('errorManager') as ErrorManagerType;
	const searchFired = ref(false);
	const { t } = useI18n();
	const numFound = ref(0);
	const loading = ref(false);
	const start = ref('');
	const sort = ref('');
	const error = ref('');
	const rowCount = ref('10');
	const rowOffset = ref(10);
	const currentQuery = ref('');
	const lastSearchQuery = ref('');
	const noHits = ref(false);
	const filters = ref([] as Array<string>);
	const channelFilters = ref([] as Array<string>);
	const preliminaryFilter = ref('');
	const showFacets = ref(false);
	const blockAutocomplete = ref(false);
	const resultGrid = ref(false);
	const keepFacets = ref(false);

	const setStart = (value: string) => {
		start.value = value;
	};

	const setRowOffset = (value: number) => {
		rowOffset.value = value;
	};

	const setRowCount = (value: string) => {
		rowCount.value = value;
	};

	const setResultGrid = (value: boolean) => {
		resultGrid.value = value;
	};

	const toggleShowFacets = (value: boolean) => {
		showFacets.value = value;
	};

	const addFilter = (filter: string) => {
		if (!filters.value.includes(filter)) {
			filters.value.push(filter);
		}
	};

	const removeFilter = (filter: string) => {
		filters.value.splice(filters.value.indexOf(filter), 1);
	};

	const setFiltersFromURL = (URLFilters: string[] | LocationQueryValue[] | string) => {
		filters.value = [];
		channelFilters.value = [];
		if (URLFilters !== undefined) {
			if (URLFilters instanceof Array) {
				URLFilters.forEach((filter) => {
					if (filter?.split(':')[0].includes('origin')) {
						preliminaryFilter.value = filter;
					} else if (filter?.includes('creator_affiliation_facet')) {
						const cleanedString = filter.replace(/[()]/g, '');
						channelFilters.value = cleanedString.split(' OR ');
					} else {
						filter !== '' ? filters.value.push(`fq=${filter}`) : null;
					}
				});
			} else {
				if (URLFilters.split(':')[0].includes('origin')) {
					filters.value.push(`fq=${URLFilters}`);
				} else {
					URLFilters !== '' ? filters.value.push(`fq=${URLFilters}`) : null;
				}
			}
		}
	};

	const setRowCountFromURL = (rows: string | undefined) => {
		if (rows) {
			rowCount.value = rows;
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

	const setCurrentQueryFromURL = (URLQuery: string | undefined) => {
		if (URLQuery) {
			currentQuery.value = URLQuery;
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

	const resetPreliminaryFilters = () => {
		preliminaryFilter.value = '';
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
		resetPreliminaryFilters();
		setKeepFacets(false);
		currentQuery.value = '';
		searchFired.value = false;
		loading.value = false;
	};

	const resetResults = () => {
		searchResult.value = [];
	};

	const resetFilters = () => {
		filters.value = [];
		facetResult.value = {} as FacetResultType;
		channelFilters.value = [];
	};

	const resetAutocomplete = () => {
		autocompleteResult.value = [];
	};

	const setBlockAutocomplete = (state: boolean) => {
		blockAutocomplete.value = state;
	};

	const setKeepFacets = (state: boolean) => {
		keepFacets.value = state;
	};

	const getAutocompleteResults = (query: string) => {
		APIService.getAutocomplete(query).then((autocompleteReponse) => {
			if (!blockAutocomplete.value) {
				const autocompleteSelectedTerm = autocompleteReponse.data.suggest.radiotv_title_suggest;
				autocompleteResult.value = autocompleteSelectedTerm[Object.keys(autocompleteSelectedTerm)[0]].suggestions;
			}
		});
	};

	const responseMatchesCurrentSearch = (uuid: string): boolean => {
		return uuid === currentSearchUUID;
	};

	const getSearchResults = async (query: string) => {
		if (currentQuery.value === '*:*') {
			currentQuery.value = '';
		}
		setBlockAutocomplete(true);
		lastSearchQuery.value = query;
		resetAutocomplete();
		let searchFilters = '';
		let facetFilters = '';
		if (filters.value.length > 0) {
			filters.value.forEach((filt: string) => {
				searchFilters += `&${filt}`;
				facetFilters += `&${filt}`;
			});
		}
		let channelFilterString = '';
		if (channelFilters.value.length > 0) {
			channelFilterString = `&fq=(${channelFilters.value.join(' OR ')})`;
		}
		searchFilters += channelFilterString;
		if (preliminaryFilter.value) {
			searchFilters += `&fq=${preliminaryFilter.value}`;
			facetFilters += `&fq=${preliminaryFilter.value}`;
		}
		const startParam = start.value === '' ? '' : `&start=${start.value}`;
		const sortParam = sort.value === '' ? '' : `&sort=${sort.value}`;

		//https://stackoverflow.com/a/62359248
		//to get a _GOOD_ uuid, we use the functionality from the createObjectURL method, that creates one, and just get that one.

		const url = URL.createObjectURL(new Blob());
		currentSearchUUID = url.toString().split('/').reverse()[0];
		URL.revokeObjectURL(url);

		try {
			//window.scrollTo({ top: 0, behavior: 'smooth' });
			searchFired.value = true;
			loading.value = true;
			const responseData = await APIService.getSearchResults(
				query,
				searchFilters,
				rowCount.value,
				startParam as string,
				sortParam as string,
				currentSearchUUID,
			);
			const facetData = await APIService.getFacetResults(
				query,
				facetFilters,
				startParam as string,
				sortParam as string,
			);

			comparisonSearchUUID = responseData.data.responseHeader.params.queryUUID || '';

			if (responseMatchesCurrentSearch(comparisonSearchUUID) && searchFired.value) {
				query !== '*:*' ? (currentQuery.value = query) : null;
				searchResult.value = responseData.data.response.docs;
				spellCheck.value = responseData.data.spellcheck;
				if (!keepFacets.value) {
					facetResult.value = facetData.data.facet_counts.facet_fields as FacetResultType;
				}
				numFound.value = responseData.data.response.numFound;
				noHits.value = numFound.value === 0;
			}
		} catch (err: unknown) {
			error.value = (err as AxiosError).message;
			errorManager.submitError(err as AxiosError, t('error.searchfailed'));
			noHits.value = numFound.value === 0;
			loading.value = false;
		} finally {
			if (responseMatchesCurrentSearch(comparisonSearchUUID)) {
				loading.value = false;
			}
		}
	};

	return {
		searchResult,
		facetResult,
		autocompleteResult,
		errorManager,
		numFound,
		loading,
		error,
		currentQuery,
		lastSearchQuery,
		noHits,
		filters,
		searchFired,
		start,
		sort,
		showFacets,
		spellCheck,
		blockAutocomplete,
		preliminaryFilter,
		resultGrid,
		rowCount,
		rowOffset,
		channelFilters,
		keepFacets,
		addFilter,
		resetFilters,
		removeFilter,
		getSearchResults,
		resetSearch,
		setFiltersFromURL,
		setStartFromURL,
		setCurrentQueryFromURL,
		resetStart,
		setSortFromURL,
		resetSort,
		setSortValue,
		toggleShowFacets,
		getAutocompleteResults,
		resetAutocomplete,
		setBlockAutocomplete,
		setResultGrid,
		setRowCount,
		setRowOffset,
		setStart,
		setRowCountFromURL,
		setKeepFacets,
	};
});
