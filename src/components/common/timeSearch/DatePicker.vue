<template>
	<div class="date-pickers">
		<div class="picker-container">
			<div class="headline-container">
				<span class="date-headline">{{ t('datepicker.date') }}:</span>
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
				allow-null="true"
				:highlight="highlightedDays.startHighlight"
				@update:model-value="readyForNewSearch('start')"
				@update-month-year="startHandleMonthYear"
				@keydown="setupStartInputTimer"
				@keydown.enter="executeStartUpdate($event)"
				@blur="validStartDate = true"
			></VueDatePicker>
			<Transition name="fade">
				<div
					v-if="!validStartDate"
					class="from-error-container"
				>
					{{ t('datepicker.error', { start: formatDate(startYear), end: formatDate(endYear) }) }}
				</div>
			</Transition>
		</div>
		<div class="picker-container">
			<div class="headline-container">
				<span class="date-headline">{{ t('datepicker.to') }}:</span>
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
				allow-null="true"
				:highlight="highlightedDays.endHighlight"
				@update:model-value="readyForNewSearch('end')"
				@update-month-year="endHandleMonthYear"
				@keydown="setupEndInputTimer"
				@keydown.enter="executeEndUpdate($event)"
				@blur="validEndDate = true"
			></VueDatePicker>
			<Transition name="fade">
				<div
					v-if="!validEndDate"
					class="to-error-container"
				>
					{{ t('datepicker.error', { start: formatDate(startYear), end: formatDate(endYear) }) }}
				</div>
			</Transition>
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
import { startOfMonth, endOfMonth } from 'date-fns';
import { updateSelectedDate } from '@/utils/datepicker-utils';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

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
	setup() {
		let startInputTimer: ReturnType<typeof setTimeout> | null = null;

		let endInputTimer: ReturnType<typeof setTimeout> | null = null;

		const startDatePicker = ref<DatePickerInstance>();
		const endDatePicker = ref<DatePickerInstance>();
		const timeSearchStore = useTimeSearchStore();
		const { locale, t } = useI18n();
		const validStartDate = ref(true);
		const validEndDate = ref(true);

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

		/* This is not pretty, but we gotta watch for the value of dpWrapMenuRef (which is the HTML),
		 * so that we can manipulate it and add the test id's and change what we wanna change in the HTML.
		 */
		watch(
			() => startDatePicker.value?.dpWrapMenuRef as unknown as HTMLElement | null,
			(newVal: HTMLElement | null) => {
				if (newVal !== null) {
					const pickers = document.querySelector('.date-pickers');
					if (pickers) {
						const inputs = Array.from(pickers.querySelectorAll('input')) as HTMLElement[];
						if (inputs[0]) {
							inputs[0].setAttribute('data-testid', addTestDataEnrichment('input', 'date-pickers', 'start', 0));
						}
						if (inputs[1]) {
							inputs[1].setAttribute('data-testid', addTestDataEnrichment('input', 'date-pickers', 'end', 1));
						}
						const calendars = Array.from(pickers.querySelectorAll('.dp__outer_menu_wrap')) as HTMLElement[];
						if (calendars[0]) {
							calendars[0].setAttribute('data-testid', addTestDataEnrichment('calendar', 'date-pickers', 'start', 0));
						}
						if (calendars[1]) {
							calendars[1].setAttribute('data-testid', addTestDataEnrichment('calendar', 'date-pickers', 'end', 1));
						}
					}
				}
			},
			{ deep: true },
		);

		const format = (date: Date) => {
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();

			return `${day}-${month}-${year}`;
		};

		const executeStartUpdate = (e: Event) => {
			updateSelectedDate(e, startInputTimer, validStartDate, startDate, validateStartInput);
		};

		const executeEndUpdate = (e: Event) => {
			updateSelectedDate(e, endInputTimer, validEndDate, endDate, validateEndInput);
		};

		const formatDate = (date: Date) => {
			if (!(date instanceof Date)) return '';
			return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
		};

		const setupStartInputTimer = (e: Event) => {
			if (startInputTimer !== null) {
				clearTimeout(startInputTimer);
			}
			startInputTimer = setTimeout(() => {
				updateSelectedDate(e, startInputTimer, validStartDate, startDate, validateStartInput);
			}, 750); // 750 milliseconds (0.75 second) delay
		};

		const setupEndInputTimer = (e: Event) => {
			if (endInputTimer !== null) {
				clearTimeout(endInputTimer);
			}
			endInputTimer = setTimeout(() => {
				updateSelectedDate(e, endInputTimer, validEndDate, endDate, validateEndInput);
			}, 750); // 750 milliseconds (0.75 second) delay
		};

		/* This way might seem weird to update the endDate,
		 *  However, this is the only way to force an reactive update to the variable,
		 * so we also get an update in the template. Weird, but this is the way.
		 */
		const endHandleMonthYear = ({ month, year }: MonthYearEvent) => {
			const holder = new Date();
			holder.setDate(1);
			holder.setMonth(month);
			holder.setFullYear(year);
			holder.setHours(23, 59, 59, 999); // End of the day
			endDate.value = holder;

			if (endDate.value.getTime() !== endYear.value.getTime()) {
				timeSearchStore.setNewSearchReqMet(true);
			} else {
				timeSearchStore.setNewSearchReqMet(false);
			}
		};

		const startHandleMonthYear = ({ month, year }: MonthYearEvent) => {
			const holder = new Date();
			holder.setDate(1);
			holder.setMonth(month);
			holder.setFullYear(year);
			holder.setHours(0, 0, 0, 0); // Start of the day
			startDate.value = holder;
			if (startDate.value.getTime() !== startYear.value.getTime()) {
				timeSearchStore.setNewSearchReqMet(true);
			} else {
				timeSearchStore.setNewSearchReqMet(false);
			}
		};

		const enableApplyButtonIfSearchisValid = () => {
			timeSearchStore.setFilterSearchReady(validEndDate.value && validStartDate.value);
		};

		const validateStartInput = () => {
			startDate.value !== null && startDate.value instanceof Date && (startDate.value as unknown as string) !== ''
				? (validStartDate.value = true)
				: (validStartDate.value = false);
		};

		const validateEndInput = () => {
			endDate.value !== null && endDate.value instanceof Date && (endDate.value as unknown as string) !== ''
				? (validEndDate.value = true)
				: (validEndDate.value = false);
		};

		watch(
			() => startDate.value,
			() => {
				validateStartInput();
				enableApplyButtonIfSearchisValid();
			},
		);

		watch(
			() => endDate.value,
			() => {
				validateEndInput();
				enableApplyButtonIfSearchisValid();
			},
		);

		watch(
			() => [validStartDate.value, validEndDate.value],
			() => {
				enableApplyButtonIfSearchisValid();
			},
		);

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
			readyForNewSearch,
			startDatePicker,
			endDatePicker,
			endHandleMonthYear,
			startHandleMonthYear,
			locale,
			t,
			textInputOptions,
			updateSelectedDate,
			validStartDate,
			validEndDate,
			executeEndUpdate,
			executeStartUpdate,
			setupStartInputTimer,
			setupEndInputTimer,
			formatDate,
		};
	},
});
</script>

<style scoped>
.to-error-container,
.from-error-container {
	width: 160px;
	position: absolute;
	height: fit-content;
	right: 161px;
	top: 55px;
	color: white;
	padding: 5px;
	background-color: rgb(184, 0, 0);
	box-sizing: border-box;
}

.to-error-container {
	left: 18px;
}

.to-error-container:before,
.from-error-container:before {
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 7px solid transparent;
	border-right: 7px solid transparent;
	border-bottom: 7px solid rgb(184, 0, 0);
	top: -7px;
	position: absolute;
	left: 50%;
	transform: translate(-50%, 0%);
}

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

@media (min-width: 740px) {
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
