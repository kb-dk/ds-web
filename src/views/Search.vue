<template>
	<div>
		<div class="hit-count">
			<HitCount
				:hit-count="searchResultStore.numFound"
				:no-hits="searchResultStore.noHits"
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

export default defineComponent({
	name: 'Search',
	components: {
		HitCount,
		SearchResults,
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		return { searchResultStore };
	},
	created() {
		this.$watch(
			() => this.$route.query.term,
			(newTerm: string, prevTerm: string) => {
				if (newTerm !== prevTerm) {
					this.searchResultStore.getSearchResults(newTerm as string);
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
