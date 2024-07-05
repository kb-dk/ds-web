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
		<div class="time-facets-toggle">
			<button
				:class="timeFacetsOpen ? 'time-facet-button open' : 'time-facet-button closed'"
				@click="toggleTimeFacets()"
			>
				{{ timeFacetsOpen ? '-' : '+' }}
			</button>
		</div>
		<div
			ref="timeFacets"
			class="time-facets"
		>
			<TimeSearchFilters
				:init="false"
				@new-search="newSearch()"
			></TimeSearchFilters>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { FacetResultType } from '@/types/GenericSearchResultTypes';
import { LocationQueryRaw, useRoute, useRouter } from 'vue-router';
import CategoryTags from '@/components/search/CategoryTags.vue';
import TimeSearchFilters from '../common/TimeSearch/TimeSearchFilters.vue';
import Checkbox from '@/components/search/Checkbox.vue';
import { filterExists, simplifyFacets } from '@/utils/filter-utils';
import { SelectorData } from '@/types/TimeSearchTypes';
import { FacetPair } from '@/types/GenericRecordTypes';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';
import { months, days, timeslots, timeSliderValues } from '@/components/common/TimeSearch/TimeSearchInitValues';

export default defineComponent({
	name: 'Facets',
	components: {
		CategoryTags,
		Checkbox,
		TimeSearchFilters,
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
		const timeFacets = ref<HTMLElement | null>(null);
		const lastUpdate = ref(0);
		const { t } = useI18n();
		const timeFacetsOpen = ref(false);
		const router = useRouter();
		const route = useRoute();

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

		/* 		watch(
			[months, days, timeslots, timeSliderValues],
			() => {
				console.log('SOMETGING HAPPENED');
				searchResultStore.getSearchResults(searchResultStore.currentQuery, true);
			},
			{ deep: true },
		); */

		const newSearch = () => {
			let query: LocationQueryRaw = {
				q: searchResultStore.currentQuery,
				start: 0,
				sort: `${encodeURIComponent('startTime asc')}`,
			};
			const dayString = days.value
				.filter((day: SelectorData) => day.selected)
				.map((day: SelectorData) => day.value)
				.join(' OR ');

			const monthString = months.value
				.filter((month: SelectorData) => month.selected)
				.map((month: SelectorData) => month.value)
				.join(' OR ');

			const timeslotString = timeslots.value
				.filter((timeslot: SelectorData) => timeslot.selected)
				.map((timeslot: SelectorData) => timeslot.value)
				.join(' OR ');
			(query.fq = [
				encodeURIComponent(`temporal_start_year:[${timeSliderValues.value[0] + ' TO ' + timeSliderValues.value[1]}]`),
				encodeURIComponent(`temporal_start_day_da:(${dayString})`),
				encodeURIComponent(`temporal_start_month:(${monthString})`),
				encodeURIComponent(`temporal_start_hour_da:(${timeslotString})`),
			]),
				router.push({
					name: 'Home',
					query: query,
				});

			console.log(query, 'damnit');

			console.log('fire!2');
		};

		const toggleTimeFacets = () => {
			if (timeFacetsOpen.value) {
				gsap.to(timeFacets.value, {
					height: '0px',
					duration: 0.5,
					overwrite: true,
					onComplete: () => {
						gsap.set(timeFacets.value, {
							display: 'none',
						});
					},
				});
			} else {
				gsap.set(timeFacets.value, {
					display: 'flex',
					flexDirection: 'column',
					onComplete: () => {
						gsap.to(timeFacets.value, {
							height: 'auto',
							duration: 0.5,
							overwrite: true,
						});
					},
				});
			}
			timeFacetsOpen.value = !timeFacetsOpen.value;
		};

		const toggleFacets = () => {
			if (!searchResultStore.showFacets) {
				gsap.to(facetsContainer.value, {
					height: '0px',
					duration: 0.5,
					overwrite: true,
					borderBottom: '0px solid transparent',
					marginBottom: '0px',
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
			timeFacets,
			toggleTimeFacets,
			timeFacetsOpen,
			newSearch,
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

.time-facets {
	display: none;
	height: 0px;
}

.time-facets-toggle {
	display: grid;
	align-items: center;
	justify-content: center;
	align-content: center;
}

.time-facet-button {
	border: 0px solid transparent;
	cursor: pointer;
	background-color: transparent;
	padding: 10px 5px;
	width: 30px;
	height: 30px;
	background-color: #0a2e70;
	color: white;
	font-size: 24px;
	display: grid;
	align-items: center;
	justify-content: center;
	align-content: center;
}

.time-facet-button:before {
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 15px solid transparent;
	border-right: 15px solid transparent;
	border-bottom: 10px solid #0a2e70;
	position: absolute;
	margin-left: -5px;
	margin-top: -40px;
	transition: all 0.15s ease-in-out 0s;
	transform: scaleY(0);
	transform-origin: bottom;
}

.time-facet-button.open:before {
	transform: scaleY(1);
}

.time-facet-button:after {
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 15px solid transparent;
	border-right: 15px solid transparent;
	border-top: 10px solid #0a2e70;
	position: absolute;
	margin-left: -5px;
	margin-top: 40px;
	transform: scaleY(0);
	transform-origin: top;
	transition: all 0.15s ease-in-out 0s;
}

.time-facet-button.closed:after {
	transform: scaleY(1);
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
