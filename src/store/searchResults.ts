import { defineStore } from "pinia"
import { GenericSearchResult } from "@/types/GenericSearchResult"
import { SearchService } from "@/api/search-service"

export interface SearchArgs {
  currentQuery: string
}

export const useSearchResultStore = defineStore({
  id: "searchResults",
  state: () => ({
    searchResult: [] as Array<GenericSearchResult>,
    numFound: 0,
    loading: false,
    error: "",
    currentQuery: "",
    noHits: false
  }),
  getters: {},
  actions: {
    async getSearchResults(query: string) {
      try {
        const responseData = await SearchService.getSearchResults(query)
        this.searchResult = responseData.data.response.docs
        this.numFound = responseData.data.response.numFound
        if (this.numFound === 0) {
          this.noHits = true
        }
      } catch (err) {
        throw new Error("error")
      }
    }
  }
})
