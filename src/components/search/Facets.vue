<template>
	<div
		ref="facetsContainer"
		class="search-facets"
	>
		<div class="facet-container">
			<div class="flex-container">
				<h2 class="headline">{{ t('search.channels') }} ({{ currentFacetNr }})</h2>
				<div class="facet-options">
					<TransitionGroup name="result">
						<div
							v-for="(singleFacet, index) in currentFacetNr as unknown as FacetPair[]"
							:key="index + 'facet'"
							class="checkbox"
						>
							<Checkbox
								:fqkey="'creator_affiliation_facet'"
								:title="channelFacets[index]?.title"
								:amount="channelFacets[index]?.number.toString()"
								:checked="filterExists('creator_affiliation_facet', channelFacets[index]?.title)"
								:loading="searchResultStore.loading"
							/>
						</div>
					</TransitionGroup>
				</div>
			</div>
			<div class="flex-container">
				<h2 class="headline">{{ t('search.relatedSubjects') }} ({{ categoryNr }})</h2>
				<div>
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
import { defineComponent, PropType, onMounted, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { FacetResultType } from '@/types/GenericSearchResultTypes';
import { useRoute } from 'vue-router';
import CategoryTags from '@/components/search/CategoryTags.vue';
import Checkbox from '@/components/search/Checkbox.vue';
import { filterExists, simplifyFacets } from '@/utils/filter-utils';
import { FacetPair } from '@/types/GenericRecordTypes';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';

export default defineComponent({
	name: 'Facets',
	components: {
		CategoryTags,
		Checkbox,
	},

	props: {
		facetResults: { type: Object as PropType<FacetResultType>, required: true },
	},

	setup(props) {
		const searchResultStore = useSearchResultStore();
		const currentFacets = ref(Object as unknown as FacetResultType);
		const currentFacetNr = ref(10);
		const channelFacets = ref([] as FacetPair[]);
		const categoryFacets = ref([] as FacetPair[]);
		const categoryNr = ref(0);
		const facetsContainer = ref<HTMLElement | null>(null);
		const lastUpdate = ref(0);
		const route = useRoute();
		const { t } = useI18n();

		onMounted(() => {
			currentFacets.value = props.facetResults;
			channelFacets.value = simplifyFacets(currentFacets.value['creator_affiliation_facet']);
			categoryFacets.value = simplifyFacets(currentFacets.value['categories']);
			currentFacetNr.value = channelFacets.value.length ? Math.min(channelFacets.value.length, 10) : 10;
			categoryNr.value = categoryFacets.value.length ? Number(categoryFacets.value.length) : 0;

			watch(
				() => props.facetResults,
				(newFacets: FacetResultType, prevFacets: FacetResultType) => {
					if (newFacets !== prevFacets) {
						currentFacets.value = {} as FacetResultType;
						channelFacets.value = [] as FacetPair[];
						categoryFacets.value = [] as FacetPair[];

						currentFacets.value = newFacets;
						channelFacets.value = simplifyFacets(newFacets['creator_affiliation_facet']);
						categoryFacets.value = simplifyFacets(newFacets['categories']);
						currentFacetNr.value = searchResultStore.loading ? 10 : Math.min(channelFacets.value.length, 10);
						categoryNr.value = Number(categoryFacets.value.length);
						lastUpdate.value = new Date().getTime();
					}
				},
			);
		});

		watch(
			() => searchResultStore.showFacets,
			() => {
				toggleFacets();
			},
		);

		const toggleFacets = () => {
			if (!searchResultStore.showFacets) {
				gsap.to(facetsContainer.value, {
					height: '0px',
					duration: 0.5,
					borderBottom: '0px solid transparent',
					marginBottom: '0px',
					overwrite: true,
					onComplete: () => {
						gsap.set(facetsContainer.value, {
							display: 'none',
						});
					},
				});
			} else {
				gsap.set(facetsContainer.value, {
					display: 'block',
					onComplete: () => {
						gsap.to(facetsContainer.value, {
							height: 'auto',
							duration: 0.5,
							overwrite: true,
							marginBottom: '20px',
							borderBottom: '1px solid rgba(230, 230, 230, 1)',
						});
					},
				});
			}
		};

		return {
			currentFacets,
			lastUpdate,
			searchResultStore,
			filterExists,
			simplifyFacets,
			currentFacetNr,
			channelFacets,
			categoryFacets,
			categoryNr,
			route,
			toggleFacets,
			facetsContainer,
			t,
		};
	},
});
</script>

<style lang="scss" scoped>
.facet-enter-active,
.facet-leave-active {
	transition: opacity 0.5s ease;
	opacity: 1;
	height: auto;
}

.facet-enter-from,
.facet-leave-to {
	opacity: 0;
	height: 0%;
}

.facet-container {
	display: flex;
	height: auto;
	flex-direction: row;
	overflow: hidden;
	flex-direction: row;
	gap: 20px;
	box-sizing: border-box;
	padding: 10px 5px;
}

.facet-options {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
}

.flex-container {
	width: 50%;
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
	padding: 3px 5px;
	flex: 0 0 50%;
	box-sizing: border-box;
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
	margin-bottom: 20px;
	z-index: 5;
	border-bottom: 1px solid lightgrey;
	box-sizing: border-box;
	background-color: rgb(250, 250, 250);
	overflow: hidden;
}

@media (min-width: 800px) {
	.facet-close-button {
		display: none;
	}
}
</style>
