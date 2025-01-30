<template>
	<div class="date-pickers">
		<div class="picker-container">
			<div class="headline-container">
				<span class="date-headline">Dato</span>
			</div>
			<VueDatePicker
				ref="startDatePicker"
				v-model="startDate"
				:format="format"
				:inline="{ input: true }"
				:enable-time-picker="false"
				:locale="locale"
				auto-apply
				no-today
				:text-input="textInputOptions"
				six-weeks="fair"
				:month-change-on-scroll="false"
				:min-date="startYear"
				:max-date="endYear"
				prevent-min-max-navigation
				:year-range="[startYear.getFullYear(), endYear.getFullYear()]"
				:state="validStartDate"
				:highlight="highlightedDays.startHighlight"
				@update:model-value="readyForNewSearch('start')"
				@update-month-year="startHandleMonthYear"
			></VueDatePicker>
		</div>
		<div class="picker-container">
			<div class="headline-container">
				<span class="date-headline">Til</span>
			</div>
			<VueDatePicker
				ref="endDatePicker"
				v-model="endDate"
				:format="format"
				:inline="{ input: true }"
				:enable-time-picker="false"
				:locale="locale"
				auto-apply
				no-today
				:text-input="textInputOptions"
				six-weeks="fair"
				:month-change-on-scroll="false"
				:min-date="startYear"
				:max-date="endYear"
				prevent-min-max-navigation
				:year-range="[startYear.getFullYear(), endYear.getFullYear()]"
				:state="validEndDate"
				:highlight="highlightedDays.endHighlight"
				@update:model-value="readyForNewSearch('end')"
				@update-month-year="endHandleMonthYear"
			></VueDatePicker>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, inject } from 'vue';
import type { DatePickerInstance } from '@vuepic/vue-datepicker';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import '@/components/common/timeSearch/custom-datepicker.css';
import { addDays } from 'date-fns/addDays';
import { endDate, endYear, startDate, startYear } from '@/components/common/timeSearch/TimeSearchInitValues';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { useI18n } from 'vue-i18n';
import { Priority, Severity } from '@/types/NotificationType';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { startOfMonth, endOfMonth } from 'date-fns';

/* interface Highlight {
	dates: Date[];
	years: number[];
	months: { month: number; year: number }[];
	quarters: { quarter: number; year: number }[];
	weekdays: number[];
	options: { highlightDisabled: boolean };
} */

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
		const { locale, t } = useI18n();
		const validStartDate = ref(true);
		const validEndDate = ref(true);
		const errorManager = inject('errorManager') as ErrorManagerType;

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

			return `${day}-${month}-${year}`;
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

		const updateSelectedDate = (e: Event, picker: string) => {
			const input = e.target as HTMLInputElement;
			const value = input.value.trim(); // Remove extra spaces

			// Use a regular expression to split by '/', '.', or '-'
			const dateInput = value.split(/[/.-]/);
			const splitter = value.match(/[/.-]/);

			if (dateInput.length === 3) {
				const [day, month, year] = dateInput.map(Number);

				// Validate if day, month, and year are numbers
				if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
					// Months in JavaScript Date are 0-indexed, so subtract 1 from the month
					const setDate = new Date(year, month - 1, day);

					// Ensure the date is valid
					if (setDate.getDate() === day && setDate.getMonth() === month - 1 && setDate.getFullYear() === year) {
						/* textInputOptions.format = `d${splitter}M${splitter}yyyy`;
						currentSplitter.value = splitter as unknown as string; */
						// Validate if the date is within the range
						const minDate = new Date(startYear.value);
						const maxDate = new Date(endYear.value);

						if (setDate >= minDate && setDate <= maxDate) {
							picker === 'start' ? (validStartDate.value = true) : (validEndDate.value = true);
							const holder = new Date(setDate.getTime());
							picker === 'start' ? (startDate.value = holder) : (endDate.value = holder);
							//selectedDate.value = holder;
						} else {
							picker === 'start' ? (validStartDate.value = false) : (validEndDate.value = false);
							errorManager.submitCustomError(
								'datepicker-outofRange',
								t('error.outofRange'),
								'',
								Severity.INFO,
								false,
								Priority.LOW,
							);
						}
					} else {
						picker === 'start' ? (validStartDate.value = false) : (validEndDate.value = false);
						errorManager.submitCustomError(
							'datepicker-invalidDate',
							t('error.invalidDate'),
							'',
							Severity.INFO,
							false,
							Priority.LOW,
						);
					}
				} else {
					picker === 'start' ? (validStartDate.value = false) : (validEndDate.value = false);
					errorManager.submitCustomError(
						'datepicker-invalidInput',
						t('error.invalidInput'),
						'',
						Severity.INFO,
						false,
						Priority.LOW,
					);
				}
			} else {
				picker === 'start' ? (validStartDate.value = false) : (validEndDate.value = false);
				errorManager.submitCustomError(
					'datepicker-invalidFormat',
					t('error.invalidFormat'),
					'',
					Severity.INFO,
					false,
					Priority.LOW,
				);
			}
			enableApplyButtonIfSearchisValid();
		};

		const newSearch = () => {
			emit('spanUpdated');
		};

		const enableApplyButtonIfSearchisValid = () => {
			if (validEndDate.value && validStartDate.value) {
				timeSearchStore.setNewSearchReqMet(true);
			} else {
				timeSearchStore.setNewSearchReqMet(false);
			}
		};

		const readyForNewSearch = (picker: string) => {
			if (picker === 'end') {
				validEndDate.value = true;
			}
			if (picker === 'start') {
				validStartDate.value = true;
			}
			enableApplyButtonIfSearchisValid();
		};

		const highlightedDays = computed(() => {
			const startHighlights = [];
			const endHighlights = [];

			if (startDate.value) {
				const startMonthEnd = endOfMonth(startDate.value);
				const limitDate = endDate.value && endDate.value < startMonthEnd ? endDate.value : startMonthEnd;

				let currentDate = startDate.value;
				while (currentDate <= limitDate) {
					startHighlights.push(currentDate);
					currentDate = addDays(currentDate, 1);
				}
			}

			if (endDate.value) {
				const endMonthStart = startOfMonth(endDate.value);
				const limitDate = startDate.value && startDate.value > endMonthStart ? startDate.value : endMonthStart;

				let currentDate = endDate.value;
				while (currentDate >= limitDate) {
					endHighlights.push(currentDate);
					currentDate = addDays(currentDate, -1);
				}
			}

			return {
				startHighlight: { dates: startHighlights },
				endHighlight: { dates: endHighlights },
			};
		});

		const textInputOptions = {
			format: 'd-M-yyyy', // Default display format
		};

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
			textInputOptions,
			updateSelectedDate,
			validStartDate,
			validEndDate,
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
	justify-content: center;
}

.date-headline {
	width: 320px;
	display: block;
	padding-left: 0px !important;
}

.picker-container {
	display: flex;
	width: 50%;

	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.picker-container:first-of-type .headline-container {
	width: 100%;
	display: flex;
	justify-content: flex-end;
}

.picker-container:last-of-type .headline-container {
	width: 100%;
	display: flex;
	justify-content: flex-start;
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
	.picker-container {
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
