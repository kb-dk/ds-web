<template>
	<div class="search-box">
		<div
			ref="searchContainer"
			class="search-container"
		>
			<SearchBarWrapper></SearchBarWrapper>
		</div>
		<Transition
			name="fade"
			mode="out-in"
		>
			<div
				key="1"
				v-if="searchResultStore.searchResult.length > 0 || searchResultStore.searchFired"
			>
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
						<div v-else-if="searchResultStore.searchFired">{{ $t('search.nohit') }}</div>
					</div>
				</div>
				<div
					key="2"
					v-if="searchResultStore.searchResult.length > 0"
					class="container"
				>
					<div class="row">
						<div class="search-resultset">
							<div class="search-facets">
								<Facets :facet-results="searchResultStore.facetResult" />
							</div>
							<div class="search-results">
								<SearchResults
									:search-results="searchResultStore.searchResult"
									:num-found="searchResultStore.numFound"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				key="2"
				v-else
			>
				<div class="container">
					<div class="intro">
						<h2>Velkommen til DR's arkiv på Det Kgl. Bibliotek</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
							ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
							fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum.
						</p>
						<router-link to="/about">read more</router-link>
					</div>
				</div>
				<div class="container">
					<h3>Udpluk fra arkivet</h3>
					<GridDisplay
						:spot-nr="8"
						:row-nr="4"
						:draggable="true"
						:spots="(['1','2','3','4','5','6','7','8'] as unknown as GenericSearchResultType[])"
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
							:spots="(['1','2','3'] as unknown as GenericSearchResultType[])"
						></GridDisplay>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import HitCount from '@/components/search/HitCount.vue';
import SearchResults from '@/components/search/SearchResults.vue';
import SearchBarWrapper from '@/components/search/SearchBarWrapper.vue';
import Facets from '@/components/search/Facets.vue';
import GridDisplay from '@/components/common/GridDisplay.vue';
import gsap from 'gsap';
import { useRouter, useRoute } from 'vue-router';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';

export default defineComponent({
	name: 'Search',
	components: {
		HitCount,
		SearchResults,
		SearchBarWrapper,
		Facets,
		GridDisplay,
	},

	setup() {
		const searchContainer = ref<HTMLElement | null>(null);
		const searchResultStore = useSearchResultStore();
		const router = useRouter();
		const route = useRoute();

		const getFacetQueryFromFacetURLParam = (facetUrlParam: string) => {
			const decodedFacetParam = decodeURIComponent(facetUrlParam);
			const [facetKey, facetValue] = decodedFacetParam.split(':');
			return `fq=${facetKey}:${facetValue}`;
		};

		onMounted(() => {
			searchResultStore.resetFilters();
			if (route.query.q !== undefined) {
				gsap.set(searchContainer.value, {
					height: '300px',
				});
				const routeFacetQueries = route.query.fq;
				if (routeFacetQueries) {
					if (Array.isArray(routeFacetQueries)) {
						routeFacetQueries.forEach((facet) => {
							searchResultStore.addFilter(getFacetQueryFromFacetURLParam(facet as string));
						});
					} else {
						searchResultStore.addFilter(getFacetQueryFromFacetURLParam(routeFacetQueries as string));
					}
				}
				searchResultStore.getSearchResults(route.query.q as string);
			}
		});

		watch(
			() => searchResultStore.searchResult.length,
			(newn: number, prevn: number) => {
				if (newn > 0) {
					gsap.to(searchContainer.value, { height: '300px', duration: '0.4' });
				} else {
					gsap.to(searchContainer.value, { height: '500px', duration: '0.4' });
				}
			},
		);

		// Watch the 'term' param and update search results if it changes
		watch(
			() => router.currentRoute.value.query.q as string,
			(newq: string, prevq: string) => {
				if (newq !== prevq && newq !== undefined) {
					searchResultStore.getSearchResults(newq);
				}
				if (newq === undefined) {
					searchResultStore.resetSearch();
				}
			},
		);

		return { searchResultStore, searchContainer };
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-to {
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
