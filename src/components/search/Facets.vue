<template>
	<div class="facet-container">
		<div
			class="facet-box"
			v-for="(facet, i1) in currentFacets"
			:key="i1"
		>
			<div
				class="checkbox"
				v-for="(singleFacet, index2) in simplifyFacets(facet)"
				:key="index2 + 'facet' + lastUpdate"
			>
				<kb-checkboxcomponent
					:fqkey="i1"
					:title="singleFacet[0]"
					:number="singleFacet[1]"
					:value="filterExists(i1, singleFacet[0])"
					:inslide="index2"
					:show="showFacets"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import './checkbox-component';
import { useSearchResultStore } from '@/store/searchResults';

export default defineComponent({
	name: 'Facets',
	data: () => ({
		showFacets: true,
		currentFacets: new Array<unknown>(),
		lastUpdate: 0,
	}),

	props: {
		facetResults: { type: Object, required: true },
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		return { searchResultStore };
	},

	created() {
		window.addEventListener('filter-update', (event) => {
			this.updateFilters(event as CustomEvent);
			event.stopPropagation();
			event.preventDefault();
		});

		this.showFacets = false;

		this.$watch(
			() => this.facetResults,
			(newFacets: Array<unknown>, prevFacets: Array<unknown>) => {
				if (newFacets !== prevFacets) {
					this.showFacets = true;
					let sum = '';
					Object.entries(prevFacets).forEach(([key, value]) => {
						sum += value;
					});
					setTimeout(
						() => {
							this.currentFacets = newFacets;
							this.lastUpdate = new Date().getTime();
							//console.log(this.currentFacets);
							this.showFacets = false;
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
			if (e.detail.add) {
				this.searchResultStore.addFilter(e.detail.filter);
			} else {
				this.searchResultStore.removeFilter(e.detail.filter);
			}
			this.searchResultStore.getSearchResults(this.searchResultStore.currentQuery);
		},
		// A simple method to arrange the facets in an orderly fasion, so they're easier to loop through.
		// Might not be relevant when we know more about the backend structure.
		simplifyFacets(facet: Array<unknown>) {
			const array: Array<unknown> = [];
			let entry: Array<unknown> = [];
			facet.forEach((facet, i) => {
				if (i % 2 == 0) {
					if (i !== 0) {
						entry = [];
					}
					entry.push(facet);
				} else {
					entry.push(facet);
					array.push(entry);
				}
			});
			return array;
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
