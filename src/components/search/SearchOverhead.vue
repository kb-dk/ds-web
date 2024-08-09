<template>
	<div class="container">
		<div class="row">
			<div class="hit-count">
				<div class="result-options">
					<div class="hits">
						<HitCount
							:hit-count="searchResultStore.numFound"
							:no-hits="searchResultStore.noHits"
							:query="searchResultStore.lastSearchQuery !== undefined ? searchResultStore.lastSearchQuery : ''"
						/>
					</div>
					<!-- <Sort v-if="searchResultStore.searchResult.length > 0" /> -->
				</div>
				<div class="filter-options">
					<button
						v-if="searchResultStore.searchResult.length > 0"
						ref="toggleFacetsButton"
						role="switch"
						aria-checked="true"
						class="filter-button"
						@click="toggleFacets()"
					>
						<span class="material-icons">tune</span>
						<span class="filter-button-text">
							{{ searchResultStore.showFacets ? $t('search.hideFilters') : $t('search.showFilters') }}
						</span>
					</button>
				</div>
				<Facets :facet-results="searchResultStore.facetResult" />
				<div class="sort-options">
					<Sort></Sort>
					<div class="search-options">
						<Transition name="fade">
							<div
								v-show="!searchResultStore.loading && searchResultStore.numFound > 0"
								class="page-count"
							>
								{{ t('search.page') }}
								{{
									(Number(searchResultStore.start) + Number(searchResultStore.rowCount)) /
									Number(searchResultStore.rowCount)
								}}
								{{ t('search.of') }}
								{{
									new Intl.NumberFormat('de-DE').format(
										Math.ceil(searchResultStore.numFound / Number(searchResultStore.rowCount)),
									)
								}}
							</div>
						</Transition>
						<button
							:class="
								searchResultStore.loading
									? 'display-option list loading'
									: searchResultStore.resultGrid
									  ? 'display-option list'
									  : 'display-option list active'
							"
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
import { defineComponent, ref } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Facets from '@/components/search/Facets.vue';

import Sort from './Sort.vue';
import HitCount from './HitCount.vue';

export default defineComponent({
	name: 'SearchOverhead',
	components: {
		HitCount,
		Sort,
		Facets,
	},
	props: {
		showFacets: { type: Boolean },
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		const router = useRouter();
		const route = useRoute();
		const { t } = useI18n();
		const toggleFacetsButton = ref<HTMLButtonElement | null>(null);

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

		return { searchResultStore, setGridAndLoadResults, t, toggleFacets, toggleFacetsButton };
	},
});
</script>

<style scoped>
.display-option {
	color: #002e70;
	background-color: transparent;
	border: 0px;
	cursor: pointer;
	padding: 0px;
	width: 30px;
	height: 30px;
	border-bottom: 1px solid transparent;
}

.display-option.list {
	position: relative;
	margin-left: 30px;
	margin-right: 5px;
}

.display-option.active {
	border-bottom: 2px solid #002e70;
	box-sizing: border-box;
}

.display-option.loading {
	pointer-events: none;
	color: grey;
}

.display-option.list span {
	font-size: 32px;
	position: relative;
	top: -2px;
}

.container {
	min-height: 91px;
}

.result-options {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
}

.sort-options {
	display: flex;
	justify-content: space-between;
}

.filter-options {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
}

.buffer {
	height: 20px;
	width: 100%;
}

.hits {
	margin-right: auto;
	margin-left: 0;
}

.search-options {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.page-count {
	font-size: 16px;
	display: inline-block;
}

.filter-button {
	border: 0px;
	background-color: transparent;
	line-height: 24px;
	cursor: pointer;
	padding: 10px 10px;
	margin: 10px 0px;
	margin-right: auto;
	margin-left: 0;
	background-color: #002e70;
	color: white;
	box-shadow:
		inset 1px 1px 2px #00000000,
		1px 1px 2px #00000029;
	border-radius: 4px;
	z-index: 1;
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
</style>
