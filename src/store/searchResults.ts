import { defineStore } from 'pinia';
import { GenericSearchResult } from '@/types/GenericSearchResult';
import { APIService } from '@/api/api-service';
import { useSpinnerStore } from '@/store/spinner';

export interface SearchArgs {
	currentQuery: string;
}

export const useSearchResultStore = defineStore({
	id: 'searchResults',
	state: () => ({
		searchResult: [] as Array<GenericSearchResult>,
		//TODO build the array type when we know how it's gonna look
		facetResult: [] as Array<string>,
		numFound: 0,
		loading: false,
		error: '',
		currentQuery: '',
		noHits: false,
		filters: [] as Array<string>,
		spinnerStore: useSpinnerStore(),
	}),

	getters: {},

	actions: {
		addFilter(filter: string) {
			if (!this.filters.includes(filter)) {
				this.filters.push(filter);
			}
		},
		resetFilters() {
			this.filters = [];
		},
		removeFilter(filter: string) {
			this.filters.splice(this.filters.indexOf(filter), 1);
		},

		async getSearchResults(query: string) {
			this.spinnerStore.toggleSpinner(true);
			this.loading = true;
			let fq = '';
			if (this.filters.length > 0) {
				this.filters.forEach((filt: string) => {
					fq += '&' + filt;
				});
			}
			try {
				const responseData = await APIService.getSearchResults(query, fq);
				this.currentQuery = query;
				this.searchResult = responseData.data.response.docs;
				this.facetResult = responseData.data.facet_counts.facet_fields;
				this.numFound = responseData.data.response.numFound;
				this.noHits = this.numFound === 0 ? true : false;
				this.loading = false;
				this.spinnerStore.toggleSpinner(false);
			} catch (err) {
				throw new Error('error');
			}
		},
	},
});
