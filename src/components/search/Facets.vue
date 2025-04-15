<template>
	<div
		ref="facetsContainer"
		class="search-facets"
	>
		<div class="search-facets-flex">
			<EdgedContentArea
				:lines="true"
				:line-padding="false"
				background-color="#FAFAFA"
			>
				<template #content>
					<div class="time-facets-toggle">
						<div class="container">
							<button
								ref="timeFacetButton"
								role="switch"
								aria-checked="false"
								:class="timeSearchStore.timeFacetsOpen ? 'time-facet-button open' : 'time-facet-button closed'"
								@click="timeSearchStore.setTimeFacetsOpen(!timeSearchStore.timeFacetsOpen)"
							>
								<span class="material-icons first">today</span>
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
					</div>
					<div
						ref="timeFacets"
						class="time-facets"
					>
						<div class="container">
							<TimeSearchFilters
								:timeline="false"
								:picker="true"
								:init="false"
								@new-search="newSearch(true)"
								@close="timeSearchStore.setTimeFacetsOpen(!timeSearchStore.timeFacetsOpen)"
							></TimeSearchFilters>
						</div>
					</div>
					<div class="facet-container">
						<div class="flex-container">
							<div class="category-container">
								<CustomExpander
									:headline="$t('facets.choose') + ' ' + $t('facets.genres', 2)"
									icon="category"
									:subline="`${getSublineForFacets(genreArray, 'facets.genres', 'facets.allGenres')}`"
									:item-array="genreArray"
									:use-headline-translation="true"
									:update-entity="updateFacet"
									:filter-name-cutoff="5"
									:facet-type="'genre_facet'"
								>
									<fieldset
										v-if="searchResultStore.firstBackendFetchExecuted"
										class="genre-facets"
									>
										<TransitionGroup name="result">
											<div
												v-for="(singleFacet, index) in simplifyFacets(
													searchResultStore.initFacets.facet_fields.genre_facet,
												)"
												:key="index + 'genre_facet'"
												class="genre"
											>
												<GenreCheckbox
													:fqkey="'genre_facet'"
													:title="singleFacet.title"
													:amount="
														categoryFacets.find((item) => item.title === singleFacet.title)?.number.toString() || '0'
													"
													:time-search-active="timeSearchStore.timeFacetsOpen"
													:number="index"
													:checked="
														channelFilterExists('genre_facet', singleFacet.title, searchResultStore.categoryFilters)
													"
													:loading="searchResultStore.loadingGenres"
													:update="updateCheckbox"
													:parent-array="genreArray"
												/>
											</div>
										</TransitionGroup>
									</fieldset>
								</CustomExpander>
							</div>
							<CustomExpander
								:headline="$t('facets.choose') + ' ' + $t('facets.channels', 2)"
								icon="ondemand_video"
								:subline="`${getSublineForFacets(channelsArray, 'facets.channels', 'facets.allChannels')}`"
								:fade="true"
								:item-array="channelsArray"
								:update-entity="updateFacet"
								:filter-name-cutoff="5"
								:use-headline-translation="false"
								:facet-type="'creator_affiliation_facet'"
							>
								<fieldset
									v-if="searchResultStore.firstBackendFetchExecuted"
									class="facet-options"
								>
									<TransitionGroup name="result">
										<div
											v-for="(singleFacet, index) in channelsArray"
											:key="`${index}-facet`"
											:class="{
												'checkbox end': index >= (channelsArray.length / 4) * 3,
												'checkbox semi-end':
													index >= channelsArray.length / 2 && index < (channelsArray.length / 4) * 3,
												checkbox: index < channelsArray.length / 2,
											}"
										>
											<SimpleCheckbox
												:key="`channelCheckbox-${index}`"
												:fqkey="'creator_affiliation_facet'"
												:title="singleFacet.name"
												:amount="
													channelFacets.find((item) => item.title === singleFacet.name)?.number.toString() || '0'
												"
												:number="index"
												:parent-array="channelsArray"
												:update="updateCheckbox"
												:checked="
													channelFilterExists(
														'creator_affiliation_facet',
														singleFacet.name,
														searchResultStore.channelFilters,
													)
												"
												:loading="searchResultStore.loadingChannels"
											/>
										</div>
									</TransitionGroup>
								</fieldset>
							</CustomExpander>
						</div>
					</div>
				</template>
			</EdgedContentArea>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { FacetResultType } from '@/types/GenericSearchResultTypes';
import { useRoute, useRouter } from 'vue-router';
import TimeSearchFilters from '@/components/common/timeSearch/TimeSearchFilters.vue';
import SimpleCheckbox from '@/components/common/SimpleCheckbox.vue';
import {
	addChannelOrCategoryFilter,
	channelFilterExists,
	cloneRouteQuery,
	createFilter,
	extendFacetPairToSelectorData,
	normalizeFq,
	removeChannelOrCategoryFilter,
	removeTimeFacetsFromRoute,
	simplifyFacets,
} from '@/utils/filter-utils';
import { SelectorData } from '@/types/TimeSearchTypes';
import { FacetPair } from '@/types/GenericRecordTypes';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';
import {
	days,
	endDate,
	endYear,
	months,
	startDate,
	startYear,
	timeslots,
} from '@/components/common/timeSearch/TimeSearchInitValues';
import EdgedContentArea from '@/components/global/content-elements/EdgedContentArea.vue';
import CustomExpander from '@/components/common/CustomExpander.vue';
import GenreCheckbox from '@/components/search/GenreCheckbox.vue';
import { resetAllSelectorValues } from '@/utils/time-search-utils';
import { santizeAndSimplify } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'Facets',
	components: {
		SimpleCheckbox,
		TimeSearchFilters,
		EdgedContentArea,
		CustomExpander,
		GenreCheckbox,
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		const timeSearchStore = useTimeSearchStore();
		const currentFacets = ref(Object as unknown as FacetResultType);
		const channelFacets = ref([] as FacetPair[]);
		const categoryFacets = ref([] as FacetPair[]);
		const facetsContainer = ref<HTMLElement | null>(null);
		const timeFacets = ref<HTMLElement | null>(null);
		const timeFacetButton = ref<HTMLButtonElement | null>(null);
		const lastUpdate = ref(0);
		const { t } = useI18n();
		const router = useRouter();
		const route = useRoute();

		const channelsArray = ref([] as SelectorData[]);
		const genreArray = ref([] as SelectorData[]);
		const translatedGenreArray = ref([] as SelectorData[]);
		if (searchResultStore.firstBackendFetchExecuted && Object.keys(searchResultStore.initFacets).length !== 0) {
			channelsArray.value = extendFacetPairToSelectorData(
				simplifyFacets(searchResultStore.initFacets.facet_fields.creator_affiliation_facet),
			);
			genreArray.value = extendFacetPairToSelectorData(
				simplifyFacets(searchResultStore.initFacets.facet_fields.genre_facet),
				'categories',
			);
		} else {
			watch(
				() => searchResultStore.firstBackendFetchExecuted,
				(newVal: boolean) => {
					if (newVal && Object.keys(searchResultStore.initFacets).length !== 0) {
						channelsArray.value = extendFacetPairToSelectorData(
							simplifyFacets(searchResultStore.initFacets.facet_fields.creator_affiliation_facet),
						);
						genreArray.value = extendFacetPairToSelectorData(
							simplifyFacets(searchResultStore.initFacets.facet_fields.genre_facet),
							'categories',
						);
						setCategoryArrayFromStore(searchResultStore.categoryFilters);
						setChannelArrayFromStore(searchResultStore.channelFilters);
					}
				},
			);
		}

		const updateCheckbox = (
			array: SelectorData[],
			index: number,
			val: boolean,
			title: string,
			key: string,
			filterArray: string[],
		) => {
			if (title && key) {
				const routeQueries = channelFilterExists(key, title, filterArray)
					? removeChannelOrCategoryFilter(route, createFilter(title, key), timeSearchStore.timeFacetsOpen, key)
					: addChannelOrCategoryFilter(route, createFilter(title, key), timeSearchStore.timeFacetsOpen, key);
				routeQueries.start = 0;
				router.push({ query: routeQueries });
				array[index].selected = val;
			}
		};

		const getSublineForFacets = (dataArray: SelectorData[], translationKey: string, allTranslationKey: string) => {
			if (
				dataArray.filter((item) => item.selected).length === 0 ||
				dataArray.filter((item) => item.selected).length === dataArray.length
			) {
				return `${t(allTranslationKey)}`;
			} else {
				return `${dataArray.filter((item) => item.selected).length} ${t(
					translationKey,
					dataArray.filter((item) => item.selected).length,
				)}`;
			}
		};

		watch(
			() => searchResultStore.facetResult,
			(newFacets: FacetResultType) => {
				currentFacets.value = {} as FacetResultType;
				channelFacets.value = [] as FacetPair[];
				categoryFacets.value = [] as FacetPair[];
				currentFacets.value = newFacets;
				channelFacets.value = simplifyFacets(newFacets['creator_affiliation_facet']);
				categoryFacets.value = simplifyFacets(newFacets['genre_facet']);
				lastUpdate.value = new Date().getTime();
			},
			{ deep: true },
		);

		watch(
			() => searchResultStore.categoryFilters,
			(newA: string[]) => {
				setCategoryArrayFromStore(newA);
			},
		);

		const setCategoryArrayFromStore = (items: string[]) => {
			genreArray.value.forEach((item) => {
				item.selected = false;
			});
			items.forEach((item) => {
				let newItem = decodeURIComponent(item).replaceAll('"', '').split(':')[1];
				const matchedItem = genreArray.value.find((genreItem) => genreItem.name === newItem);
				if (matchedItem) {
					matchedItem.selected = true;
				}
			});
		};

		watch(
			() => searchResultStore.channelFilters,
			(newA: string[]) => {
				setChannelArrayFromStore(newA);
			},
		);

		const setChannelArrayFromStore = (items: string[]) => {
			channelsArray.value.forEach((item) => {
				item.selected = false;
			});
			items.forEach((item) => {
				let newItem = decodeURIComponent(item).replaceAll('"', '').split(':')[1];
				const matchedItem = channelsArray.value.find((channelItem) => channelItem.name === newItem);
				if (matchedItem) {
					matchedItem.selected = true;
				}
			});
		};

		watch(
			() => searchResultStore.currentQuery,
			(newQ: string, oldQ: string) => {
				if (newQ !== oldQ) {
					genreArray.value.forEach((item) => {
						item.selected = false;
					});
					channelsArray.value.forEach((item) => {
						item.selected = false;
					});
				}
			},
		);

		watch(
			() => searchResultStore.showFacets,
			() => {
				toggleFacets();
			},
		);

		onMounted(() => {
			setCategoryArrayFromStore(searchResultStore.categoryFilters);
			setChannelArrayFromStore(searchResultStore.channelFilters);
			if (timeSearchStore.timeFacetsOpen && timeFacetButton.value?.getAttribute('aria-checked') === 'false') {
				toggleTimeFacets();
			} else if (!timeSearchStore.timeFacetsOpen && timeFacetButton.value?.getAttribute('aria-checked') === 'true') {
				toggleTimeFacets();
			}
		});

		watch(
			() => timeSearchStore.timeFacetsOpen,
			() => {
				toggleTimeFacets();
			},
		);

		const updateFacet = (array: SelectorData[], index: number, val: boolean, key: string) => {
			array[index].selected = val;
			const routeQueries = removeChannelOrCategoryFilter(
				route,
				createFilter(array[index].name, key),
				timeSearchStore.timeFacetsOpen,
				key,
			);
			routeQueries.start = 0;
			router.push({ query: routeQueries });
		};

		const newSearch = (yearSearch: boolean) => {
			const routeQueries = cloneRouteQuery(route);
			routeQueries.q = searchResultStore.currentQuery;
			if (routeQueries.q === '') {
				routeQueries.q = '*:*';
			}
			routeQueries.start = 0;
			routeQueries.sort = yearSearch ? 'startTime asc' : '';
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

			if (!routeQueries.fq) {
				routeQueries.fq = [];
			}

			const existingFq = removeTimeFacetsFromRoute(normalizeFq(routeQueries.fq));

			if (
				yearSearch &&
				startDate.value !== null &&
				endDate.value !== null &&
				(startDate.value.getTime() !== startYear.value.getTime() || endDate.value.getTime() !== endYear.value.getTime())
			) {
				startDate.value.setHours(0, 0, 0); // Start of the day
				endDate.value.setHours(23, 59, 59); // End of the day
				existingFq.push(
					encodeURIComponent(`startTime:[${startDate.value.toISOString() + ' TO ' + endDate.value.toISOString()}]`),
				);
			}
			dayString !== '' ? existingFq.push(encodeURIComponent(`temporal_start_day_da:(${dayString})`)) : null;
			monthString !== '' ? existingFq.push(encodeURIComponent(`temporal_start_month:(${monthString})`)) : null;
			timeslotString !== '' ? existingFq.push(encodeURIComponent(`temporal_start_hour_da:(${timeslotString})`)) : null;

			routeQueries.fq = existingFq;

			router.push({
				name: 'Search',
				query: routeQueries,
			});
		};

		const toggleTimeFacets = () => {
			if (!timeSearchStore.timeFacetsOpen) {
				timeFacetButton.value?.setAttribute('aria-checked', 'false');
				gsap.to(timeFacets.value, {
					height: '0px',
					paddingTop: '0px',
					marginBottom: '0px',
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
				removeAllTimeFilters();
				routeQueries.fq = existingFq;
				router.push({
					name: 'Search',
					query: routeQueries,
				});
			} else {
				timeFacetButton.value?.setAttribute('aria-checked', 'true');
				gsap.set(timeFacets.value, {
					display: 'flex',
					flexDirection: 'column',
					onComplete: () => {
						gsap.to(timeFacets.value, {
							height: 'auto',
							paddingTop: '30px',
							marginBottom: '20px',
							duration: 0.5,
							overwrite: true,
						});
					},
				});
			}
		};

		const removeAllTimeFilters = () => {
			resetAllSelectorValues(days.value);
			resetAllSelectorValues(months.value);
			resetAllSelectorValues(timeslots.value);
			const startHolder = new Date(startYear.value.getTime());
			const endHolder = new Date(endYear.value.getTime());
			startDate.value = startHolder;
			endDate.value = endHolder;
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
							marginBottom: '0px',
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
			channelFacets,
			categoryFacets,
			route,
			toggleFacets,
			facetsContainer,
			timeFacets,
			newSearch,
			timeFacetButton,
			timeSearchStore,
			t,
			channelsArray,
			genreArray,
			updateFacet,
			updateCheckbox,
			getSublineForFacets,
			santizeAndSimplify,
			translatedGenreArray,
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

.container {
	width: 100%;
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
	width: 100vw;
	background-color: #d9f5fe;
}
.expand-container {
}

fieldset {
	padding: 0px;
	border: 0px;
	margin: 0px;
	min-inline-size: auto;
}

.time-facets-toggle {
	display: flex;
	padding-top: 20px;
	padding-bottom: 30px;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
}

.first {
	top: 0px;
	position: relative;
	left: -1px;
	font-size: 40px;
}

.category-container {
	margin-bottom: 45px;
}

.search-facets-flex {
	display: flex;
	align-items: center;
	justify-content: center;
}

.time-facet-button {
	cursor: pointer;
	padding: 3px 8px;
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
	height: 50px;
}
.time-facet-button:hover {
	border: 1px solid #002e70;
	color: #002e70;
}
.toggle-time-text {
	padding-left: 7px;
	margin-right: auto;
}

.time-facet-button.open {
	color: #002e70;
}

.facet-container {
	display: flex;
	height: auto;
	flex-direction: column;
	overflow: hidden;
	gap: 20px;
	box-sizing: border-box;
	padding-bottom: 15px;
	width: 100%;
}

.facet-options {
	column-count: 1;
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

.search-facets {
	box-sizing: border-box;
	overflow-x: visible;
	overflow-y: clip;
	position: relative;
	height: 0px;
	display: none;
	opacity: 0;
	align-items: center;
	justify-content: center;
}

.dark-bar {
	min-width: 50px;
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

.genre-facets {
	display: flex;
	gap: 30px 10px;
	flex-wrap: wrap;
	justify-content: center;
	min-height: 200px;
	box-sizing: border-box;
	margin-top: 25px;
	margin-bottom: 30px;
}

.genre {
	width: calc(100%);
	flex: 0 0 calc(100%);
	margin: 0px 0px;
	box-sizing: border-box;
}

/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.genre {
		width: calc(50% - 10px);
		margin: 0px;
	}
	.container {
		max-width: 640px;
	}
}

@media (min-width: 640px) {
	.time-facet-button {
		width: fit-content;
	}

	.facet-options {
		column-count: 2;
	}

	.facet-options .checkbox {
		border-right: 1px solid rgba(230, 230, 230, 1);
	}

	.facet-options .checkbox.end {
		border-right: 0px solid rgba(230, 230, 230, 1);
	}

	.facet-options .checkbox.semi-end {
		border-right: 0px solid rgba(230, 230, 230, 1);
	}

	.genre {
		width: calc(50% - 15px);
		flex: 0 0 calc(50% - 15px);
		margin: 0px 0px;
	}
	.container {
		max-width: 990px;
	}
	.time-facets-toggle {
		padding-top: 0px;
	}
}

@media (min-width: 990px) {
	.facet-options {
		column-count: 4;
	}

	.facet-options .checkbox.semi-end {
		border-right: 1px solid rgba(230, 230, 230, 1);
	}

	.genre-facets {
		padding: 0px 5px;
		gap: 45px 40px;
		justify-content: flex-start;
	}
	.genre {
		width: calc(25% - 30px);
		flex: 0 0 calc(25% - 30px);
		margin: 0px 0px;
	}
	.container {
		max-width: 1150px;
	}
}
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
}

@media (min-width: 1280px) {
	.genre-facets {
		padding: 0px;
	}
	.container {
		margin: auto;
		padding-right: 0;
		padding-left: 0;
	}
}
</style>
