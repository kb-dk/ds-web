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
					<Sort v-if="searchResultStore.searchResult.length > 0" />
				</div>
				<div class="filter-options">
					<button
						v-if="searchResultStore.searchResult.length > 0"
						class="filter-button"
						@click="searchResultStore.toggleShowFacets(!searchResultStore.showFacets)"
					>
						<span class="material-icons">tune</span>
						<span class="filter-button-text">
							{{ showFacets ? $t('search.hideFilters') : $t('search.showFilters') }}
						</span>
					</button>
					<Transition name="fade">
						<div
							v-if="!searchResultStore.loading && searchResultStore.numFound > 0"
							class="page-count"
						>
							side {{ (Number(searchResultStore.start) + 10) / 10 }}/{{ Math.ceil(searchResultStore.numFound / 10) }}
						</div>
					</Transition>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';

import Sort from './Sort.vue';
import HitCount from './HitCount.vue';

export default defineComponent({
	name: 'SearchOverhead',
	components: {
		Sort,
		HitCount,
	},
	props: {
		showFacets: { type: Boolean },
	},

	setup() {
		const searchResultStore = useSearchResultStore();

		return { searchResultStore };
	},
});
</script>

<style scoped>
.container {
	min-height: 91px;
}

.result-options {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
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

.page-count {
	font-size: 16px;
}

.filter-button {
	border: 0px;
	background-color: transparent;
	height: 24px;
	line-height: 24px;
	cursor: pointer;
	padding: 0;
	margin: 10px 0px;
	margin-right: auto;
	margin-left: 0;
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
