<template>
	<div
		v-show="timeline"
		class="slider-container"
	>
		<button
			ref="dataButton"
			class="data-size"
			:data-testid="addTestDataEnrichment('button', 'time-search-filters', 'toggle-data-button', 0)"
			@click="toggleExplanation()"
		>
			{{ $t('timeSearch.data') }}
		</button>
		<div class="to-from-container">
			<CustomTimelineSelect
				:current-selected="timeSliderValues[0]"
				:list-items="selectYears"
				:label="$t('timeSearch.from')"
				@update-selected="updateStartYear"
			/>
			<CustomTimelineSelect
				:current-selected="timeSliderValues[1]"
				:list-items="selectYears"
				:label="$t('timeSearch.to')"
				@update-selected="updateEndYear"
			/>
		</div>
		<div class="slider-whiteoff-container">
			<Transition name="fade">
				<div
					v-show="expToggled"
					class="explanation-for-data"
				>
					<div>
						Datamængde viser en kurve over data vi har i arkivet lorem ipsum dolor sit amet, consectetur adipiscing
						elit, sed do eiusmod tempor incididunt ut.
					</div>
					<div>
						Der er huller i arkivet, men vi arbejder på det lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
						do eiusmod tempor incididunt ut.
					</div>
					<button
						ref="closeDataExplanation"
						@click="toggleExplanation()"
					>
						×
					</button>
				</div>
			</Transition>
			<div
				ref="dataContainer"
				class="data-container"
			></div>
			<div class="dotted-separator"></div>
			<Transition name="fade">
				<VueSlider
					v-if="data.length > 0"
					ref="vueSliderRef"
					v-model="timeSliderValues"
					:clickable="true"
					:drag-on-click="true"
					:data="data"
					data-label="key"
					tooltip="always"
					@drag-end="emitNewSearch()"
				></VueSlider>
			</Transition>
		</div>
	</div>
	<div
		v-show="picker"
		class="picker-container"
	>
		<CustomExpander
			ref="yearSearch"
			:headline="t('timeSearch.yearHeadline')"
			icon="event"
			:subline="getSublineForYears(startDate, endDate, t)"
		>
			<div class="picker-background"><DatePicker @span-updated="emitNewSearch()"></DatePicker></div>
		</CustomExpander>
	</div>
	<div class="time-selection">
		<div class="month-selector-expanding">
			<fieldset>
				<CustomExpander
					:headline="t('timeSearch.monthHeadline')"
					icon="event"
					:subline="getSublineForMonths(months, t)"
					:item-array="months"
					:update-entity="updateCheckbox"
				>
					<ItemSlider
						bg-scroll-white="true"
						bg="#ffffff00"
						item-class="month"
					>
						<div class="select-container month">
							<div class="checkbox all">
								<CustomTimelineCheckbox
									:index="0"
									name="timeSearch.all"
									:val="false"
									:tilted="false"
									:update="updateAllCheckbox"
									:parent-array="months"
								></CustomTimelineCheckbox>
							</div>
							<div class="month-selector">
								<div
									:style="'background-image:url(' + figuresImage + ')'"
									class="figures"
								></div>
								<div class="gradient"></div>
								<div class="all-months-items">
									<div
										v-for="(item, index) in months"
										:key="index"
										class="checkbox"
									>
										<CustomTimelineCheckbox
											:index="index"
											:name="months[index].name"
											:val="months[index].selected"
											:tilted="true"
											:update="updateCheckbox"
											:parent-array="months"
										></CustomTimelineCheckbox>
									</div>
								</div>
							</div>
						</div>
					</ItemSlider>
				</CustomExpander>
			</fieldset>
		</div>
		<div class="overall-selector">
			<div class="select-container days">
				<fieldset>
					<CustomExpander
						:headline="t('timeSearch.dayHeadline')"
						icon="date_range"
						:subline="getSublineForDays(days, t)"
						:item-array="days"
						:update-entity="updateCheckbox"
					>
						<ItemSlider
							bg-scroll-white="true"
							bg="#ffffff00"
							item-class="month"
						>
							<div class="expand-container-days">
								<div class="checkbox all">
									<CustomTimelineCheckbox
										:index="1"
										name="timeSearch.all"
										:val="false"
										:tilted="false"
										:parent-array="days"
										:update="updateAllCheckbox"
									></CustomTimelineCheckbox>
								</div>
								<div class="all-days-items">
									<div class="day-gradient"></div>
									<div
										v-for="(item, index) in days"
										:key="index"
										class="checkbox"
									>
										<CustomTimelineCheckbox
											:index="index"
											:name="days[index].name"
											:val="days[index].selected"
											:tilted="true"
											:update="updateCheckbox"
											:parent-array="days"
										></CustomTimelineCheckbox>
									</div>
								</div>
							</div>
						</ItemSlider>
					</CustomExpander>
				</fieldset>
			</div>
			<div class="select-container select-time">
				<fieldset>
					<CustomExpander
						:headline="t('timeSearch.timeslotHeadline')"
						icon="schedule"
						:subline="getSublineForTimeslots(timeslots, t)"
						:item-array="timeslots"
						:update-entity="updateCheckbox"
						:filter-name-cutoff="13"
					>
						<ItemSlider
							bg-scroll-white="true"
							bg="#ffffff00"
							item-class="month"
						>
							<div class="expand-container-time">
								<div class="checkbox all">
									<CustomTimelineCheckbox
										:index="2"
										name="timeSearch.all"
										:val="false"
										:tilted="false"
										:parent-array="timeslots"
										:update="updateAllCheckbox"
									></CustomTimelineCheckbox>
								</div>
								<div class="all-timeslot-items">
									<div
										:style="'background-image:url(' + timelapseImage + ')'"
										class="timelapse"
									></div>
									<div class="time-gradient"></div>
									<div
										v-for="(item, index) in timeslots"
										:key="index"
										class="checkbox"
									>
										<CustomTimelineCheckbox
											:index="index"
											:name="timeslots[index].name"
											:val="timeslots[index].selected"
											:tilted="true"
											:update="updateCheckbox"
											:parent-array="timeslots"
										></CustomTimelineCheckbox>
									</div>
								</div>
							</div>
						</ItemSlider>
					</CustomExpander>
				</fieldset>
			</div>
		</div>
		<div
			v-if="picker"
			class="apply-time-facets-container"
		>
			<button
				class="close"
				:data-testid="addTestDataEnrichment('button', 'time-search-filters', 'close-time-facets', 0)"
				@click="closeTimeFacets()"
			>
				{{ t('timeSearch.filterCloseButton') }}
			</button>
			<button
				class="apply-time-facets"
				:disabled="!timeSearchStore.newSearchReqMet"
				:data-testid="addTestDataEnrichment('button', 'time-search-filters', 'apply-facets-button', 0)"
				@click="emitNewSearch()"
			>
				{{ t('timeSearch.filterApplyButton') }}
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import VueSlider from 'vue-3-slider-component';
import CustomTimelineSelect from '@/components/common/CustomTimelineSelect.vue';
import ItemSlider from '@/components/search/ItemSlider.vue';
import CustomTimelineCheckbox from '@/components/common/CustomTimelineCheckbox.vue';
import {
	timeSliderValues,
	months,
	days,
	timeslots,
	startDate,
	endDate,
	initSliderValues,
	startYear,
	endYear,
} from '@/components/common/timeSearch/TimeSearchInitValues';
import { pointItem, markerData, dataItem, SelectorData } from '@/types/TimeSearchTypes';
import { createSVGCurvedLine } from '@/utils/svg-graph';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import CustomExpander from '@/components/common/CustomExpander.vue';
import DatePicker from '@/components/common/timeSearch/DatePicker.vue';
import {
	getTimeResults,
	resetAllSelectorValues,
	getSublineForMonths,
	getSublineForDays,
	getSublineForTimeslots,
	getSublineForYears,
} from '@/utils/time-search-utils';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { useSearchResultStore } from '@/store/searchResultStore';

export default defineComponent({
	name: 'TimeSearchFilters',
	components: {
		CustomTimelineSelect,
		ItemSlider,
		CustomTimelineCheckbox,
		VueSlider,
		CustomExpander,
		DatePicker,
	},

	props: {
		init: {
			type: Boolean,
			default() {
				return false;
			},
		},
		timeline: {
			type: Boolean,
			default() {
				return false;
			},
		},
		picker: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
	emits: ['newSearch', 'close'],
	setup(props, { emit }) {
		const { t } = useI18n();
		const timeSearchStore = useTimeSearchStore();
		const dataContainer = ref<HTMLDivElement>();
		const closeDataExplanation = ref<HTMLButtonElement>();
		const fullYearArray = ref([] as pointItem[]);
		const data = ref([] as markerData[]);
		const selectYears = ref([] as string[]);
		const yearSearch = ref<typeof CustomExpander>();
		const dataButton = ref<HTMLDivElement>();
		const expToggled = ref(false);
		const vueSliderRef = ref<InstanceType<typeof VueSlider> | null>(null);
		const searchResultStore = useSearchResultStore();

		onMounted(() => {
			if (props.init) {
				resetAllSelectorValues(months.value);
				resetAllSelectorValues(days.value);
				resetAllSelectorValues(timeslots.value);
				timeSliderValues.value = initSliderValues.value;

				getTimeResults(true);
			}
			if (props.timeline) {
				for (let i = startYear.value.getFullYear(); i <= endYear.value.getFullYear(); i++) {
					selectYears.value.push(i.toString());
					data.value.push({ key: i, value: i });
				}
				if (dataButton.value) {
					dataButton.value.style.display = 'none';
				}
				if (searchResultStore.firstBackendFetchExecuted && Object.keys(searchResultStore.initFacets).length !== 0) {
					constructSVG();
				} else {
					watch(
						() => searchResultStore.firstBackendFetchExecuted,
						(newVal: boolean) => {
							if (newVal && Object.keys(searchResultStore.initFacets).length !== 0) {
								constructSVG();
							} else {
								/* TODO: Error here! */
								console.log('failed.');
							}
						},
					);
				}
			}
		});

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

		const constructSVG = () => {
			data.value = [];
			selectYears.value = [];
			const resultsInYears = searchResultStore.initFacets.facet_fields.temporal_start_year;
			const sortedResults = [] as dataItem[];
			resultsInYears.forEach((item, index) => {
				if (index % 2 === 0) {
					let nextResult = {
						year: item,
						items: Number(resultsInYears[index + 1]),
					};
					sortedResults.push(nextResult);
				}
			});
			sortedResults.sort((a: dataItem, b: dataItem) => Number(a.year) - Number(b.year));
			startYear.value.setFullYear(Number(sortedResults[0].year));
			endYear.value.setFullYear(Number(sortedResults[sortedResults.length - 1].year));
			for (let i = startYear.value.getFullYear(); i <= endYear.value.getFullYear(); i++) {
				selectYears.value.push(i.toString());
				data.value.push({ key: i, value: i });
				let item = (sortedResults.find((item) => item.year.includes(i.toString())) as pointItem) || {
					year: i.toString(),
					items: 0,
				};
				item.x = Number(
					(
						(100 / (endYear.value.getFullYear() - startYear.value.getFullYear())) *
						(i - startYear.value.getFullYear())
					).toFixed(2),
				);
				item.y = item.items;
				fullYearArray.value.push(item);
			}
			const svgElement = createSVGCurvedLine(fullYearArray.value);
			if (dataContainer.value) {
				dataContainer.value.appendChild(svgElement);
			}
			if (dataButton.value) {
				dataButton.value.style.display = 'block';
			}
		};

		const toggleExplanation = () => {
			expToggled.value = !expToggled.value;
			if (expToggled.value && closeDataExplanation.value !== undefined) {
				closeDataExplanation.value.focus();
			}
		};

		const emitNewSearch = () => {
			if (yearSearch.value && yearSearch.value.expanderOpen) {
				emit('newSearch', true);
			} else {
				if (props.timeline) {
					startDate.value.setFullYear(timeSliderValues.value[0]);
					endDate.value.setFullYear(timeSliderValues.value[1]);
				}
				emit('newSearch', false);
			}
			if (yearSearch.value) {
				const resultContainer = document.getElementsByClassName('result-options')[0];
				resultContainer?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			}
			timeSearchStore.setNewSearchReqMet(false);
		};

		const updateStartYear = (val: number) => {
			timeSliderValues.value[0] = Number(val);
			startDate.value.setFullYear(val);
			if (Number(val) > timeSliderValues.value[1]) {
				timeSliderValues.value[1] = Number(val);
				endDate.value.setFullYear(val);
			}
			emitNewSearch();
		};

		const updateEndYear = (val: number) => {
			endDate.value.setFullYear(val);
			timeSliderValues.value[1] = Number(val);
			if (Number(val) < timeSliderValues.value[0]) {
				timeSliderValues.value[0] = Number(val);
				startDate.value.setFullYear(val);
			}
			emitNewSearch();
		};

		const closeTimeFacets = () => {
			emit('close');
		};

		const updateCheckbox = (array: SelectorData[], index: number, val: boolean) => {
			array[index].selected = val;
			timeSearchStore.setNewSearchReqMet(true);
			if (!props.picker) {
				emitNewSearch();
			}
		};

		const updateAllCheckbox = (array: SelectorData[], index: number, val: boolean) => {
			timeSearchStore.setNewSearchReqMet(true);

			if (val) {
				array.forEach((item) => {
					item.selected = true;
				});
			} else {
				array.forEach((item) => {
					item.selected = false;
				});
			}
			if (!props.picker) {
				emitNewSearch();
			}
		};

		const figuresImage = computed(() => {
			return new URL(`@/assets/images/dr_kalender-sprite2.png`, import.meta.url).href;
		});

		const timelapseImage = computed(() => {
			return new URL(`@/assets/images/timegoes.svg`, import.meta.url).href;
		});

		return {
			t,
			months,
			days,
			timeslots,
			timeSliderValues,
			startDate,
			endDate,
			data,
			selectYears,
			updateCheckbox,
			updateAllCheckbox,
			updateEndYear,
			updateStartYear,
			figuresImage,
			timelapseImage,
			timeSearchStore,
			dataContainer,
			emitNewSearch,
			getSublineForMonths,
			getSublineForDays,
			getSublineForTimeslots,
			yearSearch,
			getSublineForYears,
			dataButton,
			toggleExplanation,
			expToggled,
			closeTimeFacets,
			addTestDataEnrichment,
			vueSliderRef,
			closeDataExplanation,
		};
	},
});
</script>

<style scoped>
.to-from-container {
	display: flex;
	flex-direction: row;
	align-content: center;
	flex-wrap: nowrap;
	justify-content: space-evenly;
	align-items: center;
	gap: 10px;
	margin-bottom: 30px;
	font-size: 20px;
	text-transform: capitalize;
}

.expand-container-days {
	max-width: 735px;
}

.expand-container-time {
	max-width: 410px;
	overflow: hidden;
	min-width: 410px;
}

.expand-container-days,
.expand-container-time {
	display: flex;
	padding-bottom: 80px;
}
.dotted-separator {
	box-sizing: border-box;
	height: 2px;
	border-top: 2px dashed white;
	background-color: rgb(218, 218, 218);
}

.checkbox.all {
	width: 150px;
	display: flex;
	align-content: flex-start;
	flex-wrap: wrap;
	flex-direction: column;
	justify-content: center;
	margin-top: 26px;
}

.all-months-items .checkbox {
	width: calc((100% - 80px) / 12);
	display: flex;
	justify-content: flex-end;
	align-content: center;
	align-items: center;
	flex-wrap: nowrap;
	position: relative;
	top: 2px;
	left: -25px;
	align-content: flex-end;
}

.all-days-items .checkbox {
	width: calc((100%) / 7);
	display: flex;
	justify-content: flex-end;
	align-content: center;
	align-items: center;
	flex-wrap: nowrap;
	position: relative;
	left: -25px;
	align-content: flex-end;
}

.checkbox-title {
	white-space: nowrap;
	margin-bottom: 5px;
	display: flex;
}

.checkbox-title .material-icons {
	color: #002e70;
	display: inline-block;
}

.title-span {
	text-transform: capitalize;
	width: 150px;
	display: inline-block;
}

.info-span {
	display: flex;
	flex-direction: row;
	align-items: center;
	color: #002e70;
	z-index: 5;
}

fieldset {
	padding: 0px;
	border: 0px;
	margin: 0px;
	min-inline-size: auto;
}

.info-span .bold {
	font-weight: bold;
	padding-left: 7px;
}

.time-selection {
	width: 100%;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-o-user-select: none;
	user-select: none;
	height: auto;
}

.all-timeslot-items .checkbox {
	width: calc((100% - 150px) / 4);
	display: flex;
	justify-content: center;
	align-content: center;
	align-items: center;
	flex-wrap: nowrap;
	position: relative;
	left: -25px;
	align-content: flex-end;
	top: -4px;
}

.slider-whiteoff-container {
	position: relative;
	display: none;
}
.explanation-for-data {
	position: absolute;
	width: 100%;
	min-height: 100px;
	top: 0px;
	left: 0px;
	background-color: #c4f1ed;
	z-index: 10;
	border: 1px solid #002e70;
	color: #002e70;
	padding: 20px 40px;
	box-sizing: border-box;
	display: flex;
}
.explanation-for-data button {
	position: absolute;
	top: 5px;
	right: 5px;
	border: 0px;
	background-color: transparent;
	font-size: 25px;
	color: #002e70;
	cursor: pointer;
}

.slider-whiteoff-container:before,
.slider-whiteoff-container:after {
	content: '';
	display: block;
	position: absolute;
	width: 5vw;
	height: 100px;
	pointer-events: none;
	z-index: 5;
	left: -1px;
	background: linear-gradient(-90deg, rgba(215, 255, 98, 0) 0%, rgb(250, 250, 250) 95%);
}

.slider-whiteoff-container:after {
	right: -1px;
	left: initial;
	top: 0px;
	background: linear-gradient(90deg, rgba(215, 255, 98, 0) 0%, rgb(250, 250, 250) 95%);
}

.figures {
	min-height: 100px;
	width: 100%;
	background-repeat: no-repeat;
	background-size: 100%;
	aspect-ratio: 1113 / 106;
	position: relative;
	z-index: 1;
	top: -2px;
	background-position: bottom;
}

.gradient {
	position: relative;
	z-index: 0;
	margin-top: -9px;
	height: 35px;
	background: transparent
		linear-gradient(
			90deg,
			#ffffff 0%,
			#c9f0fe 3%,
			#c4f1ed 14%,
			#c4f1ed 21%,
			#f2b652 34%,
			#f7ae3b 38%,
			#f7ae3b 50%,
			#c4f1ed 71%,
			#c4f1ed 79%,
			#c9f0fe 82%,
			#fdfdfd 100%
		)
		0% 0% no-repeat padding-box;
}

.month-selector {
	width: calc(100% - 155px);
}

.day-selector {
	width: calc(100% - 155px);
}

.select-container.month {
	display: flex;
	width: 100%;
	min-width: 1000px;
}

.select-container,
.slider-container {
	margin: 5px 0px;
}

.slider-container {
	height: 60px;
	padding-bottom: 0px;
	margin-bottom: 0px;
	position: relative;
}

.data-size {
	display: none;
	background: #c4f1ed 0% 0% no-repeat padding-box;
	border: 1px solid #ffffff;
	border-radius: 4px;
	text-transform: uppercase;
	position: absolute;
	text-align: center;
	letter-spacing: 0px;
	color: #002e70;
	padding: 3px;
	top: 90px;
	z-index: 10;
	cursor: pointer;
}

.picker-container {
	margin-bottom: 45px;
}

.overall-selector {
	user-select: none;
	display: flex;
	flex-direction: column;
	width: calc(100%);
	padding-bottom: 20px;
}

.month-selector-expanding {
	margin-top: 5px;
	margin-bottom: 50px;
}

.select-container.days {
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-top: 5px;
	margin-bottom: 50px;
	box-sizing: border-box;
}

.select-time {
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-top: 5px;
	margin-bottom: 50px;
}

.day-gradient {
	background: transparent
		linear-gradient(270deg, #ffffff00 0%, #c4f1ed 4%, #002e70 8%, #042c65 51%, #002e70 92%, #c9f0fe 94%, #ffffff00 100%)
		0% 0% no-repeat padding-box;
	position: absolute;
	width: calc(103%);
	top: 57px;
	right: -3%;
	height: 36px;
}

.all-months-items {
	display: flex;
	justify-content: space-between;
	gap: 2px;
	height: 130px;
	position: relative;
	margin-top: -94px;
	z-index: 2;
	margin-bottom: 40px;
}

.timelapse {
	width: calc(100% - 184px);
	background-repeat: no-repeat;
	background-size: 100%;
	aspect-ratio: 1113 / 106;
	position: absolute;
	z-index: 01;
	background-position: bottom;
	right: 120px;
	top: 15px;
	height: 70px;
}

.time-gradient {
	background: transparent
		linear-gradient(
			90deg,
			#c9f0fe 0%,
			#c9f0fe 8%,
			#d2dfbd 17%,
			#f7ae3b 30%,
			#f7ae3b 45%,
			#c4f1ed 63%,
			#002e70 77%,
			#002b69 89%,
			#001f4b 95%,
			#001a40 100%,
			#ffffff 100%
		)
		0% 0% no-repeat padding-box;
	position: absolute;
	width: calc(100% - 215px);
	top: 58px;
	right: 143px;
	height: 36px;
	z-index: 1;
}

.all-timeslot-items {
	display: flex;
	justify-content: right;
	gap: 2px;
	z-index: 2;
	top: 7px;
	position: relative;
	height: 130px;
	width: 100%;
	justify-content: flex-start;
}

.all-days-items {
	display: flex;
	justify-content: space-between;
	height: 130px;
	position: relative;
	gap: 2px;
	z-index: 2;
	width: calc(100% - 200px);
	top: 7px;
}

.day-button,
.month-button,
.time-button {
	height: 40px;
	border: 0px;
	border-bottom: 2px solid #b3b3b32b;
	user-select: none;
	color: #b3b3b3;
	cursor: pointer;
	background-color: transparent;
	text-transform: uppercase;
	font-weight: bold;
	font-size: 14px;
	position: relative;
	padding: 0px;
	margin: 0px;
	font-family: noway, sans-serif;
	transition: all 0.1s linear 0s;
}

.day-button:first-of-type:after,
.month-button:first-of-type:after {
	display: none;
}

.month-button {
	width: calc(100% / 12);
}

.day-button {
	width: calc(100% / 7);
}

.time-button {
	width: calc(100% / 4);
}

.day-button.selected,
.month-button.selected,
.time-button.selected {
	background-color: transparent;
	border-bottom: 2px solid #002e70;
	color: #002e70;
}

.picker-background {
	background-color: #d9f5fe;
	margin-top: 15px;
}

.apply-time-facets-container {
	display: flex;
	justify-content: center;
	position: relative;
	margin-bottom: 30px;
}

.apply-time-facets {
	background-color: transparent;
	cursor: pointer;
	padding: 5px 7px;
	font-size: 18px;
	width: fit-content;
	display: flex;
	align-items: center;
	box-shadow: 1px 1px 2px #00000000;
	border: 1px solid #d9d8d8;
	background: #002e70;
	color: white;
	border-radius: 4px;
	transition: all 0s linear 0s;
	margin-left: 10px;
	z-index: 1;
	position: relative;
	overflow: hidden;
}

.apply-time-facets:disabled {
	color: grey;
	background-color: white;
}

.apply-time-facets:disabled:after {
	display: none;
}

.apply-time-facets:after {
	transform: translateX(-100%);
	content: '';
	display: block;
	position: absolute;
	width: 200%;
	height: 100%;
	background: linear-gradient(
		45deg,
		rgba(255, 255, 255, 0) 10%,
		rgba(255, 255, 255, 1) 50%,
		rgba(255, 255, 255, 0) 80%
	);
	animation: shine 4s ease-in-out infinite;
}

@keyframes shine {
	50% {
		transform: translateX(-100%);
		transition-property: opacity, transform;
	}
	100% {
		transform: translateX(200%);
		transition-property: opacity, transform;
	}
}

.close {
	cursor: pointer;
	font-size: 18px;
	width: fit-content;
	display: flex;
	align-items: center;
	box-shadow: 1px 1px 2px #00000000;
	border: 1px solid #d9d8d8;
	background: rgb(250, 250, 250);
	color: #002e70;
	border-radius: 4px;
	transition: all 0s linear 0s;
	position: absolute;
	left: 0px;
	padding: 5px 7px;
}

.data-container {
	width: calc(100%);
	height: 60px;
	overflow: hidden;
	user-select: none;
	pointer-events: none;
	position: absolute;
	z-index: 4;
	margin-top: 2px;
	border-bottom: 1px solid #002e70;
	box-sizing: border-box;
}
/* MEDIA QUERY 990 */
@media (min-width: 1200px) {
	.overall-selector {
		flex-direction: row;
	}
	.select-container.days {
		width: calc(65% - 25px);
		margin-right: 25px;
	}
	.select-container.select-time {
		width: 35%;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.slider-whiteoff-container {
		display: block;
	}
	.data-size {
		display: block;
	}
	.slider-container {
		height: 96px;
		padding-bottom: 40px;
		margin-bottom: 60px;
	}
}

@media (min-width: 990px) {
	.to-from-container {
		justify-content: flex-start;
	}
}
</style>
