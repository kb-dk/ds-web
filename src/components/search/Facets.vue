<template>
	<div
		ref="facetsContainer"
		class="search-facets"
	>
		<EdgedContentArea background-color="#FAFAFA">
			<template #content>
				<div class="time-facets-toggle">
					<button
						ref="timeFacetButton"
						role="switch"
						aria-checked="false"
						filter-button
						:class="timeSearchStore.timeFacetsOpen ? 'time-facet-button open' : 'time-facet-button closed'"
						@click="toggleTimeFacets()"
					>
						<span class="material-icons first">today</span>
						<span class="material-icons second">schedule</span>
						<span class="toggle-time-text">{{ t('timeSearch.filterOpenButton') }}</span>
						<span :class="timeSearchStore.timeFacetsOpen ? 'dark-bar open' : 'dark-bar closed'">
							<span class="dot">
								<TransitionGroup>
									<div
										v-if="timeSearchStore.timeFacetsOpen"
										class="close"
									></div>
									<div
										v-else
										class="check"
									></div>
								</TransitionGroup>
							</span>
						</span>
					</button>
				</div>
				<div
					ref="timeFacets"
					class="time-facets"
				>
					<TimeSearchFilters
						:timeline="false"
						:picker="true"
						:init="false"
						@new-search="newSearch(true)"
						@close="toggleTimeFacets()"
					></TimeSearchFilters>
				</div>
				<div class="facet-container">
					<div class="flex-container">
						<CustomExpander
							headline="Udvælg kanaler"
							icon="ondemand_video"
							:subline="`Alle kanaler`"
							:fade="true"
						>
							<div class="facet-options">
								<TransitionGroup name="result">
									<div
										v-for="(singleFacet, index) in currentChannelNr as unknown as FacetPair[]"
										:key="index + 'facet'"
										:class="index % 4 === 3 ? 'checkbox last' : 'checkbox'"
									>
										<SimpleCheckbox
											:fqkey="'creator_affiliation_facet'"
											:title="channelFacets[index]?.title"
											:amount="channelFacets[index]?.number.toString()"
											:time-search-active="timeSearchStore.timeFacetsOpen"
											:number="index"
											:checked="
												channelFilterExists(
													'creator_affiliation_facet',
													channelFacets[index]?.title,
													searchResultStore.channelFilters,
												)
											"
											:loading="searchResultStore.loading && !searchResultStore.keepFacets"
										/>
									</div>
								</TransitionGroup>
							</div>
						</CustomExpander>
					</div>
				</div>
			</template>
		</EdgedContentArea>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { FacetResultType } from '@/types/GenericSearchResultTypes';
import { useRoute, useRouter } from 'vue-router';
import TimeSearchFilters from '../common/TimeSearch/TimeSearchFilters.vue';
import SimpleCheckbox from '@/components/common/SimpleCheckbox.vue';
import { channelFilterExists, simplifyFacets, cloneRouteQuery } from '@/utils/filter-utils';
import { SelectorData } from '@/types/TimeSearchTypes';
import { FacetPair } from '@/types/GenericRecordTypes';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';
import { days, timeslots, startDate, endDate } from '@/components/common/TimeSearch/TimeSearchInitValues';
import EdgedContentArea from '@/components/global/content-elements/EdgedContentArea.vue';
import CustomExpander from '@/components/common/CustomExpander.vue';
import { removeTimeFacetsFromRoute, normalizeFq } from '@/utils/filter-utils';

export default defineComponent({
	name: 'Facets',
	components: {
		SimpleCheckbox,
		TimeSearchFilters,
		EdgedContentArea,
		CustomExpander,
	},

	props: {
		facetResults: { type: Object as PropType<FacetResultType>, required: true },
	},

	setup(props) {
		const searchResultStore = useSearchResultStore();
		const timeSearchStore = useTimeSearchStore();
		const currentFacets = ref(Object as unknown as FacetResultType);
		const currentChannelNr = ref(16);
		const channelFacets = ref([] as FacetPair[]);
		const categoryFacets = ref([] as FacetPair[]);
		const categoryNr = ref(0);
		const facetsContainer = ref<HTMLElement | null>(null);
		const timeFacets = ref<HTMLElement | null>(null);
		const timeFacetButton = ref<HTMLButtonElement | null>(null);
		const lastUpdate = ref(0);
		const { t } = useI18n();
		const router = useRouter();
		const route = useRoute();

		onMounted(() => {
			currentFacets.value = props.facetResults;
			channelFacets.value = simplifyFacets(currentFacets.value['creator_affiliation_facet']);
			categoryFacets.value = simplifyFacets(currentFacets.value['categories']);
			currentChannelNr.value = channelFacets.value.length ? channelFacets.value.length : 16;
			categoryNr.value = categoryFacets.value.length ? Number(categoryFacets.value.length) : 0;
			timeSearchStore.timeFacetsOpen = false;

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
						currentChannelNr.value = searchResultStore.loading ? 16 : channelFacets.value.length;
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

		const newSearch = (yearSearch: boolean) => {
			const routeQueries = cloneRouteQuery(route);
			routeQueries.start = 0;
			routeQueries.sort = yearSearch ? 'startTime asc' : '';
			const dayString = days.value
				.filter((day: SelectorData) => day.selected)
				.map((day: SelectorData) => day.value)
				.join(' OR ');

			const timeslotString = timeslots.value
				.filter((timeslot: SelectorData) => timeslot.selected)
				.map((timeslot: SelectorData) => timeslot.value)
				.join(' OR ');

			if (!routeQueries.fq) {
				routeQueries.fq = [];
			}

			const existingFq = removeTimeFacetsFromRoute(normalizeFq(routeQueries.fq));

			if (yearSearch) {
				existingFq.push(
					encodeURIComponent(`startTime:[${startDate.value.toISOString() + ' TO ' + endDate.value.toISOString()}]`),
				);
			}
			dayString !== '' ? existingFq.push(encodeURIComponent(`temporal_start_day_da:(${dayString})`)) : null;
			timeslotString !== '' ? existingFq.push(encodeURIComponent(`temporal_start_hour_da:(${timeslotString})`)) : null;

			routeQueries.fq = existingFq;

			router.push({
				name: 'Home',
				query: routeQueries,
			});
		};

		const toggleTimeFacets = () => {
			if (timeSearchStore.timeFacetsOpen) {
				timeFacetButton.value?.setAttribute('aria-checked', 'false');
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
				const routeQueries = cloneRouteQuery(route);
				const existingFq = removeTimeFacetsFromRoute(normalizeFq(routeQueries.fq));
				routeQueries.fq = existingFq;
				router.push({
					name: 'Home',
					query: routeQueries,
				});
			} else {
				timeFacetButton.value?.setAttribute('aria-checked', 'true');
				timeSearchStore.setNewSearchReqMet(true);
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
			timeSearchStore.setTimeFacetsOpen(!timeSearchStore.timeFacetsOpen);
		};

		const toggleFacets = () => {
			if (!searchResultStore.showFacets) {
				gsap.to(facetsContainer.value, {
					height: '0px',
					duration: 0.5,
					overwrite: true,
					opacity: 0,
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
							marginBottom: '-125px',
							duration: 0.5,
							opacity: 1,
							overwrite: true,
						});
					},
				});
			}
		};

		return {
			currentFacets,
			lastUpdate,
			searchResultStore,
			channelFilterExists,
			simplifyFacets,
			currentChannelNr,
			channelFacets,
			categoryFacets,
			categoryNr,
			route,
			toggleFacets,
			facetsContainer,
			timeFacets,
			toggleTimeFacets,
			newSearch,
			timeFacetButton,
			timeSearchStore,
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
	overflow: hidden;
	position: relative;
}

.time-facets-toggle {
	display: flex;
	padding-bottom: 10px;
	flex-direction: row;
	justify-content: space-between;
}

.first {
	top: -2px;
	position: relative;
	left: 4px;
}

.second {
	position: relative;
	top: 2px;
	left: -3px;
}

.time-facet-button {
	cursor: pointer;
	padding: 3px 3px;
	font-size: 20px;
	width: 100%;
	display: flex;
	align-items: center;
	box-shadow: 1px 1px 2px #00000000;
	border: 1px solid #d9d8d8;
	background: #ffffff;
	color: #757575;
	border-radius: 4px;
	transition: all 0s linear 0s;
	height: 36px;
	background-color: #caf0fe;
}

.toggle-time-text {
	margin-right: auto;
}

.time-facet-button.open {
	color: #002e70;
}

.facet-container {
	display: flex;
	height: auto;
	flex-direction: row;
	overflow: hidden;
	flex-direction: row;
	gap: 20px;
	box-sizing: border-box;
	padding: 0px 5px;
}

.facet-options {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
}

.flex-container {
	width: 100%;
	padding-bottom: 30px;
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
	padding: 5px 15px;
	flex: 0 0 100%;
	max-width: 100%;
	box-sizing: border-box;
}

.checkbox.last {
	border-right: 0px;
}

.facet-options > .checkbox:nth-of-type(2n) {
	border-right: 0px;
}

.search-facets {
	z-index: 0;
	box-sizing: border-box;
	overflow-x: visible;
	overflow-y: clip;
	position: relative;
	top: calc(-65px + -1.4vw);
	height: 0px;
	display: none;
	opacity: 0;
}

.dark-bar {
	width: 50px;
	background-color: #d5d5d5;
	height: 24px;
	border-radius: 20px;
	margin-left: 20px;
	transition: all 0.1s linear 0s;
}

.dark-bar.open {
	background-color: #002e70;
}

.dark-bar .dot {
	width: 18px;
	height: 18px;
	display: block;
	background-color: white;
	border-radius: 15px;
	top: 3px;
	left: 3px;
	position: relative;
	transition: all 0.1s linear 0s;
}

.dark-bar.open .dot {
	left: 29px;
}

.dark-bar .dot .close:before {
	content: '';
	display: block;
	width: 7px;
	height: 2px;
	background-color: #002e70;
	transform-origin: center;
	transform: rotateZ(45deg);
	top: 10px;
	left: 2px;
	position: relative;
}
.dark-bar .dot .close:after {
	content: '';
	display: block;
	width: 12px;
	height: 2px;
	background-color: #002e70;
	transform-origin: center;
	transform: rotateZ(-45deg);
	top: 6px;
	position: relative;
	left: 5px;
}

.dark-bar .dot .check:before {
	content: '';
	display: block;
	width: 15px;
	height: 2px;
	background-color: #757575;
	transform-origin: center;
	transform: rotateZ(45deg);
	top: 8px;
	left: 1px;
	position: relative;
	border-radius: 15px;
}
.dark-bar .dot .check:after {
	content: '';
	display: block;
	width: 15px;
	height: 2px;
	background-color: #757575;
	transform-origin: center;
	transform: rotateZ(-45deg);
	top: 6px;
	left: 1px;
	position: relative;
	border-radius: 15px;
}
@media (min-width: 640px) {
	.time-facet-button {
		width: fit-content;
	}
	.checkbox {
		flex: 0 0 50%;
		max-width: 50%;
	}
	.facet-options > .checkbox:nth-of-type(2n + 1) {
		border-right: 1px solid rgba(230, 230, 230, 1);
	}
}

@media (min-width: 990px) {
	.checkbox {
		flex: 0 0 25%;
		max-width: 25%;
	}
	.facet-options > .checkbox:nth-of-type(2n) {
		border-right: 1px solid rgba(230, 230, 230, 1);
	}
	.checkbox.last {
		border-right: 0px solid rgba(255, 255, 255, 0) !important;
	}
}
</style>
