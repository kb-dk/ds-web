<template>
  <div>
    <div class="search-box">
      <SearchBox @search-triggered="search" />
    </div>
    <div class="hit-count"><HitCount :hit-count="searchResultStore.numFound" :no-hits="searchResultStore.noHits" /></div>
    <div class="search-results">
      <SearchResults :search-results="searchResultStore.searchResult" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { useSearchResultStore } from "@/store/searchResults"
import HitCount from "@/components/search/HitCount.vue"
import SearchResults from "@/components/search/SearchResults.vue"
import SearchBox from "@/components/search/SearchBox.vue"

export default defineComponent({
  name: "Search",
  components: {
    HitCount,
    SearchResults,
    SearchBox
  },

  setup() {
    const searchResultStore = useSearchResultStore()
    return { searchResultStore }
  },
  methods: {
    search: function (query: string) {
      this.searchResultStore.getSearchResults(query)
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.search-box {
  width: 100%;
}

.hit-count {
  text-align: left;
  padding: 0 200px 0 200px;
}

.search-results {
  text-align: left;
  padding: 50px 200px 0 200px;
}
</style>
