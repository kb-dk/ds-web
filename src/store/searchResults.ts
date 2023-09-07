import { defineStore } from 'pinia';
import { GenericSearchResult } from '@/types/GenericSearchResult';
import { APIService } from '@/api/api-service';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { AxiosError } from 'axios';
import { inject, ref } from 'vue';

export const useSearchResultStore = defineStore('searchResults', () => {
	const searchResult = ref([] as Array<GenericSearchResult>);
	const facetResult = ref([] as Array<string>);
	const errorManager = inject('errorManager') as ErrorManagerType;
	const numFound = ref(0);
	const loading = ref(false);
	const error = ref('');
	const currentQuery = ref('');
	const noHits = ref(false);
	const filters = ref([] as Array<string>);

	const addFilter = (filter: string) => {
		if (!filters.value.includes(filter)) {
			filters.value.push(filter);
		}
	};

	const resetFilters = () => {
		filters.value = [];
	};

	const removeFilter = (filter: string) => {
		filters.value.splice(filters.value.indexOf(filter), 1);
	};

	const getSearchResults = async (query: string) => {
		let fq = '';
		if (filters.value.length > 0) {
			filters.value.forEach((filt: string) => {
				fq += '&' + filt;
			});
		}
		try {
			loading.value = true;
			const responseData = await APIService.getSearchResults(query, fq);
			currentQuery.value = query;
			searchResult.value = responseData.data.response.docs;
			facetResult.value = responseData.data.facet_counts.facet_fields;
			numFound.value = responseData.data.response.numFound;
			noHits.value = numFound.value === 0;
		} catch (err: unknown) {
			error.value = (err as AxiosError).message;
			errorManager.submitError(err as AxiosError);
		} finally {
			loading.value = false;
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
		addFilter,
		resetFilters,
		removeFilter,
		getSearchResults,
	};
});
