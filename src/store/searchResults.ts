import { defineStore } from "pinia"
import { GenericSearchResult } from "@/types/GenericSearchResult"

export const useSearchResultStore = defineStore({
  id: "searchResults",
  state: () => ({ genericSearchResult: [] as GenericSearchResult[] }),
  getters: {},
  actions: {}
})
