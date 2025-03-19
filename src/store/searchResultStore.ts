import { defineStore } from 'pinia';
import { FacetResultType, FacetsType, GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { APIService } from '@/api/api-service';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { AxiosError } from 'axios';
import { computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SpellCheckType } from '@/types/SpellCheckType';
import { LocationQueryValue } from 'vue-router';
import { APIAutocompleteTerm } from '@/types/APIResponseTypes';
import { Priority, Severity } from '@/types/NotificationType';
import { CuratedItemsType } from '@/types/CuratedItemsType';
import { max } from 'date-fns';

export const useSearchResultStore = defineStore('searchResults', () => {
	let currentSearchUUID = '';
	let currentSearchUUIDForFacets = '';
	let comparisonSearchUUID = '';
	const firstBackendFetchExecuted = ref(false);
	const initFacets = ref({} as FacetsType);
	const searchResult = ref([] as Array<GenericSearchResultType>);
	const spellCheck = ref({} as unknown as SpellCheckType);
	const facetResult = ref(Object as unknown as FacetResultType);
	const autocompleteResult = ref([] as Array<APIAutocompleteTerm>);
	const errorManager = inject('errorManager') as ErrorManagerType;
	const rotationalResult = ref([] as Array<GenericSearchResultType>);
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
	const categoryFilters = ref([] as Array<string>);
	const preliminaryFilter = ref('');
	const showFacets = ref(false);
	const blockAutocomplete = ref(false);
	const resultGrid = ref(false);
	const curatedContent = ref({} as CuratedItemsType);
	const currentGenreFacetString = ref('');
	const currentChannelFacetString = ref('');
	const loadingChannels = ref(false);
	const loadingGenres = ref(false);
	const totalPages = computed(() => Math.ceil(numFound.value / Number(rowCount.value)));
	//We normally display 10 or 40 items per page. This'll make it dynamic
	const maxPages = computed(() =>
		totalPages.value > 1000 / Number(rowCount.value) ? 1000 / Number(rowCount.value) : totalPages.value,
	);

	const pageNumber = computed(() => {
		const pageStart = start.value ? Number(start.value) : 0;
		return (pageStart + Number(rowCount.value)) / Number(rowCount.value);
	});

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
		if (value) {
			getFacetResults(lastSearchQuery.value);
		}
	};

	const setRotationalResult = (items: GenericSearchResultType[]) => {
		rotationalResult.value = items;
	};

	const setCuratedContent = (content: CuratedItemsType) => {
		curatedContent.value = content;
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
		categoryFilters.value = [];
		if (URLFilters !== undefined) {
			if (URLFilters instanceof Array) {
				URLFilters.forEach((filter) => {
					if (filter?.split('%3A')[0].includes('origin')) {
						preliminaryFilter.value = filter;
					} else if (filter?.split('%3A')[0].includes('creator_affiliation_facet')) {
						const cleanedString = filter.replace(/[()]/g, '');
						channelFilters.value = cleanedString.split(' OR ');
					} else if (filter?.split('%3A')[0].includes('genre_facet')) {
						const cleanedString = filter.replace(/[()]/g, '');
						categoryFilters.value = cleanedString.split(' OR ');
					} else {
						filter !== '' ? filters.value.push(`fq=${filter}`) : null;
					}
				});
			} else {
				const str = URLFilters;
				if (str.split('%3A')[0].includes('origin')) {
					filters.value.push(`fq=${str}`);
				} else if (str.split('%3A')[0].includes('creator_affiliation_facet')) {
					const cleanedString = str.replace(/[()]/g, '');
					channelFilters.value = cleanedString.split(' OR ');
				} else if (str.split('%3A')[0].includes('genre_facet')) {
					const cleanedString = str.replace(/[()]/g, '');
					categoryFilters.value = cleanedString.split(' OR ');
				} else {
					str !== '' ? filters.value.push(`fq=${str}`) : null;
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
		categoryFilters.value = [];
	};

	const resetAutocomplete = () => {
		autocompleteResult.value = [];
	};

	const setBlockAutocomplete = (state: boolean) => {
		blockAutocomplete.value = state;
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

	const getFacetResults = async (query: string) => {
		if (currentSearchUUIDForFacets !== currentSearchUUID) {
			currentSearchUUIDForFacets = currentSearchUUID;
			loadingChannels.value = true;
			loadingGenres.value = true;
			const startParam = start.value === '' ? '' : `&start=${start.value}`;
			const sortParam = sort.value === '' ? '' : `&sort=${sort.value}`;
			try {
				if (currentGenreFacetString.value !== currentChannelFacetString.value) {
					const facetGenreData = await APIService.getFacetResults(
						query,
						currentGenreFacetString.value,
						startParam as string,
						sortParam as string,
					);

					const facetChannelData = await APIService.getFacetResults(
						query,
						currentChannelFacetString.value,
						startParam as string,
						sortParam as string,
					);

					facetResult.value.genre_facet = facetGenreData.data.facet_counts.facet_fields.genre_facet as string[];
					facetResult.value.creator_affiliation_facet = facetChannelData.data.facet_counts.facet_fields
						.creator_affiliation_facet as string[];
				} else {
					const facetData = await APIService.getFacetResults(
						query,
						currentGenreFacetString.value,
						startParam as string,
						sortParam as string,
					);
					facetResult.value.genre_facet = facetData.data.facet_counts.facet_fields.genre_facet as string[];
					facetResult.value.creator_affiliation_facet = facetData.data.facet_counts.facet_fields
						.creator_affiliation_facet as string[];
				}
			} catch (err: unknown) {
				error.value = (err as AxiosError).message;
				errorManager.submitError(err as AxiosError, t('error.searchfailed'));
				loadingChannels.value = false;
				loadingGenres.value = false;
			} finally {
				loadingChannels.value = false;
				loadingGenres.value = false;
			}
		}
	};

	const getSearchResults = async (query: string) => {
		if (currentQuery.value === '*:*') {
			currentQuery.value = '';
		}
		setBlockAutocomplete(true);
		lastSearchQuery.value = query;

		resetAutocomplete();
		let searchFilters = '';
		let presetGenreFilters = '';
		let presetChannelFilters = '';
		if (filters.value.length > 0) {
			filters.value.forEach((filt: string) => {
				searchFilters += `&${filt}`;
				presetGenreFilters += `&${filt}`;
				presetChannelFilters += `&${filt}`;
			});
		}
		let channelFilterString = '';
		if (channelFilters.value.length > 0) {
			channelFilterString = `&fq=(${channelFilters.value.join(' OR ')})`;
			presetGenreFilters += `&fq=(${channelFilters.value.join(' OR ')})`;
		}
		searchFilters += channelFilterString;

		let categoryFilterString = '';
		if (categoryFilters.value.length > 0) {
			categoryFilterString = `&fq=(${categoryFilters.value.join(' OR ')})`;
			presetChannelFilters += `&fq=(${categoryFilters.value.join(' OR ')})`;
		}
		searchFilters += categoryFilterString;
		if (preliminaryFilter.value) {
			searchFilters += `&fq=${preliminaryFilter.value}`;
			presetGenreFilters += `&fq=${preliminaryFilter.value}`;
			presetChannelFilters += `&fq=${preliminaryFilter.value}`;
		}

		currentChannelFacetString.value = presetChannelFilters;
		currentGenreFacetString.value = presetGenreFilters;

		const startParam = start.value === '' ? '' : `&start=${start.value}`;
		const sortParam = sort.value === '' ? '' : `&sort=${sort.value}`;

		//https://stackoverflow.com/a/62359248
		//to get a _GOOD_ uuid, we use the functionality from the createObjectURL method, that creates one, and just get that one.

		const url = URL.createObjectURL(new Blob());
		currentSearchUUID = url.toString().split('/').reverse()[0];
		URL.revokeObjectURL(url);

		if (showFacets.value) {
			getFacetResults(lastSearchQuery.value);
		}

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

			comparisonSearchUUID = responseData.data.responseHeader.params.queryUUID || '';

			if (responseMatchesCurrentSearch(comparisonSearchUUID) && searchFired.value) {
				searchResult.value = responseData.data.response.docs;
				spellCheck.value = responseData.data.spellcheck;
				numFound.value = responseData.data.response.numFound;
				noHits.value = numFound.value === 0;
			}
		} catch (err: unknown) {
			error.value = (err as AxiosError).message;
			errorManager.submitCustomError(
				'search-result-error',
				t('error.infoError.title'),
				t('error.infoError.searchResult'),
				Severity.ERROR,
				true,
				Priority.MEDIUM,
			);
			noHits.value = numFound.value === 0;
			loading.value = false;
		} finally {
			if (responseMatchesCurrentSearch(comparisonSearchUUID)) {
				loading.value = false;
			}
		}
	};

	return {
		firstBackendFetchExecuted,
		initFacets,
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
		categoryFilters,
		rotationalResult,
		loadingGenres,
		loadingChannels,
		curatedContent,
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
		setRotationalResult,
		setCuratedContent,
		pageNumber,
		totalPages,
		maxPages,
	};
});
