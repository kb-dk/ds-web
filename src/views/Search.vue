<template>
	<div class="search-and-results">
		<!-- This is for the search bar -->
		<div
			ref="searchContainer"
			class="search-container"
		>
			<div class="mobile-edge edge"></div>
			<SearchBar />
		</div>
		<Transition
			name="result"
			mode="out-in"
		>
			<!-- This is for the search results / facets / did-you-mean / pager -->
			<div
				v-if="searchResultStore.searchResult.length > 0 || searchResultStore.searchFired"
				key="1"
				class="overall-container"
			>
				<SearchOverhead />
				<div class="container">
					<div class="row">
						<div
							v-if="searchResultStore.searchResult.length > 0 || searchResultStore.loading"
							class="search-resultset"
						>
							<Facets :facet-results="searchResultStore.facetResult" />
							<SearchResults
								:search-results="searchResultStore.searchResult"
								:num-found="searchResultStore.numFound"
							/>
						</div>
						<div v-if="searchResultStore.searchResult.length == 0 && !searchResultStore.loading">
							<NoHits />
						</div>
						<Pagination
							v-show="searchResultStore.searchResult.length > 0"
							:items-per-page="Number(searchResultStore.rowCount)"
							:total-hits="searchResultStore.numFound"
							:num-pages-to-show="numPagesToShow"
						/>
					</div>
				</div>
			</div>
			<!-- This for the portal content when no search has been fired -->
			<div
				v-else
				key="2"
			>
				<PortalContent v-if="!searchResultStore.searchFired" />
			</div>
		</Transition>
		<Footer />
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, inject } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import SearchResults from '@/components/search/SearchResults.vue';
import SearchBar from '@/components/search/SearchBar.vue';
import Facets from '@/components/search/Facets.vue';
import PortalContent from '@/components/common/PortalContent.vue';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';
import { useRouter, useRoute, RouteLocationNormalizedLoaded } from 'vue-router';
import Pagination from '@/components/search/Pager.vue';
import SearchOverhead from '@/components/search/SearchOverhead.vue';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import NoHits from '@/components/search/NoHits.vue';
import Footer from '@/components/global/nav/Footer.vue';

export default defineComponent({
	name: 'Search',
	components: {
		SearchResults,
		SearchBar,
		Facets,
		Pagination,
		SearchOverhead,
		PortalContent,
		NoHits,
		Footer,
	},

	setup() {
		const searchContainer = ref<HTMLElement | null>(null);

		const searchResultStore = useSearchResultStore();
		const router = useRouter();
		const route = useRoute();

		const numPagesToShow = 8;
		const { t } = useI18n();

		const errorManager = inject('errorManager') as ErrorManagerType;

		onMounted(() => {
			// we set the title of the archive here - needed if we go back from a page that sets it otherwise.
			document.title = t('app.titles.frontpage.archive.name') as string;
			searchResultStore.resetFilters();
			if (route.query.q !== undefined) {
				gsap.set(searchContainer.value, {
					height: '300px',
				});
				const routeFacetQueries = route.query.fq;
				const start = route.query.start as string;
				const sort = route.query.sort as string;
				searchResultStore.setStartFromURL(start);
				searchResultStore.setSortFromURL(sort);
				if (route.query.q) {
					try {
						const q = new URL(location.href).searchParams.get('q');
						if (q !== null) {
							searchResultStore.setCurrentQueryFromURL(q.toString());
						}
					} catch (error) {
						if (error instanceof URIError) {
							/**
							 * Specific error: MalformedURI - aka you messsed up the query
							 * and even worse you did it by manipulating the url directly
							 * in the URL bar
							 * */
							errorManager.submitCustomError('malformeduri', t('error.malformeduri'));
						} else {
							// General search error happened here so message to user should be generel
							errorManager.submitCustomError('searchfailed', t('error.searchfailed'));
						}
					}
				}
				if (routeFacetQueries) {
					searchResultStore.setFiltersFromURL(routeFacetQueries);
				}
				searchResultStore.getSearchResults(route.query.q as string);
				document.title = (t('app.titles.search') +
					'"' +
					route.query.q +
					'"' +
					t('app.titles.frontpage.archive.suffix')) as string;
			} else if (route.query.q === undefined) {
				searchResultStore.resetSearch();
				gsap.to(searchContainer.value, { height: '500px', duration: '0.4' });
			}
		});

		watch(
			() => searchResultStore.searchResult.length,
			(newn: number) => {
				if (newn > 0) {
					gsap.to(searchContainer.value, { height: '300px', duration: '0.4' });
				} else {
					gsap.to(searchContainer.value, { height: '500px', duration: '0.4' });
				}
			},
		);

		// Watch the url param and update search results if it changes
		watch(
			() => router.currentRoute.value,
			(newp: RouteLocationNormalizedLoaded, prevp: RouteLocationNormalizedLoaded) => {
				if (checkParamUpdate(newp, prevp) && route.query.q !== undefined) {
					if (checkIfSortIsChanged(newp.query.sort as string, prevp.query.sort as string)) {
						searchResultStore.resetStart();
					} else {
						searchResultStore.setStartFromURL(route.query.start as string);
					}
					searchResultStore.setFiltersFromURL(route.query.fq as string[]);
					searchResultStore.setSortFromURL(route.query.sort as string);
					searchResultStore.setCurrentQueryFromURL(route.query.q as string);
					searchResultStore.setRowCountFromURL(route.query.rows as string);
					searchResultStore.getSearchResults(route.query.q as string);
					document.title = (t('app.titles.search') +
						'"' +
						route.query.q +
						'"' +
						t('app.titles.frontpage.archive.suffix')) as string;
				}
				if (route.query.q === undefined) {
					document.title = t('app.titles.frontpage.archive.name') as string;
					searchResultStore.resetSearch();
				}
			},
		);

		const checkIfSortIsChanged = (newSort: string, oldSort: string) => {
			return newSort !== oldSort;
		};

		const checkParamUpdate = (newParams: RouteLocationNormalizedLoaded, prevParams: RouteLocationNormalizedLoaded) => {
			return (
				newParams.query.q !== prevParams.query.q ||
				JSON.stringify(newParams.query.fq) !== JSON.stringify(prevParams.query.fq) ||
				newParams.query.start !== prevParams.query.start ||
				newParams.query.sort !== prevParams.query.sort ||
				newParams.query.rows !== prevParams.query.rows
			);
		};

		return {
			searchResultStore,
			searchContainer,
			numPagesToShow,
		};
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

.overall-container {
	overflow-x: hidden;
}

h3 {
	padding-top: 20px;
}

.edge {
	height: 31px;
}

.mobile-edge {
	width: 100%;
	position: absolute;
	background-color: white;
	clip-path: polygon(100% 0, 0 0, 0 100%);
	z-index: 3;
}

.edge.blue {
	width: 100%;
	position: absolute;
	background-color: #caf0fe;
	clip-path: polygon(100% 0%, 0% 100%, 100% 100%);
	margin-top: -30px;
	z-index: 3;
}

.search-and-results {
	max-width: 100%;
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
}

.hit-count {
	padding-top: 40px;
	padding-bottom: 40px;
}

.container {
	text-align: left;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
	padding-right: 12px;
	padding-left: 12px;
}
/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
		padding-right: 12px;
		padding-left: 12px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
}
@media (min-width: 800px) {
	.search-resultset {
		display: flex;
		flex-direction: column;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.mobile-edge {
		display: none;
	}
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
