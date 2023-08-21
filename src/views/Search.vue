<template>
	<div>
		<div class="container">
		<div class="hit-count">
			<HitCount
				:hit-count="searchResultStore.numFound"
				:no-hits="searchResultStore.noHits"
			/>
		</div>
			<div class="search-resultset">
				<div class="search-facets"></div>
		<div class="search-results">
			<SearchResults :search-results="searchResultStore.searchResult" />
		</div>
	</div>
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
		// Set initial search term from query param
		this.searchResultStore.getSearchResults(this.$route.query.term as string);

		// Watch the 'term' param and update search results if it changes
		this.$watch(
			() => this.$route.query.term,
			(newTerm: string, prevTerm: string) => {
				if (newTerm !== prevTerm) {
					this.searchResultStore.getSearchResults(newTerm);
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
	background-color: rgba(30, 30, 30, 0.1);
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
