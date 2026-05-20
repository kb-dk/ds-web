<template>
	<div
		ref="facetsContainer"
		class="search-facets"
	>
		<div class="facet-container">
			<div class="filter-header">
				<div class="material-icons filters">tune</div>
				<button
					class="closeBtn material-icons"
					@click="searchResultStore.toggleShowFacets(!searchResultStore.showFacets)"
				>
					close
				</button>
			</div>
			<h1 class="filter-headline">Udvælg filtre, til at indsnævre din søgnig på: "kongelig"</h1>
			<div class="category-container">
				<CustomRadioGroup
					v-model="selectedSearchMethod"
					name="SelectedSearchMethod"
					:options="[
						{ value: 'all', title: 'Søg i alt', description: 'Der søges i alle metadata-felter.' },
						{ value: 'title', title: 'Søg kun på titler', description: 'Der søges kun i titel-feltet.' },
						{
							value: 'desc',
							title: 'Søg kun på beskrivelse',
							description: 'Der søges kun i beskrivelses-feltet.',
						},
					]"
				/>
				<CustomRadioGroup
					v-model="selectedSearchMaterials"
					name="SelectedSearchMaterials"
					:options="[
						{
							value: 'all',
							title: 'Søg på både TV og RADIO',
							description: 'Der søges både i radio-poster og TV-poster.',
						},
						{
							value: 'tv',
							title: 'Søg kun på TV',
							icon: 'play_circle_filled',
							description: 'Der søges kun i TV-poster.',
						},
						{
							value: 'radio',
							title: 'Søg kun på RADIO',
							icon: 'volume_up',
							description: 'Der søges kun i RADIO-poster.',
						},
					]"
				/>
				<FilterExpander
					:headline="$t('facets.genres', 2)"
					icon="category"
					:subline="`${getSublineForFacets(genreArray, 'facets.selectedGenres')}`"
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
								v-for="(singleFacet, index) in simplifyFacets(searchResultStore.initFacets.facet_fields.genre_facet)"
								:key="index + 'genre_facet'"
								class="genre"
							>
								<SimpleCheckbox
									:key="`genreCheckbox-${index}`"
									:fqkey="'genre_facet'"
									:title="singleFacet.title"
									:svg="singleFacet.title"
									:amount="categoryFacets.find((item) => item.title === singleFacet.title)?.number.toString() || '0'"
									:time-search-active="timeSearchStore.timeFacetsOpen"
									:number="index"
									:checked="channelFilterExists('genre_facet', singleFacet.title, searchResultStore.categoryFilters)"
									:loading="searchResultStore.loadingGenres"
									:update="updateCheckbox"
									:parent-array="genreArray"
									:disabled="searchResultStore.queryLimitReached"
									:filter-array="searchResultStore.categoryFilters"
								/>
							</div>
						</TransitionGroup>
					</fieldset>
				</FilterExpander>
				<FilterExpander
					:headline="$t('facets.tvChannels', 2)"
					icon="play_circle_filled"
					:subline="`${getSublineForFacets(getTVFacets(channelsArray), 'facets.selectedTVChannels')}`"
					:fade="false"
					:item-array="getTVFacets(channelsArray)"
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
								v-for="(singleFacet, index) in getTVFacets(channelsArray)"
								:key="`${index}-tv-facet`"
							>
								<SimpleCheckbox
									:key="`channel-tv-checkbox-${index}`"
									:fqkey="'creator_affiliation_facet'"
									:title="singleFacet.name"
									:channel="singleFacet.name"
									:amount="channelFacets.find((item) => item.title === singleFacet.name)?.number.toString() || '0'"
									:number="index"
									:parent-array="getTVFacets(channelsArray)"
									:update="updateCheckbox"
									:checked="
										channelFilterExists('creator_affiliation_facet', singleFacet.name, searchResultStore.channelFilters)
									"
									:loading="searchResultStore.loadingChannels"
									:disabled="searchResultStore.queryLimitReached"
									:filter-array="searchResultStore.channelFilters"
								/>
							</div>
						</TransitionGroup>
					</fieldset>
				</FilterExpander>
				<FilterExpander
					:headline="$t('facets.radioChannels', 2)"
					icon="volume_up"
					:subline="`${getSublineForFacets(getRadioFacets(channelsArray), 'facets.selectedRadioChannels')}`"
					:fade="false"
					:item-array="getRadioFacets(channelsArray)"
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
								v-for="(singleFacet, index) in getRadioFacets(channelsArray)"
								:key="`${index}-radio-facet`"
							>
								<SimpleCheckbox
									:key="`channel-radio-checkbox-${index}`"
									:fqkey="'creator_affiliation_facet'"
									:title="singleFacet.name"
									:channel="singleFacet.name"
									:amount="channelFacets.find((item) => item.title === singleFacet.name)?.number.toString() || '0'"
									:number="index"
									:parent-array="getRadioFacets(channelsArray)"
									:update="updateCheckbox"
									:checked="
										channelFilterExists('creator_affiliation_facet', singleFacet.name, searchResultStore.channelFilters)
									"
									:loading="searchResultStore.loadingChannels"
									:disabled="searchResultStore.queryLimitReached"
									:filter-array="searchResultStore.channelFilters"
								/>
							</div>
						</TransitionGroup>
					</fieldset>
				</FilterExpander>
			</div>
			<KBButton
				button-type="btn-main-default"
				class="btn-medium btn-main-medium"
				:button-text="`Se dine ${searchResultStore.numFound} resultater`"
				right-icon-name="arrow_forward_ios"
				:custom-style="{ alignSelf: 'flex-end', marginRight: '12px' }"
				:data-testid="addTestDataEnrichment('button', 'filters-see-results', 'filters-show-results-button', 0)"
				@click="searchResultStore.showFacets = false"
			>
				Se alle resultater
			</KBButton>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { FacetResultType } from '@/types/GenericSearchResultTypes';
import { useRoute, useRouter } from 'vue-router';
import SimpleCheckbox from '@/components/common/SimpleCheckbox.vue';
import {
	addChannelOrCategoryFilter,
	channelFilterExists,
	cloneRouteQuery,
	createFilter,
	extendFacetPairToSelectorData,
	normalizeFq,
	removeChannelOrCategoryFilter,
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
import FilterExpander from '@/components/common/FilterExpander.vue';
import { resetAllSelectorValues } from '@/utils/time-search-utils';
import { santizeAndSimplify } from '@/utils/test-enrichments';
import CustomRadioGroup from '@/components/common/CustomRadioGroup.vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import KBButton from '@/components/common/KBButton.vue';

export default defineComponent({
	name: 'Facets',
	components: {
		SimpleCheckbox,
		FilterExpander,
		CustomRadioGroup,
		KBButton,
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

		const delimitationOptions = {
			all: '',
			tv: 'origin:"ds.tv"',
			radio: 'origin:"ds.radio"',
		};

		const selectedSearchMethod = ref('all');
		const selectedSearchMaterials = ref('all');

		const channelsArray = ref([] as SelectorData[]);
		const genreArray = ref([] as SelectorData[]);
		const translatedGenreArray = ref([] as SelectorData[]);

		onMounted(() => {
			setCategoryArrayFromStore(searchResultStore.categoryFilters);
			setChannelArrayFromStore(searchResultStore.channelFilters);
		});

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

		const getTVFacets = (channelArray: SelectorData[]) => {
			const returnArray = [];
			for (const obj of channelArray) {
				if (searchResultStore.TVFacets.includes(obj.name)) {
					returnArray.push(obj);
				}
			}
			return returnArray;
		};

		const getRadioFacets = (channelArray: SelectorData[]) => {
			const returnArray = [];
			for (const obj of channelArray) {
				if (searchResultStore.RadioFacets.includes(obj.name)) {
					returnArray.push(obj);
				}
			}
			return returnArray;
		};

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

		const getSublineForFacets = (dataArray: SelectorData[], translationKey: string) => {
			if (
				dataArray.filter((item) => item.selected).length === 0 ||
				dataArray.filter((item) => item.selected).length === dataArray.length
			) {
				return ``;
			} else {
				const selected = dataArray.filter((item) => item.selected).length;
				const total = dataArray.length;

				console.log(translationKey);

				return t(translationKey, {
					selected,
					total,
				});
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
			() => route.query.fq,
			(newFq) => {
				/*
				we have to do this, because vue acts weird here.
				when we have normal route changes, it seems like we get an array here,
				but when we use brower back and forth buttons, we get strings, IF there is only one filter.
				Weird and breaking behavior, that we have to account for here.
				*/
				const normalizedFq: string[] = Array.isArray(newFq) ? (newFq as string[]) : newFq ? [newFq as string] : [];
				const originFilter = normalizedFq.find((fq: string) => fq.includes('origin'));
				if (originFilter) {
					if (decodeURIComponent(originFilter) === delimitationOptions.radio) {
						selectedSearchMaterials.value = 'radio';
					} else if (decodeURIComponent(originFilter) === delimitationOptions.tv) {
						selectedSearchMaterials.value = 'tv';
					}
				} else {
					selectedSearchMaterials.value = 'all';
				}
			},
			{ immediate: true },
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

		watch(
			() => selectedSearchMethod.value,
			() => {
				setSearchMethodAndExecute(selectedSearchMethod.value);
			},
		);

		watch(
			() => selectedSearchMaterials.value,
			() => {
				setDelimitationFilterAndExecute(selectedSearchMaterials.value);
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

		const setSearchMethodAndExecute = (choice: string) => {
			console.log(searchResultStore.currentQuery);
			let newQuery = '';
			if (choice === 'title') {
				newQuery = `title:"${searchResultStore.currentQuery}"`;
			} else if (choice === 'desc') {
				newQuery = `description:"${searchResultStore.currentQuery}"`;
			} else {
				newQuery = searchResultStore.currentQuery.split(':')[1].replaceAll('"', '');
			}
			searchResultStore.resetAutocomplete();
			const routeQueries = cloneRouteQuery(route);
			routeQueries.start = 0;
			routeQueries.q = newQuery;
			const existingFq = normalizeFq(routeQueries.fq as string[] | string);
			routeQueries.fq = existingFq;
			console.log(routeQueries);
			router.push({
				name: 'Search',
				query: routeQueries,
			});
		};

		const setDelimitationFilterAndExecute = (choice: string) => {
			let val = '';
			if (choice === 'tv') {
				val = delimitationOptions.tv;
			} else if (choice === 'radio') {
				val = delimitationOptions.radio;
			} else {
				val = delimitationOptions.all;
				searchResultStore.preliminaryFilter = '';
			}
			searchResultStore.resetAutocomplete();
			const routeQueries = cloneRouteQuery(route);
			routeQueries.start = 0;
			const existingFq = normalizeFq(routeQueries.fq as string[] | string);
			if (existingFq) {
				const creatorAffiliationFilter = existingFq.find((fq: string) => fq.includes('origin'));
				if (creatorAffiliationFilter) {
					const index = existingFq.findIndex((fq: string) => fq === creatorAffiliationFilter);
					if (index !== -1) {
						existingFq.splice(index, 1);
					}
				}
				if (val !== '') {
					existingFq.push(encodeURIComponent(val));
				}
				routeQueries.fq = existingFq;
			} else {
				if (val !== '') {
					routeQueries.fq = [];
					routeQueries.fq.push(encodeURIComponent(val));
				}
			}
			router.push({
				name: 'Search',
				query: routeQueries,
			});
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
					duration: 0.5,
					overwrite: true,
					opacity: 0,
					marginLeft: '-15px',
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
							duration: 0.5,
							opacity: 1,
							marginLeft: '0px',
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
			getTVFacets,
			getRadioFacets,
			selectedSearchMethod,
			selectedSearchMaterials,
			addTestDataEnrichment,
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

.filter-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 20px 16px;
}

.filter-headline {
	color: #002e70;
}

.filter-header button {
	border: 0px;
	background-color: transparent;
}

.filter-header .material-icons {
	width: 40px;
	height: 40px;
	color: #002e70;
	font-size: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.time-facets {
	display: none;
	overflow: hidden;
	position: relative;
	background-color: #d9f5fe;
	min-height: 100vh;
	display: fixed;
	top: 0px;
	margin-left: -15px;
}

.btn.right {
	float: right;
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
	height: 0px;
	flex-direction: column;
	overflow-x: hidden;
	gap: 20px;
	box-sizing: border-box;
	padding-bottom: 15px;
	width: 100%;
	min-height: calc(100vh);
}

.facet-container::-webkit-scrollbar {
	width: 10px;
	height: 10px;
}

.facet-container::-webkit-scrollbar-track {
	background: transparent;
}

.facet-container::-webkit-scrollbar-thumb {
	background: rgba(0, 0, 0, 0.3);
	border-radius: 4px;
}

/* harmless, but usually no-op in modern browsers */
.facet-container::-webkit-scrollbar-button {
	display: none;
}

.facet-options {
	column-count: 1;
	width: 100%;
	margin-top: 10px;
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
	position: fixed;
	display: none;
	opacity: 0;
	top: 0px;
	height: 100vh;
	max-width: 100%;
	width: 500px;
	z-index: 7;
	box-shadow:
		rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
		rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
	background-color: rgb(255 255 255 / 15%);
	backdrop-filter: blur(15px) brightness(165%);
}

.search-facets-flex {
	height: 100%;
	width: 100%;
	position: relative;
	top: 0px;
	left: 0px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-direction: column;
}

.closeBtn {
	z-index: 2;
	position: relative;
	cursor: pointer;
}

.genre-facets {
	display: flex;
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
	.container {
		max-width: 640px;
	}
}

@media (min-width: 640px) {
	.time-facet-button {
		width: fit-content;
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
	.container {
		max-width: 990px;
	}
	.time-facets-toggle {
		padding-top: 0px;
	}
}

@media (min-width: 990px) {
	.facet-options .checkbox.semi-end {
		border-right: 1px solid rgba(230, 230, 230, 1);
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
	.search-facets {
		left: 0px;
	}
}

@media (min-width: 2130px) {
	.search-facets {
		margin-right: calc(1280px + 420px);
	}
}
</style>
