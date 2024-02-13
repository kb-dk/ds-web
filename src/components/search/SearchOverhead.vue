<template>
	<div class="container">
		<div class="row">
			<div class="hit-count">
				<div class="result-options">
					<div class="hits">
						<HitCount
							:hit-count="searchResultStore.numFound"
							:no-hits="searchResultStore.noHits"
							:query="searchResultStore.currentQuery !== undefined ? searchResultStore.currentQuery : ''"
						/>
					</div>
					<Sort v-if="searchResultStore.searchResult.length > 0" />
				</div>
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
.result-options {
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
</style>
