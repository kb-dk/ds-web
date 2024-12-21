<template>
	<div class="search-container">
		<div class="search-and-results">
			<TransitionGroup name="result">
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
								<SearchResults
									:search-results="searchResultStore.searchResult"
									:num-found="searchResultStore.numFound"
								/>
							</div>
							<Transition
								name="result"
								mode="out-in"
							>
								<div v-if="searchResultStore.searchResult.length == 0 && !searchResultStore.loading">
									<NoHits />
								</div>
							</Transition>
							<Pagination
								v-show="searchResultStore.searchResult.length > 0"
								:items-per-page="Number(searchResultStore.rowCount)"
								:total-hits="searchResultStore.numFound"
								:num-pages-to-show="numPagesToShow"
							/>
						</div>
					</div>
				</div>

				<div
					v-if="route.fullPath === '/find'"
					key="2"
					class="container"
				>
					<Transition
						name="result"
						mode="out-in"
					>
						<NoHits />
					</Transition>
				</div>
			</TransitionGroup>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import SearchResults from '@/components/search/SearchResults.vue';
import { useI18n } from 'vue-i18n';
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router';
import Pagination from '@/components/search/Pager.vue';
import SearchOverhead from '@/components/search/SearchOverhead.vue';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import NoHits from '@/components/search/NoHits.vue';
import { Priority, Severity } from '@/types/NotificationType';

export default defineComponent({
	name: 'Search',
	components: {
		SearchResults,
		Pagination,
		SearchOverhead,
		NoHits,
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		const timeSearchStore = useTimeSearchStore();
		const router = useRouter();
		const route = useRoute();

		const numPagesToShow = ref(window.innerWidth < 850 ? 3 : 8);
		const { t } = useI18n();

		const errorManager = inject('errorManager') as ErrorManagerType;
		onMounted(() => {
			// we set the title of the archive here - needed if we go back from a page that sets it otherwise.
			window.addEventListener('resize', () => {
				numPagesToShow.value = window.innerWidth < 850 ? 3 : 8;
			});
			document.title = t('app.titles.frontpage.archive.name') as string;
			const pastPage = router.options.history.state.back as string;
			if (pastPage && pastPage.startsWith('/post/') && searchResultStore.searchResult.length !== 0) {
				document.title = (t('app.titles.search') +
					'"' +
					route.query.q +
					'"' +
					t('app.titles.frontpage.archive.suffix')) as string;
				searchResultStore.loading = false;
			} else {
				searchResultStore.resetFilters();
				if (route.query.q !== undefined) {
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
								errorManager.submitCustomError(
									'malformeduri',
									t('error.infoError.title'),
									t('error.malformeduri'),
									Severity.ERROR,
									false,
									Priority.MEDIUM,
								);
							} else {
								// General search error happened here so message to user should be generel
								errorManager.submitCustomError(
									'searchfailed',
									t('error.searchfailed'),
									'',
									Severity.INFO,
									false,
									Priority.LOW,
								);
							}
						}
					}
					searchResultStore.setFiltersFromURL(routeFacetQueries as string[]);
					timeSearchStore.setFiltersFromUrl(routeFacetQueries as string[]);
					searchResultStore.getSearchResults(route.query.q as string);
					document.title = (t('app.titles.search') +
						'"' +
						route.query.q +
						'"' +
						t('app.titles.frontpage.archive.suffix')) as string;
				} else if (route.query.q === undefined) {
					searchResultStore.resetSearch();
				}
			}
		});
		onUnmounted(() => {
			window.removeEventListener('resize', () => {
				numPagesToShow.value = window.innerWidth < 600 ? 3 : 8;
			});
		});
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
					timeSearchStore.setFiltersFromUrl(route.query.fq as string[]);
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
			numPagesToShow,
			route,
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
	top: -1px;
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
	width: 100%;
}

.search-resultset {
	display: flex;
	flex-direction: column;
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
