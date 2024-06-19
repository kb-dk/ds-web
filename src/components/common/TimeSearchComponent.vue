<template>
	<div>
		<h1>Tidsmaskinen</h1>
		<div class="slider-container">
			<div class="data-size">datamængde</div>
			<div class="to-from-container">
				Fra:
				<SelectComponent
					:current-selected="values[0]"
					:list-items="selectYears"
					@update-selected="updateStartYear"
				/>
				Til:
				<SelectComponent
					:current-selected="values[1]"
					:list-items="selectYears"
					@update-selected="updateEndYear"
				/>
			</div>
			<div class="slider-whiteoff-container">
				<div
					ref="dataContainer"
					class="data-container"
				></div>
				<div class="dotted-separator"></div>
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
		</div>
		<ItemSlider
			bg-scroll-white="true"
			item-class="month"
		>
			<div class="time-selection">
				<div class="select-container month">
					<div class="checkbox all">
						<span class="checkbox-title">Måneder:</span>
						<CustomCheckbox
							:index="0"
							name="alle"
							:val="true"
							:tilted="false"
							:update="updateAllCheckbox"
							:parent-array="months"
						></CustomCheckbox>
					</div>
					<div class="month-selector">
						<div
							:style="'background-image:url(' + backgroundImage + ')'"
							class="figures"
						></div>
						<div class="gradient"></div>
						<div class="all-months-items">
							<div
								v-for="(item, index) in months"
								:key="index"
								class="checkbox"
							>
								<CustomCheckbox
									:index="index"
									:name="months[index].name"
									:val="months[index].selected"
									:tilted="true"
									:update="updateCheckbox"
									:parent-array="months"
								></CustomCheckbox>
							</div>
						</div>
					</div>
				</div>
				<div class="overall-selector">
					<div class="select-container select-days">
						<div class="checkbox all">
							<span class="checkbox-title">Dage:</span>
							<CustomCheckbox
								:index="1"
								name="alle"
								:val="true"
								:tilted="false"
								:parent-array="days"
								:update="updateAllCheckbox"
							></CustomCheckbox>
						</div>
						<div class="all-days-items">
							<div
								v-for="(item, index) in days"
								:key="index"
								class="checkbox"
							>
								<CustomCheckbox
									:index="index"
									:name="days[index].name"
									:val="days[index].selected"
									:tilted="true"
									:update="updateCheckbox"
									:parent-array="days"
								></CustomCheckbox>
							</div>
						</div>
					</div>
					<div class="select-container select-time">
						<div class="all-timeslot-items">
							<div
								v-for="(item, index) in timeslots"
								:key="index"
								class="checkbox"
							>
								<CustomCheckbox
									:index="index"
									:name="timeslots[index].name"
									:val="timeslots[index].selected"
									:tilted="true"
									:update="updateCheckbox"
									:parent-array="timeslots"
								></CustomCheckbox>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ItemSlider>
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
import { defineComponent, ref, onMounted, computed } from 'vue';
import VueSlider from 'vue-3-slider-component';
import GridResultItem from '@/components/common/GridResultItem.vue';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { watch } from 'vue';
import { APIService } from '@/api/api-service';
import SelectComponent from '@/components/common/SelectComponent.vue';
import { useI18n } from 'vue-i18n';
import { pointItem, SelectorData, markerData, dataItem, SelectableItem } from '@/types/TimeSearchTypes';
import { createSVGCurvedLine } from '@/utils/svg-graph';
import ItemSlider from '../search/ItemSlider.vue';
import CustomCheckbox from '@/components/common/CustomCheckbox.vue';
export default defineComponent({
	name: 'TimeSearchComponent',
	components: {
		VueSlider,
		GridResultItem,
		SelectComponent,
		ItemSlider,
		CustomCheckbox,
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

		const updateCheckbox = (array: SelectorData[], index: number, val: boolean) => {
			array[index].selected = val;
		};

		const updateAllCheckbox = (array: SelectorData[], index: number, val: boolean) => {
			if (val === true) {
				array.forEach((item) => {
					item.selected = true;
				});
			} else {
				array.forEach((item, index) => {
					if (index === 0) {
						item.selected = true;
					} else {
						item.selected = false;
					}
				});
			}
		};

		const currentlySelectedValues = (selectedArray: SelectorData[]) => {
			const manipulatedArray = [...selectedArray];
			const chosenEntities = manipulatedArray.filter((entity) => entity.selected).map((entity) => entity.name);
			if (chosenEntities.length === selectedArray.length) {
				return t('timeSearch.allChosen');
			} else if (chosenEntities.length === 1) {
				return t(chosenEntities[0]) + ' ' + t('timeSearch.chosen');
			} else if (chosenEntities.length === 0) {
				return t('timeSearch.notApplied');
			} else {
				const lastMonth = chosenEntities.pop() as string;
				const translatedEntities = chosenEntities.map((entity) => t(entity));
				return `${translatedEntities.join(', ')} ${t('timeSearch.and')} ${t(lastMonth)} ${t('timeSearch.chosen')}`;
			}
		};

		const data = ref([] as markerData[]);

		const backgroundImage = computed(() => {
			return new URL(`@/assets/images/dr_kalender-sprite.svg`, import.meta.url).href;
		});

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
			backgroundImage,
			updateCheckbox,
			updateAllCheckbox,
		};
	},
});
</script>

<style>
h1 {
	font-family: 'LibreBaskerville';
	font-weight: 100;
	text-transform: uppercase;
	color: #002e70;
	font-size: 32px;
}

.to-from-container {
	display: flex;
	flex-direction: row;
	align-content: center;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: center;
	gap: 10px;
	margin-bottom: 15px;
	font-size: 20px;
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
}

.all-months-items .checkbox {
	width: calc((100% - 80px) / 12);
	display: flex;
	justify-content: flex-end;
	align-content: center;
	align-items: center;
	flex-wrap: nowrap;
	position: relative;

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
	margin-bottom: 5px;
}

.time-selection {
	width: 100%;
}

.all-timeslot-items .checkbox {
	width: calc((100% - 100px) / 4);
	display: flex;
	justify-content: center;
	align-content: center;
	align-items: center;
	flex-wrap: nowrap;
	position: relative;
	left: -25px;
	align-content: flex-end;
}

.slider-whiteoff-container:before,
.slider-whiteoff-container:after {
	content: '';
	display: block;
	position: absolute;
	width: 5vw;
	height: 100px;
	pointer-events: none;
	z-index: 100;
	left: -1px;
	background: linear-gradient(-90deg, rgba(215, 255, 98, 0) 0%, rgba(255, 255, 255, 1) 95%);
}

.slider-whiteoff-container:after {
	right: -1px;
	left: initial;
	top: 35px;
	background: linear-gradient(90deg, rgba(215, 255, 98, 0) 0%, rgba(255, 255, 255, 1) 95%);
}

.vue-slider-rail {
	background-color: white !important;
	border-radius: 0px !important;
}

.vue-slider {
	height: 60px !important;
	padding: 0px !important;
}
.vue-slider-process {
	border-radius: 0px !important;
	background-color: #caf0fe !important;
	z-index: 5 !important;
	opacity: 0.5;
	mix-blend-mode: hue !important;
	filter: hue-rotate(245deg) !important;
}

.vue-slider-mark-step {
	border-radius: 0px !important;
}

.vue-slider-dot {
	width: 8px !important;
	border: 1px solid #002e70;
	height: 100% !important;
	background-color: #f7ae3b !important;
	display: flex;
	box-sizing: border-box;
	border-radius: 5px;
}

.vue-slider-dot-handle {
	height: 15px !important;
	width: 15px !important;
	margin-top: 20px !important;
	margin-left: -15px !important;
	left: 10px;
	position: relative;
}

.vue-slider-mark {
	width: 2px !important;
	height: 15% !important;
	background-color: #002e70 !important;
	margin-bottom: 10px !important;
	position: relative;
	top: 92% !important;
}

.vue-slider-mark-label {
	padding-top: 5px;
	transform: rotateZ(-35deg) translate(-50%, -50%) !important;
	left: -25px !important;
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
	color: #002e70;
}

.vue-slider-marks .vue-slider-mark:nth-child(5n) {
	height: 50% !important;
	top: 75% !important;
}

.vue-slider-marks .vue-slider-mark:nth-child(5n) .vue-slider-mark-step:after {
	content: '';
	display: block;
	width: 20px;
	border-top: 2px solid #002e70;
	height: 2px;
	left: -6px;
	position: absolute;
	top: calc(100%);
	transform: rotateZ(-35deg) translate(-50%, -50%);
	transform-origin: center;
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

.figures {
	width: 100%;
	background-repeat: no-repeat;
	background-size: 100%;
	aspect-ratio: 1113 / 106;
	position: relative;
	z-index: 1;
	top: -3px;
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
	height: 96px;
	padding-bottom: 40px;
	margin-bottom: 60px;
	position: relative;
}

.data-size {
	background: #c4f1ed 0% 0% no-repeat padding-box;
	border: 1px solid #ffffff;
	border-radius: 4px;
	text-transform: uppercase;
	position: absolute;
	text-align: center;
	letter-spacing: 0px;
	color: #002e70;
	padding: 2px;
	top: 71px;
	z-index: 101;
}

.time-result-item {
	flex: 1 1 calc(25% - 20px);
	max-width: calc(25% - 15px);
	box-sizing: border-box;
}

.overall-selector {
	user-select: none;
	height: 150px;
	display: flex;
	width: 100%;
	min-width: 1000px;
}

.select-days {
	width: calc(65%);
	display: flex;
}

.select-time {
	width: calc(35%);
	display: flex;
	justify-content: flex-end;
}

.all-months-items {
	display: flex;
	justify-content: space-between;
	gap: 2px;
	height: 130px;
	position: relative;
	margin-top: -92px;
	z-index: 2;
	margin-bottom: 40px;
}

.all-timeslot-items {
	display: flex;
	justify-content: right;
	gap: 2px;
	z-index: 2;
}

.all-days-items {
	display: flex;
	justify-content: space-between;
	height: 130px;
	position: relative;
	gap: 2px;
	z-index: 2;
	width: calc(100% - 150px);
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

	.figures {
		top: 0px;
	}
}
</style>
