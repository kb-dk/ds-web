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
		<div class="search-resultset">
			<div class="search-facets">
				<Facets :facet-results="searchResultStore.facetResult" />
			</div>
			<div class="search-results">
				<SearchResults :search-results="searchResultStore.searchResult" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSearchResultStore } from '@/store/searchResults';
import HitCount from '@/components/search/HitCount.vue';
import SearchResults from '@/components/search/SearchResults.vue';
import SearchBar from '@/components/search/SearchBar.vue';
import Facets from '@/components/search/Facets.vue';

export default defineComponent({
	name: 'Search',
	components: {
		HitCount,
		SearchResults,
		SearchBar,
		Facets,
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
.search-resultset {
	display: flex;
	flex-direction: column;
	gap: 30px;
}

.hit-count {
	padding-top: 40px;
	padding-bottom: 40px;
}

.search-facets {
	min-width: 300px;
	width: 100%;
}

.search-results {
	position: relative;
	max-width: 100%;
}

.container {
	text-align: left;
	padding-right: 12px;
	padding-left: 12px;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
}
/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
}
@media (min-width: 800px) {
	.search-results {
		max-width: calc(100% - (330px));
	}
	.search-facets {
		width: 20%;
	}
	.search-resultset {
		display: flex;
		flex-direction: row;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		display: flex;
		flex-direction: column;
		max-width: 1150px;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		padding-right: 0;
		padding-left: 0;
	}
}
</style>
