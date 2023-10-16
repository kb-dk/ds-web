<template>
	<div class="search-box">
		<div :class="searchResultStore.searchResult.length > 0 ? 'search-container small' : 'search-container big'">
			<SearchBar></SearchBar>
		</div>
		<div class="container">
			<div class="row">
				<div
					v-if="searchResultStore.searchResult.length > 0"
					class="hit-count"
				>
					<HitCount
						:hit-count="searchResultStore.numFound"
						:no-hits="searchResultStore.noHits"
						:query="searchResultStore.currentQuery !== undefined ? searchResultStore.currentQuery : ''"
					/>
				</div>
				<div v-else-if="searchResultStore.searchFired">No search results for this query</div>
			</div>
		</div>
		<div class="container">
			<div class="row">
				<div class="search-resultset">
					<div class="search-facets">
						<Facets :facet-results="searchResultStore.facetResult" />
					</div>
					<div class="search-results">
						<SearchResults :search-results="searchResultStore.searchResult" />
					</div>
				</div>
			</div>
		</div>
		<div
			v-if="
				searchResultStore.searchResult.length === 0 &&
				(searchResultStore.currentQuery?.length === 0 || searchResultStore.currentQuery === undefined)
			"
		>
			<div class="container">
				<div class="intro">
					<h2>Velkommen til DR's arkiv på Det Kgl. Bibliotek</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
						dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
						ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
						nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
						anim id est laborum.
					</p>
				</div>
			</div>
			<div class="container">
				<h3>Udpluk fra arkivet</h3>
				<GridDisplay
					:spot-nr="8"
					:row-nr="4"
					:draggable="true"
				></GridDisplay>
			</div>
			<div class="blue-background">
				<div class="edge blue"></div>

				<div class="container">
					<h3>Om DR Arkivet</h3>
					<GridDisplay
						:draggable="false"
						:spot-nr="3"
						:row-nr="3"
						:blue-background="true"
					></GridDisplay>
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
import SearchBar from '@/components/search/SearchBar.vue';
import Facets from '@/components/search/Facets.vue';
import GridDisplay from '@/components/GridDisplay.vue';
export default defineComponent({
	name: 'Search',
	components: {
		HitCount,
		SearchResults,
		SearchBar,
		Facets,
		GridDisplay,
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		return { searchResultStore };
	},
	onMounted() {
		this.searchResultStore.resetFilters();
	},
	created() {
		if (this.$route.query.q !== undefined) {
			this.searchResultStore.getSearchResults(this.$route.query.q as string);
		}
		// Watch the 'term' param and update search results if it changes
		this.$watch(
			() => this.$route.query.q,
			(newq: string, prevq: string) => {
				console.log(prevq, newq, 'here');
				if (newq !== prevq && newq !== undefined) {
					console.log('new search!');
					this.searchResultStore.getSearchResults(newq);
				}
				if (newq === undefined) {
					this.searchResultStore.resetSearch();
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
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}

.blue-background {
	background-color: #caf0fe;
	width: 100%;
	max-width: 100%;
	margin-top: 20px;
}

.intro {
	width: 100%;
}

h3 {
	padding-top: 20px;
}

.edge {
	height: 31px;
}

.edge.blue {
	width: 100%;
	position: absolute;
	background-color: #caf0fe;
	clip-path: polygon(100% 0%, 0% 100%, 100% 100%);
	margin-top: -30px;
	z-index: 3;
}

.search-box {
	max-width: 100%;
	overflow: hidden;
}
.search-container {
	width: 100vw;
	max-width: 100%;
	height: 500px;
	transition: height 0.5s ease-in-out 0s;
}

.search-container.big {
	height: 500px;
}

.search-container.small {
	height: 300px;
}
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
	.intro {
		width: 75%;
	}
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
