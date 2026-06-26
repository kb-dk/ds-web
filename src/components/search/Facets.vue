<template>
	<div
		v-if="Object.keys(searchResultStore.initFacets || {}).length > 0"
		ref="facetsContainer"
		class="search-facets"
	>
		<div class="facet-container">
			<div class="headline-section">
				<div class="filter-header">
					<div class="material-icons filters">tune</div>
					<button
						class="closeBtn material-icons"
						@click="searchResultStore.toggleShowFacets(!searchResultStore.showFacets)"
					>
						close
					</button>
				</div>
				<h1 class="filter-headline">
					{{ t('facets.headline') }}
					<span class="bold">{{ searchResultStore.currentQuery }}</span>
				</h1>
			</div>
			<div class="category-container">
				<CustomRadioGroup
					v-model="searchResultStore.preliminarySearchMethod"
					name="SelectedSearchMethod"
					:options="selectedSearchMethodOptions"
				/>
				<CustomRadioGroup
					v-model="searchResultStore.preliminaryFilter"
					name="SelectedSearchMaterials"
					:options="selectedSearchMaterialOptions"
				/>
				<FilterExpander
					type="checkbox"
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
					type="checkbox"
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
					type="checkbox"
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
				<FilterExpander
					type="time"
					:headline="`${t('facets.timePeriod.date.title')} / ${t('facets.timePeriod.period.title')}`"
					icon="calendar_today"
					:subline="createTimeFacetSubline"
					:use-headline-translation="true"
					:update-entity="updateTimeSearch"
					:item-array="yearArray"
				>
					<CustomRadioGroup
						v-model="searchResultStore.preliminaryPeriodSearch"
						name="preliminaryPeriodSearch"
						:options="preliminaryPeriodSearchOptions"
					/>
					<TransitionGroup name="result">
						<div
							v-if="searchResultStore.preliminaryPeriodSearch === 'period'"
							class="to-from-container"
						>
							<CustomTimelineSelect
								:current-selected="timeSliderValues[0]"
								:list-items="getYearRanges"
								:label="$t('timeSearch.from')"
								@update-selected="updateStartYear"
							/>
							<CustomTimelineSelect
								:current-selected="timeSliderValues[1]"
								:list-items="getYearRanges"
								:label="$t('timeSearch.to')"
								@update-selected="updateEndYear"
							/>
						</div>
						<fieldset
							v-if="searchResultStore.preliminaryPeriodSearch === 'period'"
							class="facet-options time-search-filter-container"
						>
							<VueSlider
								v-if="data.length > 0"
								ref="vueSliderRef"
								v-model="timeSliderValues"
								:clickable="true"
								:drag-on-click="true"
								:data="data"
								data-label="key"
								tooltip="always"
								@drag-end="updateTimeSearch"
							></VueSlider>
						</fieldset>
					</TransitionGroup>
					<div
						v-if="searchResultStore.preliminaryPeriodSearch === 'date'"
						class="date-picker-container"
					>
						<TimePicker
							v-model="selectedDate"
							name="filterTimePicker"
							:start-date="startYear"
							:end-date="endYear"
						/>
					</div>
				</FilterExpander>
			</div>

			<KBButton
				button-type="btn-main-default"
				button-color="main"
				button-size="medium"
				class="btn-medium btn-main-medium"
				:button-text="`${t('facets.seeResults', {
					count: Number(searchResultStore.numFound),
					resultCount: new Intl.NumberFormat('de-DE').format(searchResultStore.numFound),
				})}`"
				right-icon-name="arrow_forward_ios"
				:custom-style="{ alignSelf: 'flex-end', marginRight: '12px' }"
				:data-testid="addTestDataEnrichment('button', 'filters-see-results', 'filters-show-results-button', 0)"
				@click="searchResultStore.showFacets = false"
			></KBButton>
		</div>
	</div>
</template>

<script lang="ts">
import '@/assets/styles/vue-slider-styles.css';
import { defineComponent, onMounted, ref, watch, computed, ComputedRef } from 'vue';
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
import { markerData, SelectorData } from '@/types/TimeSearchTypes';
import { FacetPair } from '@/types/GenericRecordTypes';
import { useI18n } from 'vue-i18n';
import TimePicker from '@/components/common/TimePicker.vue';
import gsap from 'gsap';
import {
	endYear,
	startYear,
	timeSliderValues,
	startDate,
	endDate,
} from '@/components/common/timeSearch/TimeSearchInitValues';
import FilterExpander from '@/components/common/FilterExpander.vue';
import { santizeAndSimplify } from '@/utils/test-enrichments';
import CustomRadioGroup from '@/components/common/CustomRadioGroup.vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import KBButton from '@/components/common/KBButton.vue';
import VueSlider from 'vue-3-slider-component';
import { createFocusTrap } from '@/utils/focus-trap';
import CustomTimelineSelect from '@/components/common/CustomTimelineSelect.vue';

export default defineComponent({
	name: 'Facets',
	components: {
		SimpleCheckbox,
		FilterExpander,
		CustomRadioGroup,
		KBButton,
		VueSlider,
		CustomTimelineSelect,
		TimePicker,
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
		const selectedDate = ref<Date | undefined>();
		const { t, locale } = useI18n();
		const router = useRouter();
		const route = useRoute();
		const data = ref([] as markerData[]);
		const vueSliderRef = ref<InstanceType<typeof VueSlider> | null>(null);
		const delimitationOptions = {
			all: '',
			tv: 'origin:"ds.tv"',
			radio: 'origin:"ds.radio"',
		};

		let focusTrap: ReturnType<typeof createFocusTrap> | null = null;

		const channelsArray = ref([] as SelectorData[]);
		const genreArray = ref([] as SelectorData[]);
		const translatedGenreArray = ref([] as SelectorData[]);
		const yearArray = ref([] as SelectorData[]);

		const selectedSearchMethodOptions = computed(() => [
			{ value: 'all', title: t('facets.searchMethod.all.title'), description: t('facets.searchMethod.all.desc') },
			{
				value: 'title',
				title: t('facets.searchMethod.title.title'),
				description: t('facets.searchMethod.title.desc'),
			},
			{
				value: 'desc',
				title: t('facets.searchMethod.desc.title'),
				description: t('facets.searchMethod.desc.desc'),
			},
		]);

		const selectedSearchMaterialOptions = computed(() => [
			{
				value: '',
				title: t('facets.searchMaterial.both.title'),
				description: t('facets.searchMaterial.both.desc'),
			},
			{
				value: 'origin:"ds.tv"',
				title: t('facets.searchMaterial.tv.title'),
				icon: 'play_circle_filled',
				description: t('facets.searchMaterial.tv.desc'),
			},
			{
				value: 'origin:"ds.radio"',
				title: t('facets.searchMaterial.radio.title'),
				icon: 'volume_up',
				description: t('facets.searchMaterial.radio.title'),
			},
		]);

		const preliminaryPeriodSearchOptions = computed(() => [
			{
				value: 'date',
				title: t('facets.timePeriod.date.title'),
				description: t('facets.timePeriod.date.desc'),
				icon: 'event',
			},
			{
				value: 'period',
				title: t('facets.timePeriod.period.title'),
				description: t('facets.timePeriod.period.desc'),
				icon: 'date_range',
			},
		]);
		const getYearRanges = computed(() => {
			const selectYears = [];
			for (let i = startYear.value.getFullYear(); i <= endYear.value.getFullYear(); i++) {
				selectYears.push(i);
			}
			return selectYears;
		});
		onMounted(() => {
			setCategoryArrayFromStore(searchResultStore.categoryFilters);
			setChannelArrayFromStore(searchResultStore.channelFilters);

			const routeQueries = cloneRouteQuery(route);
			const existingFq = normalizeFq(routeQueries.fq as string[] | string);
			const startTimeFilter = existingFq.find((fq: string) => fq.includes('startTime'));
			if (startTimeFilter) {
				const [, startDate, endDate] = decodeURIComponent(startTimeFilter).match(/\[(.+?) TO (.+?)\]/) ?? [];
				const startDateObj = new Date(startDate);
				const endDateObj = new Date(endDate);
				if (
					startDateObj.getFullYear() === endDateObj.getFullYear() &&
					startDateObj.getMonth() === endDateObj.getMonth() &&
					startDateObj.getDate() === endDateObj.getDate()
				) {
					searchResultStore.preliminaryPeriodSearch = 'date';
					selectedDate.value = new Date(startDateObj);
				} else {
					searchResultStore.preliminaryPeriodSearch = 'period';
					timeSliderValues.value[0] = startDateObj.getFullYear();
					timeSliderValues.value[1] = endDateObj.getFullYear();
				}
			}
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

		const firstYearOfContent = computed(() => {
			return startYear.value.getFullYear();
		});

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
					? removeChannelOrCategoryFilter(route, createFilter(title, key), true, key)
					: addChannelOrCategoryFilter(route, createFilter(title, key), true, key);
				routeQueries.start = 0;
				router.push({ query: routeQueries });
				array[index].selected = val;
			}
		};

		const getSublineForFacets = (dataArray: SelectorData[], translationKey: string) => {
			if (dataArray.filter((item) => item.selected).length === 0) {
				return ``;
			} else {
				const selected = dataArray.filter((item) => item.selected).length;
				const total = dataArray.length;
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
			() => vueSliderRef.value,
			(newVal, oldVal) => {
				if (newVal !== oldVal) {
					if (newVal) {
						const dots = Array.from(document.querySelectorAll('.vue-slider-dot')) as HTMLDivElement[];
						dots.forEach((dot, index) => {
							dot.tabIndex = -1;
							dot.ariaLabel = 'Time selector';
							dot.setAttribute('data-testid', addTestDataEnrichment('input', 'vue-slider', `slider-${index}`, index));
						});
					}
				}
			},
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
						searchResultStore.preliminaryFilter = 'origin:"ds.radio"';
					} else if (decodeURIComponent(originFilter) === delimitationOptions.tv) {
						searchResultStore.preliminaryFilter = 'origin:"ds.tv"';
					}
				} else {
					searchResultStore.preliminaryFilter = '';
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

		watch(
			() => selectedDate.value,
			(date: Date | undefined) => {
				if (!date) {
					return;
				}

				const start = new Date(date);
				start.setHours(0, 0, 0, 0);

				const end = new Date(date);
				end.setHours(23, 59, 59, 999);

				startDate.value = start;
				endDate.value = end;
				setTimeSearchMethodAndExecute(startDate.value.toISOString(), endDate.value.toISOString());
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
				if (facetsContainer.value !== null) {
					toggleFacets();
				} else {
					watch(
						() => facetsContainer,
						() => {
							toggleFacets();
						},
						{ deep: true },
					);
				}
			},
		);

		watch(
			() => searchResultStore.preliminaryPeriodSearch,
			() => {
				const routeQueries = cloneRouteQuery(route);
				routeQueries.start = 0;
				const existingFq = normalizeFq(routeQueries.fq as string[] | string);
				const startTimeFilter = existingFq.find((fq: string) => fq.includes('startTime'));
				if (startTimeFilter) {
					const index = existingFq.findIndex((fq: string) => fq === startTimeFilter);
					if (index !== -1) {
						existingFq.splice(index, 1);
					}
				}
				routeQueries.fq = existingFq;
				router.push({
					name: 'Search',
					query: routeQueries,
				});
			},
		);

		watch(
			() => searchResultStore.preliminarySearchMethod,
			() => {
				setSearchMethodAndExecute(searchResultStore.preliminarySearchMethod);
			},
		);

		watch(
			() => searchResultStore.preliminaryFilter,
			() => {
				setDelimitationFilterAndExecute(searchResultStore.preliminaryFilter);
			},
		);

		watch(
			() => getYearRanges,
			(newRange: ComputedRef<number[]>) => {
				data.value = [];
				for (let i = newRange.value[0]; i < newRange.value[newRange.value.length - 1]; i++) {
					data.value.push({ key: i, value: i });
				}
			},
			{ deep: true, immediate: true },
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

		const createTimeFacetSubline = computed(() => {
			if (
				startDate.value.getTime() === startYear.value.getTime() &&
				endDate.value.getTime() === endYear.value.getTime()
			) {
				return `${t('facets.contentFrom')} ${firstYearOfContent.value}`;
			} else {
				if (searchResultStore.preliminaryPeriodSearch === 'period') {
					return `${t('facets.from')} ${t('facets.year')}: ${startDate.value.getFullYear()} → ${t('facets.to')} ${t(
						'facets.year',
					)}: ${endDate.value.getFullYear()}`;
				} else {
					return new Intl.DateTimeFormat(locale.value, {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					}).format(selectedDate.value);
				}
			}
		});

		const updateTimeSearch = () => {
			startDate.value.setFullYear(timeSliderValues.value[0]);
			endDate.value.setFullYear(timeSliderValues.value[1]);
			setTimeSearchMethodAndExecute(startDate.value.toISOString(), endDate.value.toISOString());
		};
		const setTimeSearchMethodAndExecute = (startDate: string, endDate: string) => {
			searchResultStore.resetAutocomplete();
			const routeQueries = cloneRouteQuery(route);
			routeQueries.start = 0;
			const existingFq = normalizeFq(routeQueries.fq as string[] | string);
			const startTimeFilter = existingFq.find((fq: string) => fq.includes('startTime'));
			if (startTimeFilter) {
				const index = existingFq.findIndex((fq: string) => fq === startTimeFilter);
				if (index !== -1) {
					existingFq.splice(index, 1);
				}
			}
			existingFq.push(encodeURIComponent(`startTime:[${startDate} TO ${endDate}]`));
			routeQueries.fq = existingFq;
			router.push({
				name: 'Search',
				query: routeQueries,
			});
		};
		const setSearchMethodAndExecute = (choice: string) => {
			let orgQuery = searchResultStore.currentQuery;
			if (
				searchResultStore.currentQuery.includes('title:') ||
				searchResultStore.currentQuery.includes('description:')
			) {
				orgQuery = searchResultStore.currentQuery.split(':')[1].replaceAll('"', '');
			}
			let newQuery = '';
			if (choice === 'title') {
				newQuery = `title:"${orgQuery}"`;
				searchResultStore.preliminarySearchMethod = 'title';
			} else if (choice === 'desc') {
				newQuery = `description:"${orgQuery}"`;
				searchResultStore.preliminarySearchMethod = 'desc';
			} else {
				newQuery = orgQuery;
				searchResultStore.preliminarySearchMethod = 'all';
			}
			searchResultStore.resetAutocomplete();
			const routeQueries = cloneRouteQuery(route);
			routeQueries.start = 0;
			routeQueries.q = newQuery;
			const existingFq = normalizeFq(routeQueries.fq as string[] | string);
			routeQueries.fq = existingFq;
			router.push({
				name: 'Search',
				query: routeQueries,
			});
		};

		const setDelimitationFilterAndExecute = (choice: string) => {
			let val = '';
			if (choice === 'origin:"ds.tv"') {
				val = delimitationOptions.tv;
			} else if (choice === 'origin:"ds.radio"') {
				val = delimitationOptions.radio;
			} else {
				val = delimitationOptions.all;
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

		const toggleFacets = () => {
			if (!searchResultStore.showFacets) {
				gsap.to(facetsContainer.value, {
					duration: 0.5,
					overwrite: true,
					opacity: 0,
					marginLeft: '-15px',
					onComplete: () => {
						focusTrap?.deactivate();
						gsap.set(facetsContainer.value, {
							display: 'none',
						});
					},
				});
			} else {
				if (facetsContainer.value) {
					focusTrap = createFocusTrap(facetsContainer.value, () => {
						searchResultStore.showFacets = false;
					});
				}
				gsap.set(facetsContainer.value, {
					display: 'block',
					onComplete: () => {
						focusTrap?.activate();
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
		const updateStartYear = (val: number) => {
			timeSliderValues.value[0] = Number(val);
			startDate.value !== null ? startDate.value.setFullYear(val) : null;
			if (Number(val) > timeSliderValues.value[1]) {
				timeSliderValues.value[1] = Number(val);
				endDate.value !== null ? endDate.value.setFullYear(val) : null;
			}
			updateTimeSearch();
		};

		const updateEndYear = (val: number) => {
			endDate.value !== null ? endDate.value.setFullYear(val) : null;
			timeSliderValues.value[1] = Number(val);
			if (Number(val) < timeSliderValues.value[0]) {
				timeSliderValues.value[0] = Number(val);
				startDate.value !== null ? startDate.value.setFullYear(val) : null;
			}
			updateTimeSearch();
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
			yearArray,
			updateFacet,
			updateCheckbox,
			updateTimeSearch,
			getSublineForFacets,
			santizeAndSimplify,
			translatedGenreArray,
			getTVFacets,
			getRadioFacets,
			addTestDataEnrichment,
			vueSliderRef,
			timeSliderValues,
			data,
			selectedSearchMethodOptions,
			selectedSearchMaterialOptions,
			preliminaryPeriodSearchOptions,
			firstYearOfContent,
			getYearRanges,
			updateStartYear,
			updateEndYear,
			startYear,
			endYear,
			selectedDate,
			createTimeFacetSubline,
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

.date-picker-container {
	margin-bottom: 25px;
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
	margin: 20px 12px 20px 0px;
}

.filter-headline {
	color: #002e70;
}

.filter-headline .bold {
	font-weight: var(--fw-bold);
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

.headline-section {
	padding-left: 12px;
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
.time-search-filter-container {
	height: 120px;
	margin-bottom: 70px;
	margin-left: 40px;
	width: calc(100% - 82px);
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
	left: 0px;
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
.to-from-container {
	display: flex;
	flex-direction: row;
	align-content: center;
	flex-wrap: nowrap;
	justify-content: space-evenly;
	align-items: center;
	gap: 10px;
	margin-bottom: 30px;
	font-size: 26px;
	text-transform: capitalize;
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
}

@media (min-width: 2130px) {
	.search-facets {
		margin-right: 1605px;
		left: initial !important;
	}
}
</style>
