<template>
	<div class="container">
		<div class="row">
			<div class="hit-count">
				<div :class="['filter-options', { disabled: searchResultStore.loading }]">
					<div :class="`filter-buttons ${searchResultStore.showFacets ? 'filter-buttons-top-filter-active' : ''}`">
						<button
							ref="toggleFacetsButton"
							role="switch"
							aria-checked="true"
							class="filter-button"
							:data-testid="addTestDataEnrichment('button', 'search-overhead', 'toggle-filters', 0)"
							@click="toggleFacets()"
						>
							<span class="material-icons">{{ !searchResultStore.showFacets ? 'tune' : 'close' }}</span>
							<span class="filter-button-text btn-medium">
								{{ searchResultStore.showFacets ? $t('search.hideFilters') : $t('search.showFilters') }}
							</span>
						</button>
						<button
							v-if="
								searchResultStore.filters.length > 0 ||
								searchResultStore.channelFilters.length > 0 ||
								searchResultStore.categoryFilters.length > 0
							"
							class="reset label-small"
							:data-testid="addTestDataEnrichment('button', 'search-overhead', 'reset-filters', 0)"
							@click="resetFilters()"
						>
							<span>×</span>
							{{ $t('search.resetFilters') }}
						</button>
					</div>
				</div>
				<div
					v-if="searchResultStore.numFound !== 0 || (searchResultStore.numFound !== 0 && searchResultStore.loading)"
					class="result-options"
				>
					<div class="hits">
						<HitCount
							:hit-count="searchResultStore.numFound"
							:no-hits="searchResultStore.noHits"
							:query="searchResultStore.lastSearchQuery !== undefined ? searchResultStore.lastSearchQuery : ''"
						/>
					</div>
				</div>
				<div class="filter-container"><CurrentFilters /></div>
				<div
					v-if="searchResultStore.numFound !== 0 || (searchResultStore.numFound !== 0 && searchResultStore.loading)"
					class="sort-options"
				>
					<Sort></Sort>
					<div class="search-options">
						<div class="page-result-display">
							<Transition name="fade">
								<div
									v-show="!searchResultStore.loading && searchResultStore.numFound > 0"
									class="page-count"
								>
									<p class="label-small">
										{{ t('search.page') }}
										{{ searchResultStore.pageNumber }}
										{{ t('search.of') }}
										{{ searchResultStore.maxPages }}
									</p>
								</div>
							</Transition>
							<Transition name="fade">
								<div
									v-show="!searchResultStore.loading && searchResultStore.numFound > 0"
									class="page-count"
								>
									<p class="label-small">
										{{ t('search.showing') }} {{ Number(searchResultStore.start) + 1 }} - {{ calcRowCount }}
									</p>
								</div>
							</Transition>
						</div>

						<button
							:class="
								searchResultStore.loading
									? 'display-option list loading'
									: searchResultStore.resultGrid
									  ? 'display-option list'
									  : 'display-option list active'
							"
							:data-testid="addTestDataEnrichment('button', 'search-overhead', 'toggle-list', 0)"
							@click="setGridAndLoadResults(false)"
						>
							<span class="material-icons">toc</span>
						</button>
						<button
							:class="
								searchResultStore.loading
									? 'display-option grid loading'
									: searchResultStore.resultGrid
									  ? 'display-option grid active'
									  : 'display-option grid'
							"
							class="display-option grid"
							:data-testid="addTestDataEnrichment('button', 'search-overhead', 'toggle-grid', 0)"
							@click="setGridAndLoadResults(true)"
						>
							<span class="material-icons">apps</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { cloneRouteQuery, normalizeFq } from '@/utils/filter-utils';
import Sort from './Sort.vue';
import HitCount from './HitCount.vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import CurrentFilters from '@/components/search/CurrentFilters.vue';
import { resetAllSelectorValues } from '@/utils/time-search-utils';
import { Severity } from '@/types/NotificationType';
import {
	days,
	timeslots,
	months,
	startDate,
	startYear,
	endDate,
	endYear,
} from '../common/timeSearch/TimeSearchInitValues';

export default defineComponent({
	name: 'SearchOverhead',
	components: {
		HitCount,
		Sort,
		CurrentFilters,
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		const router = useRouter();
		const route = useRoute();
		const { t } = useI18n();
		const toggleFacetsButton = ref<HTMLButtonElement | null>(null);
		const tvToggled = ref(true);
		const radioToggled = ref(true);

		const calcRowCount = computed(() => {
			const rowCount = searchResultStore.pageNumber * Number(searchResultStore.rowCount);
			return rowCount < searchResultStore.numFound ? rowCount : searchResultStore.numFound;
		});
		onMounted(() => {
			searchResultStore.toggleShowFacets(false);
		});

		const resetFilters = () => {
			const routeQueries = cloneRouteQuery(route);
			searchResultStore.resetFilters();
			resetAllSelectorValues(days.value);
			resetAllSelectorValues(timeslots.value);
			resetAllSelectorValues(months.value);
			searchResultStore.queryLimitReached = false;
			if (startDate.value !== null && endDate.value !== null) {
				startDate.value.setTime(startYear.value.getTime());
				endDate.value.setTime(endYear.value.getTime());
			} else {
				startDate.value = new Date();
				endDate.value = new Date();
				startDate.value.setTime(startYear.value.getTime());
				endDate.value.setTime(endYear.value.getTime());
			}

			if (routeQueries.q === '*:*') {
				delete routeQueries.q;
			}
			delete routeQueries.start;
			delete routeQueries.fq;
			delete routeQueries.sort;

			router.push({
				name: 'Search',
				query: routeQueries,
			});
		};

		const toggleFacets = () => {
			searchResultStore.toggleShowFacets(!searchResultStore.showFacets);
			toggleFacetsButton.value?.setAttribute('aria-checked', searchResultStore.showFacets.toString());
		};

		const setGridAndLoadResults = (grid: boolean) => {
			if (searchResultStore.resultGrid !== grid) {
				searchResultStore.setResultGrid(grid);
				searchResultStore.setStart('0');
				const start = '0';
				const rows = grid ? 40 : 10;
				const query = { ...route.query, start, rows };
				router.push({ query });
			}
		};

		return {
			searchResultStore,
			setGridAndLoadResults,
			t,
			toggleFacets,
			toggleFacetsButton,
			tvToggled,
			radioToggled,
			resetFilters,
			addTestDataEnrichment,
			calcRowCount,
		};
	},
});
</script>

<style scoped>
.page-result-display {
	display: flex;
	flex-direction: column;
	text-align: right;
}

.display-option {
	background-color: transparent;
	border: 0px;
	cursor: pointer;
	padding: 0px;
	width: 30px;
	height: 30px;
	border-bottom: 1px solid transparent;
	color: grey;
}

.filter-container {
	z-index: 1;
	position: relative;
}

.display-option.list {
	position: relative;
	margin-left: 30px;
	margin-right: 5px;
	padding-left: 2px;
}

.hit-count {
	z-index: 0;
	position: relative;
}

.display-option.active {
	border-bottom: 2px solid #002e70;
	box-sizing: border-box;
	color: #002e70;
}

.display-option.list,
.display-option.grid {
	top: 2px;
	position: relative;
}

.display-option.loading {
	pointer-events: none;
	color: grey;
}

.display-option.list span {
	font-size: 35px;
	position: relative;
	top: -5px;
	left: -5px;
}

.container {
	min-height: 91px;
}

.type-toggles {
	position: relative;
	display: flex;
	gap: 10px;
	width: 100%;
	padding-bottom: 8px;
	padding-top: 10px;
	height: 44px;
}

.result-options {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	min-height: 47px;
	z-index: 0;
	position: relative;
	padding-top: 50px;
	padding-bottom: 8px;
}

.sort-options {
	position: relative;
	display: flex;
	justify-content: space-between;
	z-index: 0;
	flex-direction: column-reverse;
	padding-bottom: 8px;
	padding-top: 40px;
}

.filter-options {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	flex-direction: column-reverse;
	z-index: 1;
	position: relative;
	transition: margin-bottom 0.19s linear 0.27s;
}

.filter-options.disabled button {
	pointer-events: none;
	cursor: default;
	color: #757575 !important;
	background-color: rgb(250, 250, 250);
	transition: all 0.2s linear 0s;
	border: 1px solid #7575755e;
}

.filter-options.disabled button .dark-bar {
	background-color: #757575 !important;
}

.filter-options.disabled button .dark-bar .close:before,
.filter-options.disabled button .dark-bar .close:after {
	background-color: #757575 !important;
}

.buffer {
	height: 20px;
	width: 100%;
}

.hits {
	width: 100%;
	margin-right: auto;
	margin-left: 0;
}

.search-options {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	padding-top: 5px;
	padding-bottom: 5px;
}

.page-count {
	display: inline-block;
}
.page-count > .label-small {
	margin: 0;
}
.filter-button {
	display: flex;
	position: relative;
	border: 1px solid #002e70;
	line-height: 24px;
	cursor: pointer;
	margin: 10px 0px;
	margin-right: auto;
	margin-left: 0;
	background-color: #002e70;
	color: white;
	border-radius: 4px;
	z-index: 0;
	font-size: 20px;
	padding: 6px 12px 9px 12px;
	transition: all 0.25s linear 0s;
	align-items: baseline;
}
.filter-button:hover {
	background-color: #c4f1ed;
	color: #002e70;
}
.filter-button[aria-checked='true'] {
}
.filter-button:hover .material-icons {
}

.filter-button .material-icons {
	font-size: 24px;
	position: relative;
	top: 5px;
}

.material-icons {
	display: flex;
	flex-wrap: wrap;
}

.filter-button-text {
	padding-left: 5px;
}

.dark-bar {
	width: 50px;
	background-color: #d5d5d5;
	height: 24px;
	border-radius: 20px;
	margin-left: 20px;
	transition: all 0.1s linear 0s;
}

.dark-bar.open {
	background-color: #002e70;
}

.dark-bar .dot {
	width: 18px;
	height: 18px;
	display: block;
	background-color: white;
	border-radius: 15px;
	top: 3px;
	left: 3px;
	position: relative;
	transition: all 0.1s linear 0s;
}

.dark-bar.open .dot {
	left: 29px;
}

.dark-bar .dot .close:before {
	content: '';
	display: block;
	width: 7px;
	height: 2px;
	background-color: #002e70;
	transform-origin: center;
	transform: rotateZ(45deg);
	top: 10px;
	left: 2px;
	position: relative;
}
.dark-bar .dot .close:after {
	content: '';
	display: block;
	width: 12px;
	height: 2px;
	background-color: #002e70;
	transform-origin: center;
	transform: rotateZ(-45deg);
	top: 6px;
	position: relative;
	left: 5px;
}

.dark-bar .dot .check:before {
	content: '';
	display: block;
	width: 15px;
	height: 2px;
	background-color: #757575;
	transform-origin: center;
	transform: rotateZ(45deg);
	top: 8px;
	left: 1px;
	position: relative;
	border-radius: 15px;
}
.dark-bar .dot .check:after {
	content: '';
	display: block;
	width: 15px;
	height: 2px;
	background-color: #757575;
	transform-origin: center;
	transform: rotateZ(-45deg);
	top: 6px;
	left: 1px;
	position: relative;
	border-radius: 15px;
}

.reset {
	cursor: pointer;
	padding: 10px 8px 10px 7px;
	width: fit-content;
	display: flex;
	align-items: center;
	border: 1px solid #f7ae3b;
	background: #ffffff;
	color: #002e70;
	border-radius: 4px;
	transition: all 0s linear 0s;
	background-color: #f7ae3b;
	height: 26px;
	z-index: 1;
	box-shadow:
		inset 1px 1px 2px #00000000,
		1px 1px 2px #00000029;
	margin-left: 35px;
	transition: all 0.25s linear 0s;
}
.reset:hover {
	border: 1px solid #002e70;
}

.reset span {
	font-size: 30px;
	padding-bottom: 5px;
	padding-right: 4px;
}

.filter-buttons {
	position: relative;
	margin-right: auto;
	display: flex;
	align-items: center;
	align-content: center;
	flex-wrap: nowrap;
	flex-direction: row;
}

@media (min-width: 640px) {
	.filter-options {
		flex-direction: row;
	}
	.filter-button.open {
		margin-bottom: calc(-2vw + -5px);
	}
	.type-toggles {
		width: auto;
		padding-bottom: 0px;
	}
	.sort-options {
		flex-direction: row;
	}
	.search-options {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.filter-button-bottom {
		top: calc(-2vw + -5px);
	}
}

@media (min-width: 2000px) {
	.filter-button-bottom {
		top: calc(-2vw + -10px);
	}
	.filter-options.open {
		margin-bottom: calc(-2vw + -10px);
	}
}

@media (min-width: 3000px) {
	.filter-button-bottom {
		top: calc(-2vw + -15px);
	}
	.filter-options.open {
		margin-bottom: calc(-2vw + -15px);
	}
}

@media (min-width: 4000px) {
	.filter-button-bottom {
		top: calc(-1vw + 10px);
	}
	.filter-options.open {
		margin-bottom: calc(-1vw + 10px);
	}
}
</style>
