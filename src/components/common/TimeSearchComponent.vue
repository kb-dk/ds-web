<template>
	<div>
		<div class="slider-container">
			<h3>Valgte år</h3>
			<div
				ref="dataContainer"
				class="data-container"
			></div>
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
		</div>
		<div class="select-container">
			<h3>Valgte måneder</h3>
			<div class="month-selector">
				<button
					v-for="(item, index) in months"
					:key="index"
					:class="months[index].selected ? 'month-button selected' : 'month-button'"
					@click="setSelected(months, index)"
				>
					{{ months[index].name }}
				</button>
			</div>
		</div>
		<div class="overall-selector">
			<div class="select-container select-days">
				<h3>Valgte dage</h3>
				<div class="day-selector">
					<button
						v-for="(item, index) in days"
						:key="index"
						:class="days[index].selected ? 'day-button selected' : 'day-button'"
						@click="setSelected(days, index)"
					>
						{{ days[index].name }}
					</button>
				</div>
			</div>
			<div class="select-container select-time">
				<h3>Valgte tidspunkter</h3>
				<div class="day-selector">
					<button
						v-for="(item, index) in timeslots"
						:key="index"
						:class="timeslots[index].selected ? 'time-button selected' : 'time-button'"
						@click="setSelected(timeslots, index)"
					>
						{{ timeslots[index].name }}
					</button>
				</div>
			</div>
		</div>
		<div class="result-container">
			<h3>Resultat {{ timeSearchStore.numFound }}</h3>
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

interface SelectableItem {
	name: string;
	selected: boolean;
}

interface pointItem {
	year: string;
	items: number;
	x: number;
	y: number;
	value?: string;
	key?: number;
}

interface dataItem {
	year: string;
	items: number;
}

interface point {
	x: number;
	y: number;
}

interface markerData {
	key: number;
	value: string;
}

export default defineComponent({
	name: 'TimeSearchComponent',
	components: {
		VueSlider,
		GridResultItem,
	},
	setup() {
		const timeSearchStore = useTimeSearchStore();
		const values = ref([1992, 2002]);
		const dataContainer = ref<HTMLDivElement>();
		const fullYearArray = ref([] as pointItem[]);

		const days = ref([
			{ name: 'mandag', value: 'Monday', selected: true },
			{ name: 'tirsdag', value: 'Tuesday', selected: true },
			{ name: 'onsdag', value: 'Wednesday', selected: true },
			{ name: 'torsdag', value: 'Thursday', selected: true },
			{ name: 'fredag', value: 'Friday', selected: true },
			{ name: 'lørdag', value: 'Saturday', selected: true },
			{ name: 'søndag', value: 'Sunday', selected: true },
		]);
		const timeslots = ref([
			{ name: 'morgen', value: `${encodeURIComponent(`[6 TO 12]`)}`, selected: true },
			{ name: 'middag', value: `${encodeURIComponent(`[12 TO 18]`)}`, selected: true },
			{ name: 'aften', value: `${encodeURIComponent(`[18 TO 24]`)}`, selected: true },
			{ name: 'nat', value: `${encodeURIComponent(`[0 TO 6]`)}`, selected: true },
		]);

		const months = ref([
			{ name: 'januar', value: '1', selected: true },
			{ name: 'februar', value: '2', selected: true },
			{ name: 'marts', value: '3', selected: true },
			{ name: 'april', value: '4', selected: true },
			{ name: 'maj', value: '5', selected: true },
			{ name: 'juni', value: '6', selected: true },
			{ name: 'juli', value: '7', selected: true },
			{ name: 'august', value: '8', selected: true },
			{ name: 'september', value: '9', selected: true },
			{ name: 'oktober', value: '10', selected: true },
			{ name: 'november', value: '11', selected: true },
			{ name: 'december', value: '12', selected: true },
		]);

		const data = ref([] as markerData[]);

		onMounted(() => {
			const slider = document.getElementsByClassName('vue-slider-process')[0];
			getTimeResults();

			const initResult = APIService.getFullResultWithFacets().then((reponse) => {
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
				const start = Number(sortedResults[0].year);
				const end = Number(sortedResults[sortedResults.length - 1].year);
				for (let i = start; i <= end; i++) {
					data.value.push({ key: i, value: i } as unknown as markerData);
					const item = sortedResults.find((item) => item.year.includes(i.toString()));
					const newEntry = {} as pointItem;
					newEntry.x = Number(((100 / (end - start)) * (i - start)).toFixed(2));
					if (item !== undefined) {
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
				console.log(fullYearArray);
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
				getSelectedMonths(),
				getSelectedDays(),
				getSelectedTimeslots(),
			);
		};

		const getSelectedMonths = () => {
			return months.value.filter((month) => month.selected).map((month) => month.value);
		};

		const getSelectedDays = () => {
			return days.value.filter((day) => day.selected).map((day) => day.value);
		};

		const getSelectedTimeslots = () => {
			return timeslots.value.filter((time) => time.selected).map((time) => time.value);
		};

		const setSelected = (variable: SelectableItem[], index: number) => {
			variable[index].selected = !variable[index].selected;
		};

		function createSVGCurvedLine(points: pointItem[]) {
			const svgns = 'http://www.w3.org/2000/svg';
			const svg = document.createElementNS(svgns, 'svg');
			svg.setAttribute('height', '100%');
			svg.setAttribute('width', '100%');
			svg.setAttribute('viewBox', '0 0 100 100'); // Use a square viewBox for simplicity
			svg.setAttribute('preserveAspectRatio', 'none');
			const path = document.createElementNS(svgns, 'path');
			path.setAttribute('fill', 'white');
			path.setAttribute('stroke', 'white');
			path.setAttribute('stroke-width', '1');
			path.setAttribute('opacity', '0.3');

			// Normalize y coordinates to fit within [0, 100] range
			const yValues = points.map((point: point) => point.y);
			const minY = Math.min(...yValues);
			const maxY = Math.max(...yValues);
			const rangeY = maxY - minY;

			let normalizedPoints;

			if (rangeY === 0) {
				// If all y values are the same, set them to the middle of the viewBox (50)
				normalizedPoints = points.map((point: point) => ({
					x: point.x,
					y: 50,
				}));
			} else {
				normalizedPoints = points.map((point: point) => ({
					x: point.x,
					y: 100 - ((point.y - minY) / rangeY) * 100, // Invert y to flip the axis
				}));
			}
			// Convert points to a smooth path data string using percentages
			let d = `M ${normalizedPoints[0].x} ${normalizedPoints[0].y}`;
			for (let i = 1; i < normalizedPoints.length - 1; i++) {
				const xc = (normalizedPoints[i].x + normalizedPoints[i + 1].x) / 2;
				const yc = (normalizedPoints[i].y + normalizedPoints[i + 1].y) / 2;
				d += ` Q ${normalizedPoints[i].x} ${normalizedPoints[i].y}, ${xc} ${yc}`;
			}
			const lastX = normalizedPoints[normalizedPoints.length - 1].x;
			const lastY = normalizedPoints[normalizedPoints.length - 1].y;
			d += ` Q ${lastX} ${lastY}, ${lastX} ${lastY}`; // Complete the path with the last point

			// Add line to the bottom-right corner of the viewBox
			d += ` L 100 100`;
			// Add line to the bottom-left corner of the viewBox
			d += ` L 0 100`;
			// Close the path
			d += ` Z`;

			path.setAttribute('d', d);

			svg.appendChild(path);
			return svg;
		}

		watch(
			[days, months, timeslots],
			() => {
				console.log('change appeared!');
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

/* .day-button:after,
.month-button:after {
	display: block;
	content: '';
	width: 1px;
	height: 50%;
	background-color: black;
	position: absolute;
	top: 25%;
	opacity: 0.2;
} */

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
