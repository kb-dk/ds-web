<template>
	<div class="date-pickers">
		<VueDatePicker
			ref="startDatePicker"
			v-model="startDate"
			:inline="{ input: true }"
			:enable-time-picker="false"
			:locale="locale"
			auto-apply
			no-today
			text-input
			:format="format"
			six-weeks="fair"
			:month-change-on-scroll="false"
			:min-date="startYear"
			:max-date="endYear"
			prevent-min-max-navigation
			:year-range="[startYear.getFullYear(), endYear.getFullYear()]"
			@update:model-value="readyForNewSearch()"
			@update-month-year="startHandleMonthYear"
		></VueDatePicker>
		<VueDatePicker
			ref="endDatePicker"
			v-model="endDate"
			:inline="{ input: true }"
			:enable-time-picker="false"
			:locale="locale"
			auto-apply
			no-today
			text-input
			:format="format"
			six-weeks="fair"
			:month-change-on-scroll="false"
			:min-date="startYear"
			:max-date="endYear"
			prevent-min-max-navigation
			:year-range="[startYear.getFullYear(), endYear.getFullYear()]"
			@update:model-value="readyForNewSearch()"
			@update-month-year="endHandleMonthYear"
		></VueDatePicker>
		<div class="from-to-display">
			<div class="container">
				<span>{{ $t('timeSearch.from') }}:</span>
				<div class="time">
					{{ format(startDate) }}
				</div>
			</div>
			<div class="container">
				<span>{{ $t('timeSearch.to') }}:</span>
				<div class="time">
					{{ format(endDate) /*date2.toISOString()*/ }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import type { DatePickerInstance } from '@vuepic/vue-datepicker';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import '@/components/common/timeSearch/custom-datepicker.css';
import { addDays } from 'date-fns/addDays';
import { endDate, endYear, startDate, startYear } from '@/components/common/timeSearch/TimeSearchInitValues';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { useI18n } from 'vue-i18n';

interface Highlight {
	dates: Date[];
	years: number[];
	months: { month: number; year: number }[];
	quarters: { quarter: number; year: number }[];
	weekdays: number[];
	options: { highlightDisabled: boolean };
}

interface MonthYearEvent {
	instance: number;
	month: number;
	year: number;
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
		const { locale } = useI18n();

		onMounted(() => {
			startDatePicker.value ? startDatePicker.value.updateInternalModelValue(startDate.value) : null;
			endDatePicker.value ? endDatePicker.value.updateInternalModelValue(endDate.value) : null;
		});

		watch(
			() => timeSearchStore.timeFacetsOpen,
			(newVal: boolean) => {
				if (!newVal) {
					startDatePicker.value ? startDatePicker.value.updateInternalModelValue(startDate.value) : null;
					endDatePicker.value ? endDatePicker.value.updateInternalModelValue(endDate.value) : null;
				}
			},
		);

		const format = (date: Date) => {
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();

			return `${day} / ${month} / ${year}`;
		};

		/* This way might seem weird to update the endDate,
		 *  However, this is the only way to force an reactive update to the variable,
		 * so we also get an update in the template. Weird, but this is the way.
		 */
		const endHandleMonthYear = ({ month, year }: MonthYearEvent) => {
			const holder = new Date(endDate.value.getTime());
			holder.setDate(1);
			holder.setMonth(month);
			holder.setFullYear(year);
			endDate.value = holder;
			if (endDate.value.getTime() !== endYear.value.getTime()) {
				timeSearchStore.setNewSearchReqMet(true);
			} else {
				timeSearchStore.setNewSearchReqMet(false);
			}
			//endDatePicker.value ? endDatePicker.value.updateInternalModelValue(endDate.value) : null;
		};

		const startHandleMonthYear = ({ month, year }: MonthYearEvent) => {
			const holder = new Date(startDate.value.getTime());
			holder.setDate(1);
			holder.setMonth(month);
			holder.setFullYear(year);
			startDate.value = holder;
			if (startDate.value.getTime() !== startYear.value.getTime()) {
				timeSearchStore.setNewSearchReqMet(true);
			} else {
				timeSearchStore.setNewSearchReqMet(false);
			}
			//startDatePicker.value ? startDatePicker.value.updateInternalModelValue(startDate.value) : null;
		};
		const newSearch = () => {
			emit('spanUpdated');
		};

		const readyForNewSearch = () => {
			timeSearchStore.setNewSearchReqMet(true);
		};
		/*
		 * We're not using this right now - its _VERY_ heavy.
		 * If we at some point want it, its just :highlight="highlightedDays"
		 * in the picker.
		 */
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
			endHandleMonthYear,
			startHandleMonthYear,
			locale,
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
