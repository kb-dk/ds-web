import { defineStore } from 'pinia';
import { GenericSearchResult } from '@/types/GenericSearchResult';
import { APIService } from '@/api/api-service';

export interface SearchArgs {
	currentQuery: string;
}

export const useSearchResultStore = defineStore({
	id: 'searchResults',
	state: () => ({
		searchResult: [] as Array<GenericSearchResult>,
		facetResult: [] as Array<unknown>,
		numFound: 0,
		loading: false,
		error: '',
		currentQuery: '',
		noHits: false,
	}),

	getters: {},

	actions: {
		async getSearchResults(query: string) {
			try {
				const responseData = await APIService.getSearchResults(query);
				this.currentQuery = query;
				this.searchResult = responseData.data.response.docs;
				this.facetResult = responseData.data.facet_counts.facet_field;
				this.numFound = responseData.data.response.numFound;
				if (this.numFound === 0) {
					this.noHits = true;
				}
			} catch (err) {
				throw new Error('error');
			}
		},
	},
});
