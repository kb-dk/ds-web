<template>
	<div class="facet-container">
		<div>
			<Transition
				name="fade"
				mode="out-in"
			>
				<div>
					<h2 class="headline">{{ t('search.channels') }}</h2>
					<div
						class="checkbox"
						v-for="(singleFacet, index) in currentFacetNr as unknown as facetPair[]"
						:key="index + 'facet'"
					>
						<kb-checkboxcomponent
							:fqkey="'creator_affiliation'"
							:title="channelFacets[index]?.title"
							:number="channelFacets[index]?.number"
							:value="filterExists('creator_affiliation', channelFacets[index]?.title)"
							:inslide="index"
							:show="showFacets"
						/>
					</div>
				</div>
			</Transition>
			<CategoryTags
				:categories="categoryFacets"
				:category-nr="categoryNr"
			></CategoryTags>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, onUnmounted, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { FacetResultType } from '@/types/GenericSearchResultTypes';
import { useRoute, useRouter } from 'vue-router';
import CategoryTags from '@/components/search/CategoryTags.vue';
import { createFilter, addFilter, removeFilter, filterExists, simplifyFacets } from '@/utils/filter-utils';
import { facetPair } from '@/types/GenericRecordTypes';
import { useI18n } from 'vue-i18n';

import '@/components/search/wc-facet-checkbox';

export default defineComponent({
	name: 'Facets',
	components: {
		CategoryTags,
	},

	props: {
		facetResults: { type: Object as PropType<FacetResultType>, required: true },
	},

	setup(props, { emit }) {
		const searchResultStore = useSearchResultStore();
		const showFacets = ref(false);
		const currentFacets = ref(Object as unknown as FacetResultType);
		const currentFacetNr = ref(0);
		const channelFacets = ref([] as facetPair[]);
		const categoryFacets = ref([] as facetPair[]);
		const categoryNr = ref(0);

		const lastUpdate = ref(0);
		const route = useRoute();
		const router = useRouter();

		const { t } = useI18n();

		onMounted(() => {
			currentFacets.value = props.facetResults;
			channelFacets.value = simplifyFacets(currentFacets.value['creator_affiliation']);
			categoryFacets.value = simplifyFacets(currentFacets.value['categories']);
			currentFacetNr.value = Math.min(channelFacets.value.length, 10);
			showFacets.value = true;
			categoryNr.value = Number(categoryFacets.value.length);
			window.addEventListener('filter-update', filterUpdateHelper);

			watch(
				() => props.facetResults,
				(newFacets: FacetResultType, prevFacets: FacetResultType) => {
					currentFacets.value = {} as FacetResultType;
					channelFacets.value = [] as facetPair[];
					categoryFacets.value = [] as facetPair[];
					if (newFacets !== prevFacets) {
						setTimeout(() => {
							showFacets.value = false;
							let sum = '';
							Object.entries(prevFacets).forEach(([, value]) => {
								sum += value;
							});
							setTimeout(
								() => {
									currentFacets.value = newFacets;
									channelFacets.value = simplifyFacets(newFacets['creator_affiliation']);
									categoryFacets.value = simplifyFacets(newFacets['categories']);
									currentFacetNr.value = Math.min(channelFacets.value.length, 10);
									categoryNr.value = Number(categoryFacets.value.length);
									lastUpdate.value = new Date().getTime();
									showFacets.value = true;
								},
								sum.length <= 0 ? 0 : 600,
							);
						}, 5000);
					}
				},
			);
		});

		onUnmounted(() => {
			window.removeEventListener('filter-update', filterUpdateHelper);
		});

		const updateFilters = (e: CustomEvent) => {
			const routeQueries = e.detail.add ? addFilter(route, e.detail.filter) : removeFilter(route, e.detail.filter);
			routeQueries.start = 0;
			router.push({ query: routeQueries });
		};

		const filterUpdateHelper = (e: Event) => {
			updateFilters(e as CustomEvent);
			emit('facetUpdate');
		};

		return {
			showFacets,
			currentFacets,
			lastUpdate,
			searchResultStore,
			filterExists,
			updateFilters,
			simplifyFacets,
			currentFacetNr,
			channelFacets,
			categoryFacets,
			categoryNr,
			createFilter,
			addFilter,
			removeFilter,
			route,
			t,
		};
	},
});
</script>

<style lang="scss" scoped>
.facet-container {
	padding: 10px 10px;
	display: flex;
	transition: all 1.3s linear;
	height: auto;
	flex-direction: column;
}

h2 {
	font-size: 16px;
	color: black;
}
.facet-box {
	margin-bottom: 15px;
	padding: 10px;
}
.facet-box:empty {
	display: none;
}

.checkbox {
	padding: 3px 0px;
}

@media (min-width: 800px) {
	.facet-container {
		flex-direction: column;
	}
}
</style>
