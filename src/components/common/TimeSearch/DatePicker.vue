<template>
	<div class="date-pickers">
		<VueDatePicker
			ref="startDatePicker"
			v-model="startDate"
			:inline="{ input: true }"
			:enable-time-picker="false"
			auto-apply
			no-today
			:highlight="highlightedDays"
			text-input
			:format="format"
			six-weeks="fair"
			:month-change-on-scroll="false"
			:min-date="startYear"
			:max-date="endYear"
			prevent-min-max-navigation
			:year-range="[startYear.getFullYear(), endYear.getFullYear()]"
			@update:model-value="readyForNewSearch()"
		></VueDatePicker>
		<VueDatePicker
			ref="endDatePicker"
			v-model="endDate"
			:inline="{ input: true }"
			:enable-time-picker="false"
			auto-apply
			no-today
			:highlight="highlightedDays"
			text-input
			:format="format"
			six-weeks="fair"
			:month-change-on-scroll="false"
			:min-date="startYear"
			:max-date="endYear"
			prevent-min-max-navigation
			:year-range="[startYear.getFullYear(), endYear.getFullYear()]"
			@update:model-value="readyForNewSearch()"
		></VueDatePicker>
		<div class="from-to-display">
			<div class="container">
				<span>Fra:</span>
				<div class="time">
					{{ format(startDate) }}
				</div>
			</div>
			<div class="container">
				<span>Til:</span>
				<div class="time">
					{{ format(endDate) /*date2.toISOString()*/ }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import type { DatePickerInstance } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import '@/components/common/TimeSearch/custom-datepicker.css';
import { addDays } from 'date-fns/addDays';
import { startDate, endDate, startYear, endYear } from '@/components/common/TimeSearch/TimeSearchInitValues';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { normalizeFq, cloneRouteQuery } from '@/utils/filter-utils';
import { useRoute } from 'vue-router';

interface Highlight {
	dates: Date[];
	years: number[];
	months: { month: number; year: number }[];
	quarters: { quarter: number; year: number }[];
	weekdays: number[];
	options: { highlightDisabled: boolean };
}

export default defineComponent({
	name: 'DatePicker',
	components: {
		VueDatePicker,
	},
	emits: ['spanUpdated'],
	setup(props, { emit }) {
		const startDatePicker = ref<DatePickerInstance>();
		const endDatePicker = ref<DatePickerInstance>();
		const timeSearchStore = useTimeSearchStore();
		const route = useRoute();

		onMounted(() => {
			const routeQueries = cloneRouteQuery(route);
			const fq = normalizeFq(routeQueries.fq);
			const startTimeFilter = fq.find((fq: string) => fq.includes('startTime'));
			if (startTimeFilter) {
				const timestamps = decodeURIComponent(startTimeFilter)
					.replace('startTime:', '')
					.replace(' OR ', '')
					.replace('[', '')
					.replace(']', '')
					.split(' TO ');
				setDateFromISOString(timestamps[0], startDate.value);
				setDateFromISOString(timestamps[1], endDate.value);
			} else {
				startDate.value.setTime(startYear.value.getTime());
				endDate.value.setTime(endYear.value.getTime());
			}
			startDatePicker.value ? startDatePicker.value.updateInternalModelValue(startDate.value) : null;
			endDatePicker.value ? endDatePicker.value.updateInternalModelValue(endDate.value) : null;
		});

		const setDateFromISOString = (isoDate: string, date: Date) => {
			const existingDate = new Date(isoDate);
			date.setTime(existingDate.getTime());
		};

		const format = (date: Date) => {
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();

			return `${day} / ${month} / ${year}`;
		};

		const newSearch = () => {
			emit('spanUpdated');
		};

		const readyForNewSearch = () => {
			timeSearchStore.setNewSearchReqMet(true);
		};

		const highlightedDays = computed(() => {
			const timeDifference = endDate.value.getTime() - startDate.value.getTime();
			const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
			const highlights = [];
			for (let i = 0; i < days; i++) {
				highlights.push(addDays(startDate.value, i));
			}

			const highlight = {} as Highlight;
			highlight.dates = highlights;

			return highlight;
		});

		return {
			startDate,
			endDate,
			startYear,
			endYear,
			format,
			highlightedDays,
			newSearch,
			readyForNewSearch,
			startDatePicker,
			endDatePicker,
		};
	},
});
</script>

<style scoped>
.date-pickers {
	padding-top: 40px;
	padding-bottom: 40px;
	display: flex;
	padding-left: 0px;
	padding-right: 0px;
	box-sizing: border-box;
	flex-wrap: wrap;
	flex-direction: column;
	align-items: center;
	gap: 10px;
}

.date-pickers > div {
	width: 50%;
}

.from-to-display {
	display: flex;
	align-items: center;
	justify-content: space-around;
	flex-direction: row;
	gap: 15px;
	width: 100% !important;
	padding-top: 20px;
}

.from-to-display .container {
	background: #fafafa 0% 0% no-repeat padding-box;
	box-shadow: 1px 1px 2px #00000029;
	border: 1px solid #d9d8d8;
	color: #757575;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-top: 5px;
}

.container span {
	padding-left: 16px;
}

.from-to-display .container .time {
	background: #ffffff 0% 0% no-repeat padding-box;
	border: 1px solid #d9d8d8;
	border-radius: 2px;
	height: 48px;
	width: 110px;
	margin: 0px 16px 16px 16px;
	display: flex;
	align-items: center;
	justify-content: center;
}

@media (min-width: 640px) {
	.date-pickers {
		align-items: initial;
		flex-direction: row;
		padding-left: 30px;
		padding-right: 30px;
		gap: 0px;
	}
}

@media (min-width: 990px) {
	.date-pickers > div {
		width: 33.33%;
	}
	.from-to-display {
		width: 33.33% !important;
		justify-content: center;
		flex-direction: column;
		padding-top: 0px;
	}
}
</style>
