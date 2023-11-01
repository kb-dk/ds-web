<template>
	<div class="facet-container">
		<div
			class="facet-box"
			v-for="(facet, i1) in currentFacets"
			:key="i1"
		>
			<div
				class="checkbox"
				v-for="(singleFacet, i2) in simplifyFacets(facet as string[])"
				:key="i2 + 'facet' + lastUpdate"
			>
				<kb-checkboxcomponent
					:fqkey="i1"
					:title="singleFacet[0]"
					:number="singleFacet[1]"
					:value="filterExists(i1.toString(), singleFacet[0])"
					:inslide="i2"
					:show="showFacets"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, onUnmounted, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { FacetResultType } from '@/types/GenericSearchResultTypes';

import '@/components/search/wc-facet-checkbox';

export default defineComponent({
	name: 'Facets',

	props: {
		facetResults: { type: Object as PropType<FacetResultType>, required: true },
	},

	setup(props) {
		const searchResultStore = useSearchResultStore();
		const showFacets = ref(false);
		const currentFacets = ref(Object as unknown as FacetResultType);
		const lastUpdate = ref(0);

		onMounted(() => {
			currentFacets.value = props.facetResults;
			showFacets.value = true;

			window.addEventListener('filter-update', filterUpdateHelper);

			watch(
				() => props.facetResults,
				(newFacets: FacetResultType, prevFacets: FacetResultType) => {
					if (newFacets !== prevFacets) {
						showFacets.value = false;
						let sum = '';
						Object.entries(prevFacets).forEach(([key, value]) => {
							sum += value;
						});
						setTimeout(
							() => {
								currentFacets.value = newFacets;
								lastUpdate.value = new Date().getTime();
								showFacets.value = true;
							},
							sum.length <= 0 ? 0 : 600,
						);
					}
				},
			);
		});

		onUnmounted(() => {
			window.removeEventListener('filter-update', filterUpdateHelper);
		});

		const filterExists = (key: string, title: string) => {
			return searchResultStore.filters.includes(`fq=${key}:"${title}"`);
		};

		const filterUpdateHelper = (e: Event) => {
			updateFilters(e as CustomEvent);
		};

		const updateFilters = (e: CustomEvent) => {
			e.stopPropagation();
			e.preventDefault();
			if (e.detail.add) {
				searchResultStore.addFilter(e.detail.filter);
			} else {
				searchResultStore.removeFilter(e.detail.filter);
			}
			searchResultStore.getSearchResults(searchResultStore.currentQuery);
		};
		// A simple method to arrange the facets in an orderly fasion, so they're easier to loop through.
		// Might not be relevant when we know more about the backend structure.
		const simplifyFacets = (facet: Array<string>) => {
			const allPairedFacets: Array<string[]> = [];
			let facetPair: Array<string> = [];
			facet.forEach((facet, i) => {
				if (i % 2 === 0) {
					if (i !== 0) {
						facetPair = [];
					}
					facetPair.push(facet);
				} else {
					facetPair.push(facet);
					allPairedFacets.push(facetPair);
				}
			});
			return allPairedFacets;
		};

		return { showFacets, currentFacets, lastUpdate, searchResultStore, filterExists, updateFilters, simplifyFacets };
	},
});
</script>

<style lang="scss" scoped>
.facet-container {
	display: flex;
	transition: all 1.3s linear;
	height: auto;
	flex-direction: column;
}
.facet-box {
	margin-bottom: 15px;
	padding: 10px;
}
.facet-box:empty {
	display: none;
}
@media (min-width: 800px) {
	.facet-container {
		flex-direction: column;
	}
}
</style>
