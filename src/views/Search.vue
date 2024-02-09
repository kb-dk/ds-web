<template>
	<div class="search-box">
		<div
			ref="searchContainer"
			class="search-container"
		>
			<div class="mobile-edge edge"></div>
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
							<div class="result-options">
								<div class="hits">
									<HitCount
										:hit-count="searchResultStore.numFound"
										:no-hits="searchResultStore.noHits"
										:query="searchResultStore.currentQuery !== undefined ? searchResultStore.currentQuery : ''"
									/>
								</div>
								<Sort />
							</div>
							<button
								class="filter-button"
								@click="toggleFacets(!showFacets)"
							>
								<span class="material-icons">tune</span>
								<span class="filter-button-text">
									{{ showFacets ? $t('search.hideFilters') : $t('search.showFilters') }}
								</span>
							</button>
						</div>
						<div v-else-if="searchResultStore.searchFired">
							<div
								class="buffer"
								v-if="searchResultStore.loading"
							></div>
							<div v-else>
								<NoHits />
							</div>
						</div>
					</div>
				</div>
				<div
					key="2"
					class="container"
					v-if="searchResultStore.searchResult.length > 0"
				>
					<div class="row">
						<div class="search-resultset">
							<div
								class="search-facets active"
								ref="facetsContainer"
							>
								<div class="blur-bg"></div>
								<div class="facet-background">
									<button
										class="facet-close-button"
										@click="toggleFacets(false)"
									>
										<span class="material-icons">close</span>
									</button>
									<Facets
										@facet-update="updateFacetContainer"
										:facet-results="searchResultStore.facetResult"
									/>
								</div>
							</div>

							<div
								ref="resultContainer"
								class="search-results fullwidth"
							>
								<SearchResults
									:search-results="searchResultStore.searchResult"
									:num-found="searchResultStore.numFound"
								/>
							</div>
						</div>
						<Pagination
							v-if="searchResultStore.numFound > 0"
							:itemsPerPage="itemsPerPage"
							:totalHits="searchResultStore.numFound"
							:numPagesToShow="numPagesToShow"
						/>
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
						:spots="mockdata1"
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
							:spots="mockdata2"
						></GridDisplay>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import HitCount from '@/components/search/HitCount.vue';
import SearchResults from '@/components/search/SearchResults.vue';
import SearchBarWrapper from '@/components/search/SearchBarWrapper.vue';
import Facets from '@/components/search/Facets.vue';
import GridDisplay from '@/components/common/GridDisplay.vue';
import NoHits from '@/components/search/NoHits.vue';
import gsap from 'gsap';
import { useRouter, useRoute, RouteLocationNormalizedLoaded } from 'vue-router';

//The import is actually used so had to silence TypeScript here - have no idea why compiler is angry
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import Pagination from '@/components/search/Pager.vue';
import Sort from '@/components/search/Sort.vue';

export default defineComponent({
	name: 'Search',
	components: {
		HitCount,
		SearchResults,
		SearchBarWrapper,
		Facets,
		GridDisplay,
		Pagination,
		Sort,
		NoHits,
	},

	setup() {
		const mockdata1 = ['1', '2', '3', '4', '5', '6', '7', '8'] as unknown as GenericSearchResultType[];
		const mockdata2 = ['1', '2', '3'] as unknown as GenericSearchResultType[];
		const facetsContainer = ref<HTMLElement | null>(null);
		const searchContainer = ref<HTMLElement | null>(null);
		const resultContainer = ref<HTMLElement | null>(null);

		const showFacets = ref(true);
		const searchResultStore = useSearchResultStore();
		const router = useRouter();
		const route = useRoute();

		const itemsPerPage = ref(10);
		const numPagesToShow = 8;

		onMounted(() => {
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
				if (routeFacetQueries) {
					searchResultStore.setFiltersFromURL(routeFacetQueries);
				}
				searchResultStore.getSearchResults(route.query.q as string);
			}
		});

		onUnmounted(() => {
			window.document.body.classList.remove('remove-body-scroll');
		});

		/* This is because Vue3 composition API has this weird bug that when a ref is wrapped in a v-if
		   the ref is not actually present in onMounted, which is super weird. But we can watch for when it enters.
		   https://github.com/vuejs/composition-api/issues/296
		*/
		watch(
			() => facetsContainer.value,
			(newValue: HTMLElement | null, oldValue: HTMLElement | null) => {
				if (facetsContainer.value && newValue !== oldValue) {
					window.innerWidth > 800 ? toggleFacets(true) : toggleFacets(false);
				}
			},
		);

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
				console.log('watcher in search found a change in the URL, so we do a check if we should search.');
				if (checkParamUpdate(newp, prevp) && route.query.q !== undefined) {
					if (checkIfSortIsChanged(newp.query.sort as string, prevp.query.sort as string)) {
						searchResultStore.resetStart();
					} else {
						searchResultStore.setStartFromURL(route.query.start as string);
					}
					searchResultStore.setFiltersFromURL(route.query.fq as string[]);
					searchResultStore.setSortFromURL(route.query.sort as string);
					searchResultStore.getSearchResults(route.query.q as string);
				}
				if (route.query.q === undefined) {
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
				newParams.query.sort !== prevParams.query.sort
			);
		};

		const updateFacetContainer = () => {
			window.innerWidth < 800 ? toggleFacets(false) : null;
		};

		const toggleFacets = (check: boolean) => {
			showFacets.value = check;
			if (showFacets.value) {
				facetsContainer.value?.classList.add('active');
				resultContainer.value?.classList.add('fullwidth');

				window.document.body.classList.add('remove-body-scroll');
			} else {
				facetsContainer.value?.classList.remove('active');
				resultContainer.value?.classList.remove('fullwidth');
				window.document.body.classList.remove('remove-body-scroll');
			}
		};

		return {
			searchResultStore,
			searchContainer,
			facetsContainer,
			resultContainer,
			showFacets,
			toggleFacets,
			updateFacetContainer,
			itemsPerPage,
			numPagesToShow,
			mockdata1,
			mockdata2,
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

h3 {
	padding-top: 20px;
}

.edge {
	height: 31px;
}

.buffer {
	height: 20px;
	width: 100%;
}

.result-options {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
}

.hits {
	margin-right: auto;
	margin-left: 0;
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
}

.hit-count {
	padding-top: 40px;
	padding-bottom: 40px;
}

.filter-button {
	border: 0px;
	background-color: transparent;
	height: 24px;
	line-height: 24px;
	cursor: pointer;
	padding: 0;
}

.filter-button .material-icons {
	font-size: 16px;
	position: relative;
	top: 2px;
}

.filter-button-text {
	padding-left: 5px;
	font-size: 16px;
}

.facet-close-button {
	border: 0px;
	background-color: transparent;
	font-size: 0px;
	position: absolute;
	top: 10px;
	z-index: 25;
	right: 10px;
	cursor: pointer;
}

.fullwidth {
	transition: all 0.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s;
}

.search-facets {
	transition: all 0.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s;
	min-width: 0px;
	margin-bottom: 20px;
	position: fixed;
	top: 0px;
	left: 0px;
	z-index: 5;
	background-color: white;
	overflow-y: scroll;
	height: 100vh;
	visibility: hidden;
	pointer-events: none;
	box-sizing: border-box;
	padding: 40px 15% 0px 15%;
	transform: translateX(-100%);
}

.search-facets.active {
	visibility: visible;
	pointer-events: all;
	transform: translateX(0%);
	width: 100%;
}

.search-results {
	position: relative;
	max-width: 100%;
	transition: all 0.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s;
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

	.search-facets {
		top: 20%;
		height: 60%;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		width: 70%;
	}

	.search-facets::-webkit-scrollbar-track {
		background-color: transparent;
	}

	.search-facets.active {
		width: 70%;
	}

	.fullwidth {
		max-width: calc(100%);
	}
}
@media (min-width: 800px) {
	.search-results {
		max-width: 100%;
	}

	.fullwidth {
		max-width: calc(100% - 330px);
	}

	.facet-background {
		background-color: rgba(30, 30, 30, 0.1);
	}
	.facet-close-button {
		display: none;
	}
	.search-facets {
		position: initial;
		background-color: initial;
		width: 0px;
		margin-right: 0px;
		overflow-y: initial;
		overflow-x: hidden;
		padding: 0px 0px;
		transform: translateX(0%);
		opacity: 0;
		box-shadow: initial;
	}
	.search-facets.active {
		width: 290px;
		margin-right: 30px;
		min-width: 300px;
		opacity: 1;
	}
	.search-resultset {
		display: flex;
		flex-direction: row;
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
