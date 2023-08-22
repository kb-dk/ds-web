<template>
	<div>
		<SearchBar></SearchBar>
		<div class="hit-count">
			<HitCount
				:hit-count="searchResultStore.numFound"
				:no-hits="searchResultStore.noHits"
				:query="searchResultStore.currentQuery !== undefined ? searchResultStore.currentQuery : ''"
			/>
		</div>
		<div class="search-results">
			<SearchResults :search-results="searchResultStore.searchResult" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSearchResultStore } from '@/store/searchResults';
import HitCount from '@/components/search/HitCount.vue';
import SearchResults from '@/components/search/SearchResults.vue';
import SearchBar from '@/components/search/SearchBar.vue';

export default defineComponent({
	name: 'Search',
	components: {
		HitCount,
		SearchResults,
		SearchBar,
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		return { searchResultStore };
	},
	created() {
		if (this.$route.query.q !== undefined) {
			this.searchResultStore.getSearchResults(this.$route.query.q as string);
		}
		// Watch the 'term' param and update search results if it changes
		this.$watch(
			() => this.$route.query.q,
			(newq: string, prevq: string) => {
				if (newq !== prevq) {
					this.searchResultStore.getSearchResults(newq);
				}
			},
		);
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.hit-count {
	text-align: left;
	padding: 0 200px 0 200px;
}

.search-results {
	text-align: left;
	padding: 50px 200px 0 200px;
}
</style>
