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
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from 'vue-router';

import '@/components/search/wc-facet-checkbox';

export default defineComponent({
	name: 'Facets',

	props: {
		facetResults: { type: Object as PropType<FacetResultType>, required: true },
	},

	setup(props, { emit }) {
		const searchResultStore = useSearchResultStore();
		const showFacets = ref(false);
		const currentFacets = ref(Object as unknown as FacetResultType);
		const lastUpdate = ref(0);
		const route = useRoute();
		const router = useRouter();

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
			const filterString = `${key}:"${title}"`;
			return searchResultStore.filters.includes(`fq=${encodeURIComponent(filterString)}`);
		};

		const cloneRouteQuery = (route: RouteLocationNormalizedLoaded) => {
			/* Future coder - don't even ask, the line of code below took me hours....
         I wanted to do it the right way: const routeQueries = { ...route.query };
         but no worki - instead I had to do this deep clone trickery below.
         For more info on why this is broken:
         https://github.com/vuejs/vue-router/issues/1182
         **/
			return JSON.parse(JSON.stringify(route.query));
		};

		const addFilter = (route: RouteLocationNormalizedLoaded, filter: string) => {
			const routeQueries = cloneRouteQuery(route);
			const newFilter = encodeURIComponent(filter);

			if (!routeQueries.fq) {
				routeQueries.fq = [newFilter];
			} else if (Array.isArray(routeQueries.fq)) {
				routeQueries.fq.push(newFilter);
			} else {
				// This will only trigger if someone manipulates the url manually
				routeQueries.fq = [routeQueries.fq, newFilter];
			}
			return routeQueries;
		};

		const removeFilter = (route: RouteLocationNormalizedLoaded, filter: string) => {
			const routeQueries = cloneRouteQuery(route);
			const filterToRemove = encodeURIComponent(filter);

			if (Array.isArray(routeQueries.fq)) {
				routeQueries.fq = routeQueries.fq.filter((item: string) => item !== filterToRemove);
			} else {
				routeQueries.fq = undefined;
			}
			return routeQueries;
		};

		const updateFilters = (e: CustomEvent) => {
			const routeQueries = e.detail.add ? addFilter(route, e.detail.filter) : removeFilter(route, e.detail.filter);
			routeQueries.start = 0;
			router.push({ query: routeQueries });
		};

		const filterUpdateHelper = (e: Event) => {
			updateFilters(e as CustomEvent);
			emit('facetUpdate');
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
