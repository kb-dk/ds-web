import { defineStore } from 'pinia';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { APIService } from '@/api/api-service';
import { useSpinnerStore } from '@/store/spinnerStore';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { AxiosError } from 'axios';
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { FacetResultType } from '@/types/GenericSearchResultTypes';

export const useSearchResultStore = defineStore('searchResults', () => {
	const searchResult = ref([] as Array<GenericSearchResultType>);
	const facetResult = ref(Object as unknown as FacetResultType);
	const errorManager = inject('errorManager') as ErrorManagerType;
	const searchFired = ref(false);
	const { t } = useI18n();
	const numFound = ref(0);
	const loading = ref(false);
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

	const resetSearch = () => {
		resetFilters();
		resetResults();
		currentQuery.value = '';
		searchFired.value = false;
		//console.log('resetting everything o/', searchFired.value, currentQuery.value, searchResult.value, filters.value);
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

	const getSearchResults = async (query: string) => {
		//Disabled until DISC-390 is solved
		/*let fq = '';
		if (filters.value.length > 0) {
			filters.value.forEach((filt: string, index) => {
				fq += filt;
			});
		}*/
		try {
			spinnerStore.toggleSpinner(true);
			loading.value = true;
			const responseData = await APIService.getSearchResults(query, filters.value);
			currentQuery.value = query;
			searchResult.value = responseData.data.response.docs;
			facetResult.value = responseData.data.facet_counts.facet_fields as FacetResultType;
			numFound.value = responseData.data.response.numFound;
			noHits.value = numFound.value === 0;
		} catch (err: unknown) {
			error.value = (err as AxiosError).message;
			errorManager.submitError(err as AxiosError, t('error.searchfailed'));
		} finally {
			spinnerStore.toggleSpinner(false);
			loading.value = false;
			searchFired.value = true;
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
		addFilter,
		resetFilters,
		removeFilter,
		getSearchResults,
		resetSearch,
	};
});
