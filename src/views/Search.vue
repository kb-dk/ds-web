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
							<Transition name="fade">
								<div
									v-show="!searchResultStore.loading && searchResultStore.numFound > 0"
									class="page-count"
								>
									{{ Number(searchResultStore.start) + 1 }} - {{ calcRowCount }} {{ $t('search.outOf') }}
									{{
										searchResultStore.numFound > 1000
											? '1000+'
											: new Intl.NumberFormat('de-DE').format(searchResultStore.numFound)
									}}
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
					v-if="route.query.q === undefined"
					class="container find"
				>
					<h1>{{ t('find.headline') }}</h1>
					<p>{{ t('find.subtitle') }}</p>
					<h2>{{ t('find.maybeYouWantTo') }}</h2>
					<div class="extra-options">
						<router-link :to="searchResultStore.previousRoute">
							<span class="material-icons tune">tune</span>
							{{ t('find.restoreFilters') }}
						</router-link>
						<router-link :to="{ name: 'Home' }">{{ t('find.GoToFrontpage') }}</router-link>
					</div>
					<EdgedContentArea
						:lines="true"
						:title="$t('search.mainCategories')"
						class="main-categories-header"
						:reverse="true"
					>
						<template #content>
							<div class="showcase-container">
								<MainCategories
									:title="$t('timeSearch.searchCategories')"
									text="white"
									:subtitle="$t('timeSearch.searchCategoriesSubtitle')"
									:show-header="false"
								></MainCategories>
							</div>
						</template>
					</EdgedContentArea>
					<ContactUs
						class="contact-us"
						:relative-position="false"
					></ContactUs>
					<div class="expanded-area"></div>
				</div>
				<div
					v-if="route.fullPath === '/find' && route.query.q !== undefined"
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
import { computed, defineComponent, inject, onMounted, onUnmounted, ref, watch } from 'vue';
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
import { normalizeFq } from '@/utils/filter-utils';
import EdgedContentArea from '@/components/global/content-elements/EdgedContentArea.vue';
import MainCategories from '@/components/common/MainCategories.vue';
import ContactUs from '@/components/search/ContactUs.vue';
export default defineComponent({
	name: 'Search',
	components: {
		SearchResults,
		Pagination,
		SearchOverhead,
		NoHits,
		EdgedContentArea,
		MainCategories,
		ContactUs,
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		const timeSearchStore = useTimeSearchStore();
		const router = useRouter();
		const route = useRoute();
		const queryLimitReached = ref(false);

		const numPagesToShow = ref(window.innerWidth < 850 ? 3 : 8);
		const { t } = useI18n();

		const errorManager = inject('errorManager') as ErrorManagerType;
		const updateResizeProperty = () => {
			numPagesToShow.value = window.innerWidth < 850 ? 3 : 8;
		};

		const calcRowCount = computed(() => {
			const rowCount = searchResultStore.pageNumber * Number(searchResultStore.rowCount);
			return rowCount < searchResultStore.numFound ? rowCount : searchResultStore.numFound;
		});

		onMounted(() => {
			// we set the title of the archive here - needed if we go back from a page that sets it otherwise.
			window.addEventListener('resize', updateResizeProperty);
			document.title = t('app.titles.frontpage.archive.name') as string;
			const pastPage = router.options.history.state.back as string;
			if (pastPage && pastPage.startsWith('/post/') && searchResultStore.searchResult.length !== 0) {
				document.title = (t('app.titles.search') +
					' "' +
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

					if (searchResultStore.filterQueryLength > 900) {
						searchResultStore.queryLimitReached = true;
					}
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
					setCurrentTitleForPage();
				} else if (route.query.q === undefined) {
					searchResultStore.resetSearch();
				}
			}
		});
		onUnmounted(() => {
			window.removeEventListener('resize', updateResizeProperty);
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

					if (searchResultStore.filterQueryLength < 900) {
						searchResultStore.queryLimitReached = false;
					}
					if (!queryLimitReached.value) {
						searchResultStore.setFiltersFromURL(route.query.fq as string[]);
						searchResultStore.setSortFromURL(route.query.sort as string);
						searchResultStore.setCurrentQueryFromURL(route.query.q as string);
						searchResultStore.setRowCountFromURL(route.query.rows as string);
						timeSearchStore.setFiltersFromUrl(route.query.fq as string[]);
						searchResultStore.getSearchResults(route.query.q as string);

						setCurrentTitleForPage();
					}
					if (searchResultStore.filterQueryLength > 900) {
						searchResultStore.queryLimitReached = true;
					}
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

		const setCurrentTitleForPage = () => {
			if (route.query.q !== '*:*') {
				document.title = (t('app.titles.search') +
					'"' +
					route.query.q +
					'"' +
					t('app.titles.frontpage.archive.suffix')) as string;
			} else {
				const fq = normalizeFq(route.query.fq as string[]);
				if (fq && fq.length > 0) {
					if (fq.length === 1) {
						if (fq[0].includes('startTime')) {
							const decoded = decodeURIComponent(fq[0]);
							const timeRange = decoded.split('[')[1].split(']')[0];
							let [startRaw, endRaw] = timeRange.split(' TO ');
							let startDate = new Date(startRaw);
							startDate.setUTCDate(startDate.getUTCDate() + 1);
							let endDate = new Date(endRaw);
							const formatDate = (date: Date) => {
								const dd = String(date.getUTCDate()).padStart(2, '0');
								const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
								const yyyy = date.getUTCFullYear();
								return `${dd}-${mm}-${yyyy}`;
							};
							document.title = `${t('app.titles.PeriodSearch')} ${formatDate(startDate)} ${t(
								'app.titles.to',
							)} ${formatDate(endDate)}`;
						} else if (
							fq[0].includes('temporal_start_day_da') ||
							fq[0].includes('temporal_start_month') ||
							fq[0].includes('temporal_start_hour_da')
						) {
							const decoded = decodeURIComponent(fq[0]);
							const splitFilter = decoded.split(':');
							const allParamString = splitFilter[1].replace(')', '').replace('(', '');
							const filterParams = allParamString.split(' OR ');
							document.title = `${t('app.titles.search')} ${filterParams.length} ${t(
								'app.titles.' + splitFilter[0],
								filterParams.length,
							)}`;
						} else {
							const allFilters = [] as string[];
							let filterTitle = '';
							fq.forEach((filter) => {
								const decoded = decodeURIComponent(filter);
								const fqPart = decoded.split('fq=')[1] || decoded; // fallback if no 'fq='

								// Only slice if parentheses are present
								let clean = fqPart;
								if (fqPart.startsWith('(') && fqPart.endsWith(')')) {
									clean = fqPart.slice(1, -1);
								}
								const filters = clean.split(' OR ').map((part) => {
									const parts = part.split(':');
									filterTitle = parts[0];
									return decodeURIComponent(parts[1]);
								});

								allFilters.push(...filters);
							});

							let formattedFilters = '';
							if (allFilters.length === 1) {
								formattedFilters = allFilters[0];
							} else if (allFilters.length === 2) {
								formattedFilters = `${allFilters[0]} og ${allFilters[1]}`;
							} else if (allFilters.length > 2) {
								const allButLast = allFilters.slice(0, -1).join(', ');
								const last = allFilters[allFilters.length - 1];
								formattedFilters = `${allButLast} og ${last}`;
							}

							document.title = `${t('app.titles.SearchWith')} ${t(
								'app.titles.' + filterTitle,
								allFilters.length,
							)} ${formattedFilters}`;
						}
					} else {
						document.title = `${t('app.titles.SearchWith')} ${fq.length} ${t('app.titles.filter', fq.length)}`;
					}
				} else {
					document.title = `${t('app.titles.default')}`;
				}
			}
		};

		return {
			searchResultStore,
			numPagesToShow,
			route,
			updateResizeProperty,
			router,
			t,
			queryLimitReached,
			calcRowCount,
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

.expanded-area {
	height: 3vw;
}

.tune {
	padding-right: 5px;
}

.extra-options {
	display: flex;
	gap: 25px;
	flex-direction: column;
	margin-bottom: 45px;
}

.extra-options a {
	color: white;
	background-color: #002e70;
	border-color: #f2f4f8;
	text-decoration: none;
	padding: 1px 2rem;
	line-height: 1.25rem;
	border-radius: 5px;
	height: 45px;
	display: flex;
	align-items: center;
	transition:
		color 0.15s ease-in-out,
		background-color 0.15s ease-in-out,
		border-color 0.15s ease-in-out,
		box-shadow 0.15s ease-in-out;
}

.extra-options a:hover {
	background-color: #c4f1ed;
	color: #002e70;
	border-color: #002e70;
	outline: 1px solid #002e70;
}

.find h1 {
	font-weight: normal;
}

.find h2 {
	color: #002e70;
}

.container {
	text-align: left;
	margin-right: auto;
	margin-left: auto;
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
	.extra-options {
		flex-direction: row;
	}
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
	.extra-options {
		margin-bottom: 0px;
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
		padding-right: 12px;
		padding-left: 12px;
	}
}
</style>
