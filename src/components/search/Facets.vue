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
import { defineComponent, PropType } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { FacetResultType } from '@/types/GenericSearchResultTypes';

import '@/components/search/wc-facet-checkbox';

export default defineComponent({
	name: 'Facets',
	data: () => ({
		showFacets: false,
		currentFacets: Object as unknown as FacetResultType,
		lastUpdate: 0,
	}),

	props: {
		facetResults: { type: Object as PropType<FacetResultType>, required: true },
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		return { searchResultStore };
	},

	mounted() {
		this.currentFacets = this.facetResults;
		this.showFacets = true;
	},

	created() {
		window.addEventListener('filter-update', (event) => {
			this.updateFilters(event as CustomEvent);
			event.stopPropagation();
			event.preventDefault();
		});

		this.$watch(
			() => this.facetResults,
			(newFacets: FacetResultType, prevFacets: FacetResultType) => {
				if (newFacets !== prevFacets) {
					this.showFacets = false;
					let sum = '';
					Object.entries(prevFacets).forEach(([key, value]) => {
						sum += value;
					});
					setTimeout(
						() => {
							this.currentFacets = newFacets;
							this.lastUpdate = new Date().getTime();
							this.showFacets = true;
						},
						sum.length <= 0 ? 0 : 600,
					);
				}
			},
		);
	},
	methods: {
		filterExists(key: string, title: string) {
			return this.searchResultStore.filters.includes(`fq=${key}:"${title}"`);
		},
		updateFilters: function (e: CustomEvent) {
			/* Future coder - don't even ask, the line of code below took me hours.... 
				 I wanted to do it the right way: const routeQueries = { ...this.$route.query };
				 but no worki - instead I had to do this copy trickery below.
				 For more info on why this is broken:
				 https://github.com/vuejs/vue-router/issues/1182
				 **/
			//TODO the logic below could be split up into a couple of methods.
			//Lets do that when we know the functionality is solid and we refactor
			//the whole component to composition API
			const routeQueries = JSON.parse(JSON.stringify(this.$route.query));
			if (e.detail.add) {
				const newFilter = encodeURIComponent(e.detail.filter);
				if (!routeQueries.fq) {
					routeQueries.fq = [newFilter];
				} else if (Array.isArray(routeQueries.fq)) {
					routeQueries.fq.push(newFilter);
				} else {
					//This will only trigger if someone manipulates the url manually
					routeQueries.fq = [routeQueries.fq, newFilter];
				}
				this.searchResultStore.addFilter(`fq=${e.detail.filter}`);
			} else {
				const filterToRemove = encodeURIComponent(e.detail.filter);
				routeQueries.fq = routeQueries.fq.filter((item: string) => item !== filterToRemove);
				this.searchResultStore.removeFilter(`fq=${e.detail.filter}`);
			}
			this.$router.push({ query: routeQueries });
			this.searchResultStore.getSearchResults(this.searchResultStore.currentQuery);
		},
		// A simple method to arrange the facets in an orderly fasion, so they're easier to loop through.
		// Might not be relevant when we know more about the backend structure.
		simplifyFacets(facet: Array<string>) {
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
		},
	},
});
</script>

<style lang="scss" scoped>
.facet-container {
	display: flex;
	background-color: rgba(30, 30, 30, 0.1);
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
