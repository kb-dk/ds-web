<template>
	<div
		class="search-facets active"
		ref="facetsContainer"
	>
		<div class="facet-background">
			<button
				class="facet-close-button"
				@click="searchResultStore.toggleShowFacets(false)"
			>
				<span class="material-icons">close</span>
			</button>

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
								v-for="(singleFacet, index) in currentFacetNr as unknown as FacetPair[]"
								:key="index + 'facet'"
							>
								<kb-checkboxcomponent
									:fqkey="'creator_affiliation'"
									:title="channelFacets[index]?.title"
									:number="channelFacets[index]?.number"
									:value="filterExists('creator_affiliation', channelFacets[index]?.title)"
									:inslide="index"
									:content="!searchResultStore.loading"
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
import { FacetPair } from '@/types/GenericRecordTypes';
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

	setup(props) {
		const searchResultStore = useSearchResultStore();
		const showFacets = ref(false);
		const currentFacets = ref(Object as unknown as FacetResultType);
		const currentFacetNr = ref(10);
		const channelFacets = ref([] as FacetPair[]);
		const categoryFacets = ref([] as FacetPair[]);
		const categoryNr = ref(0);

		const facetsContainer = ref<HTMLElement | null>(null);

		const lastUpdate = ref(0);
		const route = useRoute();
		const router = useRouter();

		const { t } = useI18n();

		onMounted(() => {
			window.innerWidth > 800 ? searchResultStore.toggleShowFacets(true) : searchResultStore.toggleShowFacets(false);

			currentFacets.value = props.facetResults;
			channelFacets.value = simplifyFacets(currentFacets.value['creator_affiliation']);
			categoryFacets.value = simplifyFacets(currentFacets.value['categories']);
			currentFacetNr.value = channelFacets.value.length ? Math.min(channelFacets.value.length, 10) : 10;
			showFacets.value = true;
			categoryNr.value = categoryFacets.value.length ? Number(categoryFacets.value.length) : 25;
			window.addEventListener('filter-update', filterUpdateHelper);

			watch(
				() => props.facetResults,
				(newFacets: FacetResultType, prevFacets: FacetResultType) => {
					console.log('facets updated because of the watcher in searchResults.vue');
					if (newFacets !== prevFacets) {
						currentFacets.value = {} as FacetResultType;
						channelFacets.value = [] as FacetPair[];
						categoryFacets.value = [] as FacetPair[];

						currentFacets.value = newFacets;
						channelFacets.value = simplifyFacets(newFacets['creator_affiliation']);
						categoryFacets.value = simplifyFacets(newFacets['categories']);
						currentFacetNr.value = Math.min(channelFacets.value.length, 10);
						categoryNr.value = Number(categoryFacets.value.length);
						lastUpdate.value = new Date().getTime();
						showFacets.value = true;
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

		watch(
			() => searchResultStore.showFacets,
			() => {
				toggleFacets();
			},
		);

		const toggleFacets = () => {
			if (searchResultStore.showFacets) {
				facetsContainer.value?.classList.add('active');
				//resultContainer.value?.classList.add('fullwidth');

				window.document.body.classList.add('remove-body-scroll');
			} else {
				facetsContainer.value?.classList.remove('active');
				//resultContainer.value?.classList.remove('fullwidth');
				window.document.body.classList.remove('remove-body-scroll');
			}
		};

		const filterUpdateHelper = (e: Event) => {
			updateFilters(e as CustomEvent);
			window.innerWidth < 800 ? searchResultStore.toggleShowFacets(false) : null;
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
			toggleFacets,
			facetsContainer,
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

.search-facets.active {
	visibility: visible;
	pointer-events: all;
	transform: translateX(0%);
	width: 100%;
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

@media (min-width: 640px) {
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
}
@media (min-width: 800px) {
	.facet-container {
		flex-direction: column;
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
}
</style>
