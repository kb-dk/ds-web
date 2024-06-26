<template>
	<EdgedContentArea background-color="#FAFAFA">
		<template #content>
			<h1>{{ $t('timeSearch.timeMachine') }}</h1>
			<div class="slider-container">
				<div class="data-size">{{ $t('timeSearch.data') }}:</div>
				<div class="to-from-container">
					{{ $t('timeSearch.from') }}:
					<CustomTimelineSelect
						:current-selected="TimeSliderValues[0]"
						:list-items="selectYears"
						@update-selected="updateStartYear"
					/>
					{{ $t('timeSearch.to') }}:

					<CustomTimelineSelect
						:current-selected="TimeSliderValues[1]"
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
							v-model="TimeSliderValues"
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
				bg="#ffffff00"
				item-class="month"
			>
				<div class="time-selection">
					<div class="select-container month">
						<div class="checkbox all">
							<span class="checkbox-title">
								<span class="title-span">
									{{ $t('timeSearch.month', months.filter((obj) => obj.selected).length) }}
								</span>
								<span class="info-span">
									<span class="material-icons">event</span>
									{{ showMonthSelection(TimeSliderValues, months, t) }}
									<span class="bold">{{ showMonthResult(TimeSliderValues, months, t) }}</span>
								</span>
							</span>
							<CustomTimelineCheckbox
								:index="0"
								name="timeSearch.all"
								:val="true"
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
					<div class="overall-selector">
						<div class="select-container days">
							<div class="checkbox all">
								<span class="checkbox-title">
									<span class="title-span">
										{{ $t('timeSearch.day', days.filter((obj) => obj.selected).length) }} :
									</span>
									<span class="info-span">
										<span class="material-icons">event</span>
										{{ showDaySelection(TimeSliderValues, months, days, t) }}
										<span class="bold">{{ showDayResult(TimeSliderValues, months, days, t) }}</span>
									</span>
								</span>
								<CustomTimelineCheckbox
									:index="1"
									name="timeSearch.all"
									:val="true"
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
						<div class="select-container select-time">
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
					</div>
				</div>
			</ItemSlider>
			<div class="result-container">
				<h3>
					{{ $t('timeSearch.timeHits') }}
					<span class="bold">{{ new Intl.NumberFormat('de-DE').format(timeSearchStore.numFound) }}</span>
					{{ $t('timeSearch.result', timeSearchStore.numFound) }}
				</h3>
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
			<div class="further-link">
				<router-link
					class="link"
					:to="timeSearchLink"
				>
					<div class="further-results">
						<div class="recap">{{ selectionSummary(TimeSliderValues, months, days, t) }}</div>
						<div class="hits">
							{{ $t('timeSearch.timeHits') }}
							<span class="bold">{{ new Intl.NumberFormat('de-DE').format(timeSearchStore.numFound) }}</span>
							{{ $t('timeSearch.result', timeSearchStore.numFound) }}
						</div>
					</div>
					<div class="material-icons">navigate_next</div>
				</router-link>
			</div>
		</template>
	</EdgedContentArea>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { APIService } from '@/api/api-service';
import { useI18n } from 'vue-i18n';
import { pointItem, markerData, dataItem } from '@/types/TimeSearchTypes';
import { createSVGCurvedLine } from '@/utils/svg-graph';
import { months, days, timeslots } from '@/components/common/TimeSearch/TimeSearchInitValues';
import {
	selectionSummary,
	showMonthSelection,
	showMonthResult,
	showDaySelection,
	showDayResult,
	updateCheckbox,
	updateAllCheckbox,
	getSelectedFromArray,
} from '@/utils/time-search-utils';

import VueSlider from 'vue-3-slider-component';
import GridResultItem from '@/components/common/GridResultItem.vue';
import CustomTimelineSelect from '@/components/common/CustomTimelineSelect.vue';
import ItemSlider from '../search/ItemSlider.vue';
import CustomTimelineCheckbox from '@/components/common/CustomTimelineCheckbox.vue';
import EdgedContentArea from '../global/content-elements/EdgedContentArea.vue';

import '@/assets/styles/vue-slider-styles.css';

export default defineComponent({
	name: 'TimeSearchComponent',
	components: {
		VueSlider,
		GridResultItem,
		CustomTimelineSelect,
		ItemSlider,
		CustomTimelineCheckbox,
		EdgedContentArea,
	},
	setup() {
		const { t } = useI18n();

		const timeSearchStore = useTimeSearchStore();
		const TimeSliderValues = ref([1992, 2002]);
		const dataContainer = ref<HTMLDivElement>();
		const fullYearArray = ref([] as pointItem[]);
		const data = ref([] as markerData[]);
		const selectYears = ref([] as string[]);

		const timeSearchLink = computed(() => {
			const dayString = days.value
				.filter((day) => day.selected)
				.map((day) => day.value)
				.join(' OR ');

			const monthString = months.value
				.filter((month) => month.selected)
				.map((month) => month.value)
				.join(' OR ');

			const timeslotString = timeslots.value
				.filter((timeslot) => timeslot.selected)
				.map((timeslot) => timeslot.value)
				.join(' OR ');

			return {
				name: 'Home',
				query: {
					q: '*:*',
					start: 0,
					rows: 10,
					fq: [
						encodeURIComponent(
							`temporal_start_year:[${TimeSliderValues.value[0] + ' TO ' + TimeSliderValues.value[1]}]`,
						),
						encodeURIComponent(`temporal_start_day_da:(${dayString})`),
						encodeURIComponent(`temporal_start_month:(${monthString})`),
						encodeURIComponent(`temporal_start_hour_da:(${timeslotString})`),
					],
				},
			};
		});

		const figuresImage = computed(() => {
			return new URL(`@/assets/images/dr_kalender-sprite.svg`, import.meta.url).href;
		});

		const timelapseImage = computed(() => {
			return new URL(`@/assets/images/timegoes.svg`, import.meta.url).href;
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
				const startYear = Number(sortedResults[0].year);
				const endYear = Number(sortedResults[sortedResults.length - 1].year);
				for (let i = startYear; i <= endYear; i++) {
					selectYears.value.push(i.toString());
					data.value.push({ key: i, value: i });
					let item = (sortedResults.find((item) => item.year.includes(i.toString())) as pointItem) || {
						year: i.toString(),
						items: 0,
					};
					item.x = Number(((100 / (endYear - startYear)) * (i - startYear)).toFixed(2));
					item.y = item.items;
					fullYearArray.value.push(item);
				}
				const svgElement = createSVGCurvedLine(fullYearArray.value);
				if (dataContainer.value) {
					dataContainer.value.appendChild(svgElement);
				}
			});
		});

		const getTimeResults = () => {
			timeSearchStore.getTimeSearchResults(
				TimeSliderValues.value[0].toString(),
				TimeSliderValues.value[1].toString(),
				getSelectedFromArray(months.value),
				getSelectedFromArray(days.value),
				getSelectedFromArray(timeslots.value),
			);
		};

		const updateStartYear = (val: number) => {
			TimeSliderValues.value[0] = Number(val);
			if (Number(val) > TimeSliderValues.value[1]) {
				TimeSliderValues.value[1] = Number(val);
			}
			getTimeResults();
		};

		const updateEndYear = (val: number) => {
			TimeSliderValues.value[1] = Number(val);
			if (Number(val) < TimeSliderValues.value[0]) {
				TimeSliderValues.value[0] = Number(val);
			}
			getTimeResults();
		};

		watch(
			[days, months, timeslots],
			() => {
				getTimeResults();
			},
			{ deep: true },
		);

		return {
			TimeSliderValues,
			data,
			getTimeResults,
			timeSearchStore,
			days,
			months,
			dataContainer,
			timeslots,
			fullYearArray,
			selectYears,
			updateStartYear,
			updateEndYear,
			figuresImage,
			timelapseImage,
			timeSearchLink,
			selectionSummary,
			showMonthSelection,
			showMonthResult,
			showDaySelection,
			showDayResult,
			updateCheckbox,
			updateAllCheckbox,
			t,
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
	margin-bottom: 30px;
	font-size: 20px;
	text-transform: capitalize;
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

.checkbox.all label {
	width: 100px;
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

h3 {
	color: #002e70;
	font-weight: 100;
}

h3 .bold,
.hits .bold {
	font-weight: bold;
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
	z-index: 3;
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
	top: 35px;
	background: linear-gradient(90deg, rgba(215, 255, 98, 0) 0%, rgb(250, 250, 250) 95%);
}

.time-results {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: 20px;
	flex-wrap: wrap;
	padding-bottom: 20px;
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
	top: 85px;
	z-index: 6;
	pointer-events: none;
}

.overall-selector {
	user-select: none;
	height: 150px;
	display: flex;
	width: 100%;
	min-width: 1000px;
	padding-bottom: 20px;
}

.select-container.days {
	width: calc(65%);
	display: flex;
}

.select-time {
	width: calc(35%);
	display: flex;
	justify-content: flex-end;
}

.day-gradient {
	background: transparent
		linear-gradient(270deg, #ffffff 0%, #c4f1ed 4%, #002e70 8%, #042c65 51%, #002e70 92%, #c9f0fe 94%, #ffffff 100%) 0%
		0% no-repeat padding-box;
	position: absolute;
	width: calc(103%);
	top: 54px;
	right: -3%;
	height: 36px;
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

.timelapse {
	width: calc(100% - 184px);
	background-repeat: no-repeat;
	background-size: 100%;
	aspect-ratio: 1113 / 106;
	position: absolute;
	z-index: 01;
	background-position: bottom;
	right: 35px;
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
	width: calc(100% - 184px);
	top: 60px;
	right: 35px;
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
}

.all-days-items {
	display: flex;
	justify-content: space-between;
	height: 130px;
	position: relative;
	gap: 2px;
	z-index: 2;
	width: calc(100% - 150px);
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

.further-link a:visited {
	color: #002e70;
}

.link {
	color: #002e70;
	display: flex;
	text-decoration: none;
}

.further-link {
	display: flex;
	justify-content: flex-end;
	margin-right: -50px;
}

.link:hover .material-icons {
	transform: translateX(10px);
}

.link .material-icons {
	transition: all 0.15s ease-in-out 0s;
	display: flex;
	align-items: center;
	font-size: 60px;
}

.further-results {
	display: flex;
	align-items: flex-end;
	flex-direction: column;
	justify-content: center;
}

.time-result-item {
	flex: 1 1 calc(100%);
	max-width: calc(100%);
	box-sizing: border-box;
}

@media (max-width: 480px) {
	.time-result-item:nth-child(n + 3) {
		display: none;
	}
}

@media (max-width: 990px) {
	.time-result-item:nth-child(n + 5) {
		display: none;
	}
}

@media (min-width: 480px) {
	.time-result-item {
		flex: 1 1 calc(50% - 20px);
		max-width: calc(50% - 15px);
		box-sizing: border-box;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.figures {
		top: 0px;
	}
	.time-result-item {
		flex: 1 1 calc(25% - 20px);
		max-width: calc(25% - 15px);
		box-sizing: border-box;
	}
}
</style>
