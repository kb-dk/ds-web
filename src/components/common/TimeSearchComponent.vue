<template>
	<div>
		<div class="slider-container">
			<h3>
				{{ $t('timeSearch.chosenYears') }}
				<span>
					<SelectComponent
						:current-selected="values[0]"
						:list-items="selectYears"
						@update-selected="updateStartYear"
					/>
					-
					<SelectComponent
						:current-selected="values[1]"
						:list-items="selectYears"
						@update-selected="updateEndYear"
					/>
				</span>
			</h3>
			<div
				ref="dataContainer"
				class="data-container"
			></div>
			<Transition name="fade">
				<VueSlider
					v-if="data.length > 0"
					v-model="values"
					:clickable="true"
					:drag-on-click="true"
					:data="data"
					data-label="key"
					tooltip="always"
					@drag-end="getTimeResults()"
				></VueSlider>
			</Transition>
		</div>
		<div class="select-container">
			<h3>
				{{ $t('timeSearch.chosenMonths') }}
				<span class="explanation">{{ currentlySelectedValues(months) }}</span>
			</h3>
			<div class="month-selector">
				<button
					v-for="(item, index) in months"
					:key="index"
					:class="months[index].selected ? 'month-button selected' : 'month-button'"
					@click="setSelected(months, index)"
				>
					{{ $t(months[index].name) }}
				</button>
			</div>
		</div>
		<div class="overall-selector">
			<div class="select-container select-days">
				<h3>
					{{ $t('timeSearch.chosenDays') }}
					<span class="explanation">{{ currentlySelectedValues(days) }}</span>
				</h3>
				<div class="day-selector">
					<button
						v-for="(item, index) in days"
						:key="index"
						:class="days[index].selected ? 'day-button selected' : 'day-button'"
						@click="setSelected(days, index)"
					>
						{{ $t(days[index].name) }}
					</button>
				</div>
			</div>
			<div class="select-container select-time">
				<h3>
					{{ $t('timeSearch.chosenTimeslots') }}
					<span class="explanation">{{ currentlySelectedValues(timeslots) }}</span>
				</h3>
				<div class="day-selector">
					<button
						v-for="(item, index) in timeslots"
						:key="index"
						:class="timeslots[index].selected ? 'time-button selected' : 'time-button'"
						@click="setSelected(timeslots, index)"
					>
						{{ $t(timeslots[index].name) }}
					</button>
				</div>
			</div>
		</div>
		<div class="result-container">
			<h3>{{ timeSearchStore.numFound }} {{ $t('timeSearch.foundResults') }}</h3>
			<div class="time-results">
				<div
					v-for="(item, index) in timeSearchStore.timeResults"
					:key="index"
					class="time-result-item"
				>
					<GridResultItem :resultdata="item"></GridResultItem>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import VueSlider from 'vue-3-slider-component';
import GridResultItem from '@/components/common/GridResultItem.vue';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { watch } from 'vue';
import { APIService } from '@/api/api-service';
import SelectComponent from '@/components/common/SelectComponent.vue';
import { useI18n } from 'vue-i18n';
import { pointItem, SelectorData, markerData, dataItem, SelectableItem } from '@/types/TimeSearchTypes';
import { createSVGCurvedLine } from '@/utils/svg-graph';

export default defineComponent({
	name: 'TimeSearchComponent',
	components: {
		VueSlider,
		GridResultItem,
		SelectComponent,
	},
	setup() {
		const { t } = useI18n();

		const timeSearchStore = useTimeSearchStore();
		const values = ref([1992, 2002]);
		const test = ref(1992);
		const dataContainer = ref<HTMLDivElement>();
		const fullYearArray = ref([] as pointItem[]);
		const startYear = ref(0);
		const endYear = ref(0);

		const selectYears = ref([] as string[]);

		const days = ref([
			{ name: 'timeSearch.weekdays.monday', value: 'Monday', selected: true },
			{ name: 'timeSearch.weekdays.tuesday', value: 'Tuesday', selected: true },
			{ name: 'timeSearch.weekdays.wednesday', value: 'Wednesday', selected: true },
			{ name: 'timeSearch.weekdays.thursday', value: 'Thursday', selected: true },
			{ name: 'timeSearch.weekdays.friday', value: 'Friday', selected: true },
			{ name: 'timeSearch.weekdays.saturday', value: 'Saturday', selected: true },
			{ name: 'timeSearch.weekdays.sunday', value: 'Sunday', selected: true },
		]);
		const timeslots = ref([
			{ name: 'timeSearch.timeslots.morning', value: `${encodeURIComponent(`[6 TO 12]`)}`, selected: true },
			{ name: 'timeSearch.timeslots.midday', value: `${encodeURIComponent(`[12 TO 18]`)}`, selected: true },
			{ name: 'timeSearch.timeslots.evening', value: `${encodeURIComponent(`[18 TO 24]`)}`, selected: true },
			{ name: 'timeSearch.timeslots.night', value: `${encodeURIComponent(`[0 TO 6]`)}`, selected: true },
		]);

		const months = ref([
			{ name: 'timeSearch.months.january', value: '1', selected: true },
			{ name: 'timeSearch.months.february', value: '2', selected: true },
			{ name: 'timeSearch.months.march', value: '3', selected: true },
			{ name: 'timeSearch.months.april', value: '4', selected: true },
			{ name: 'timeSearch.months.may', value: '5', selected: true },
			{ name: 'timeSearch.months.june', value: '6', selected: true },
			{ name: 'timeSearch.months.july', value: '7', selected: true },
			{ name: 'timeSearch.months.august', value: '8', selected: true },
			{ name: 'timeSearch.months.september', value: '9', selected: true },
			{ name: 'timeSearch.months.october', value: '10', selected: true },
			{ name: 'timeSearch.months.november', value: '11', selected: true },
			{ name: 'timeSearch.months.december', value: '12', selected: true },
		]);

		const currentlySelectedValues = (selectedArray: SelectorData[]) => {
			const manipulatedArray = [...selectedArray];
			const chosenEntities = manipulatedArray.filter((entity) => entity.selected).map((entity) => entity.name);
			if (chosenEntities.length === selectedArray.length) {
				return t('timeSearch.allChosen');
			} else if (chosenEntities.length === 1) {
				return t(chosenEntities[0]) + ' ' + t('timeSearch.chosen');
			} else {
				const lastMonth = chosenEntities.pop() as string;
				const translatedEntities = chosenEntities.map((entity) => t(entity));
				return `${translatedEntities.join(', ')} ${t('timeSearch.and')} ${t(lastMonth)} ${t('timeSearch.chosen')}`;
			}
		};

		const data = ref([] as markerData[]);

		onMounted(() => {
			getTimeResults();

			APIService.getFullResultWithFacets().then((reponse) => {
				const resultsInYears = reponse.data.facet_counts.facet_fields.temporal_start_year;
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
				startYear.value = Number(sortedResults[0].year);
				endYear.value = Number(sortedResults[sortedResults.length - 1].year);
				for (let i = startYear.value; i <= endYear.value; i++) {
					selectYears.value.push(i.toString());
					data.value.push({ key: i, value: i } as markerData);
					const item = sortedResults.find((item) => item.year.includes(i.toString()));
					const newEntry = {} as pointItem;
					newEntry.x = Number(((100 / (endYear.value - startYear.value)) * (i - startYear.value)).toFixed(2));
					if (item) {
						newEntry.year = item.year;
						newEntry.items = item.items;
						newEntry.y = item.items;
						fullYearArray.value.push(newEntry);
					} else {
						newEntry.year = i.toString();
						newEntry.items = 0;
						newEntry.y = 0;
						fullYearArray.value.push(newEntry);
					}
				}
				//console.log(fullYearArray);
				const svgElement = createSVGCurvedLine(fullYearArray.value);
				if (dataContainer.value) {
					dataContainer.value.appendChild(svgElement);
				}
			});
		});

		const getTimeResults = () => {
			console.log('new results please');
			timeSearchStore.getTimeSearchResults(
				values.value[0].toString(),
				values.value[1].toString(),
				getSelectedFromArray(months.value),
				getSelectedFromArray(days.value),
				getSelectedFromArray(timeslots.value),
			);
		};

		const updateStartYear = (val: number) => {
			values.value[0] = Number(val);
			if (Number(val) > values.value[1]) {
				values.value[1] = Number(val);
			}
			getTimeResults();
		};

		const updateEndYear = (val: number) => {
			values.value[1] = Number(val);
			if (Number(val) < values.value[0]) {
				values.value[0] = Number(val);
			}
			getTimeResults();
		};

		const getSelectedFromArray = (array: SelectorData[]) => {
			return array.filter((entity) => entity.selected).map((entity) => entity.value);
		};

		const setSelected = (variable: SelectableItem[], index: number) => {
			variable[index].selected = !variable[index].selected;
		};

		watch(
			[days, months, timeslots],
			() => {
				getTimeResults();
			},
			{ deep: true },
		);

		return {
			values,
			data,
			getTimeResults,
			timeSearchStore,
			days,
			months,
			setSelected,
			dataContainer,
			timeslots,
			fullYearArray,
			selectYears,
			updateStartYear,
			updateEndYear,
			test,
			currentlySelectedValues,
		};
	},
});
</script>

<style scroped>
.vue-slider-rail {
	background-color: #002e70 !important;
	border-radius: 0px !important;
}

.vue-slider {
	height: 40px !important;
}
.vue-slider-process {
	border-radius: 0px !important;
	background-color: #caf0fe !important;
	z-index: 5 !important;
	opacity: 0.5;
}

.vue-slider-mark-step {
	border-radius: 0px !important;
}

.vue-slider-mark {
	width: 2px !important;
	height: 40% !important;
	background-color: #caf0fe !important;
	margin-bottom: 20px;
}

.vue-slider-mark-label {
	padding-top: 5px;
}

.vue-slider-dot-tooltip-inner {
	background-color: #fff6c4 !important;
	color: black !important;
}

.vue-slider-dot-tooltip-inner-bottom:after,
.vue-slider-dot-tooltip-inner-top:after {
	border-top-color: #fff6c4 !important;
	color: black !important;
}

.vue-slider-marks .vue-slider-mark:first-of-type .vue-slider-mark-label {
	left: 15px !important;
}

.vue-slider-marks .vue-slider-mark:last-of-type .vue-slider-mark-label {
	left: -10px !important;
}

.vue-slider-marks .vue-slider-mark .vue-slider-mark-label {
	display: none;
}

.vue-slider-marks .vue-slider-mark:nth-child(5n) .vue-slider-mark-label {
	display: block;
}

h3 span {
	font-size: 12px;
	opacity: 0.6;
}

.time-results {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: 20px;
	flex-wrap: wrap;
}

.select-container,
.slider-container {
	margin: 5px 0px;
	padding: 5px;
	background-color: #caf0fe56;
}

.slider-container {
	height: 96px;
	padding-bottom: 40px;
	margin-bottom: 10px;
}

.time-result-item {
	flex: 1 1 calc(25% - 20px);
	max-width: calc(25% - 15px);
	box-sizing: border-box;
}

h3 {
	margin-top: 0px;
	margin-bottom: 5px;
	text-transform: uppercase;
}

.month-selector,
.day-selector {
	display: flex;
	justify-content: space-between;
	gap: 2px;
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

.result-container {
	padding-top: 25px;
}

.data-container {
	width: 100%;
	height: 40px;
	overflow: hidden;
	user-select: none;
	pointer-events: none;
	position: absolute;
	z-index: 5;
	margin-top: 7px;
}

.overall-selector {
	display: flex;
	gap: 10px;
}

.select-days {
	width: 60%;
}

.select-time {
	width: 40%;
}

@media (min-width: 480px) {
	.data-container {
		max-width: 640px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.data-container {
		max-width: 990px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.data-container {
		max-width: 1150px;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.data-container {
		max-width: 1280px;
	}
}
</style>
