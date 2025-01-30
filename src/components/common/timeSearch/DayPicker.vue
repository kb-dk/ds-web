<template>
	<div class="day-picker container">
		<div class="picker-container">
			<span class="date-span">Dato:</span>
			<VueDatePicker
				ref="singleDatePicker"
				v-model="selectedDate"
				:inline="{ input: true }"
				:enable-time-picker="false"
				:locale="locale"
				auto-apply
				no-today
				:text-input="textInputOptions"
				:format="format"
				six-weeks="fair"
				:month-change-on-scroll="false"
				:min-date="startYear"
				:max-date="endYear"
				prevent-min-max-navigation
				:year-range="[startYear.getFullYear(), endYear.getFullYear()]"
				:state="validDate"
				@update:model-value="updateSeeMoreLink()"
				@update-month-year="HandleMonthYear"
				@keydown="setupInputTimer"
				@keydown.enter="updateSelectedDate"
				@blur="handleLossOfFocus"
			></VueDatePicker>
		</div>
		<div class="time-container">
			<router-link
				:class="validDate ? 'single-day-link' : 'single-day-link disabled'"
				:data-testid="addTestDataEnrichment('link', 'day-picker', `see-more-link`, 0)"
				:to="specificDayLink"
				@click="moveToSearchPage()"
			>
				<span>{{ $t('search.showContent') }}</span>
				<div class="check-mark"></div>
			</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, inject } from 'vue';
import type { DatePickerInstance } from '@vuepic/vue-datepicker';
import VueDatePicker from '@vuepic/vue-datepicker';
import {
	days,
	endDate,
	endYear,
	months,
	startDate,
	startYear,
	timeslots,
} from '@/components/common/timeSearch/TimeSearchInitValues';
import { RouteLocationRaw } from 'vue-router';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { resetAllSelectorValues } from '@/utils/time-search-utils';
import { useI18n } from 'vue-i18n';
import { Priority, Severity } from '@/types/NotificationType';
import { ErrorManagerType } from '@/types/ErrorManagerType';

interface MonthYearEvent {
	instance: number;
	month: number;
	year: number;
}

export default defineComponent({
	name: 'DayPicker',
	components: {
		VueDatePicker,
	},
	setup() {
		let inputTimer: ReturnType<typeof setTimeout>;

		const singleDatePicker = ref<DatePickerInstance>();
		const selectedDate = ref(new Date(2015, 0, 1, 0, 0, 0));
		const singleDayStartDate = ref<Date>(new Date(2015, 0, 1, 0, 0, 0)); // January 1, 2015, 00:00:00
		const singleDayEndDate = ref<Date>(new Date(2015, 0, 1, 23, 59, 59)); // January 1, 2015, 23:59:59

		const errorManager = inject('errorManager') as ErrorManagerType;

		const { locale, t } = useI18n();
		const validDate = ref(true);
		const format = (date: Date) => {
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();

			return `${day}/${month}/${year}`;
		};

		const setupInputTimer = (e: Event) => {
			console.log('clearing timer and setting new one!');
			clearTimeout(inputTimer);
			inputTimer = setTimeout(() => {
				console.log('executing on input!');
				updateSelectedDate(e);
			}, 750); // 750 milliseconds (0.5 second) delay
		};

		const updateSelectedDate = (e: Event) => {
			clearTimeout(inputTimer);
			const input = e.target as HTMLInputElement;
			let dateInput = input.value;
			dateInput = dateInput.replace(/[.-]/g, '/');
			let splitDateInput = dateInput.split('/');
			if (splitDateInput.length === 3) {
				const [day, month, year] = splitDateInput.map(Number);

				// Validate if day, month, and year are numbers
				if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
					// Months in JavaScript Date are 0-indexed, so subtract 1 from the month
					const setDate = new Date(year, month - 1, day);

					// Ensure the date is valid
					if (setDate.getDate() === day && setDate.getMonth() === month - 1 && setDate.getFullYear() === year) {
						// Validate if the date is within the range
						const minDate = new Date(startYear.value);
						const maxDate = new Date(endYear.value);

						if (setDate >= minDate && setDate <= maxDate) {
							validDate.value = true;
							const holder = new Date(setDate.getTime());
							selectedDate.value = holder;
							updateSeeMoreLink();
						} else {
							throwInvalidDateError();
						}
					} else {
						throwInvalidDateError();
					}
				} else {
					throwInvalidDateError();
				}
			} else {
				throwInvalidDateError();
			}
		};

		const textInputOptions = {
			format: 'd/M/yyyy',
		};

		const throwInvalidDateError = () => {
			validDate.value = false;
			errorManager.submitCustomError(
				'datepicker-invalidDate',
				t('error.invalidDate'),
				'',
				Severity.INFO,
				false,
				Priority.LOW,
			);
		};

		const specificDayLink = ref<RouteLocationRaw>({
			name: 'Search',
			query: {
				q: '*:*',
				start: 0,
				rows: 10,
				fq: [],
			},
		});

		const handleLossOfFocus = () => {
			validDate.value = true;
		};

		const moveToSearchPage = () => {
			startDate.value.setFullYear(selectedDate.value.getFullYear());
			startDate.value.setMonth(selectedDate.value.getMonth());
			startDate.value.setDate(selectedDate.value.getDate());

			endDate.value.setFullYear(selectedDate.value.getFullYear());
			endDate.value.setMonth(selectedDate.value.getMonth());
			endDate.value.setDate(selectedDate.value.getDate());

			resetAllSelectorValues(months.value);
			resetAllSelectorValues(days.value);
			resetAllSelectorValues(timeslots.value);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		};

		const updateSeeMoreLink = () => {
			singleDayStartDate.value.setFullYear(selectedDate.value.getFullYear());
			singleDayStartDate.value.setMonth(selectedDate.value.getMonth());
			singleDayStartDate.value.setDate(selectedDate.value.getDate());

			singleDayEndDate.value.setFullYear(selectedDate.value.getFullYear());
			singleDayEndDate.value.setMonth(selectedDate.value.getMonth());
			singleDayEndDate.value.setDate(selectedDate.value.getDate());
			const fqArray = [];

			fqArray.push(
				encodeURIComponent(
					`startTime:[${singleDayStartDate.value.toISOString() + ' TO ' + singleDayEndDate.value.toISOString()}]`,
				),
			);

			specificDayLink.value = {
				name: 'Search',
				query: {
					q: '*:*',
					start: 0,
					rows: 10,
					fq: fqArray,
				},
			};
		};

		const HandleMonthYear = ({ month, year }: MonthYearEvent) => {
			const holder = new Date(endDate.value.getTime());
			holder.setDate(1);
			holder.setMonth(month);
			holder.setFullYear(year);
			selectedDate.value = holder;
			updateSeeMoreLink();
		};

		onMounted(() => {
			updateSeeMoreLink();
		});

		return {
			singleDatePicker,
			startYear,
			endYear,
			format,
			selectedDate,
			specificDayLink,
			addTestDataEnrichment,
			updateSeeMoreLink,
			moveToSearchPage,
			HandleMonthYear,
			locale,
			textInputOptions,
			updateSelectedDate,
			handleLossOfFocus,
			validDate,
			setupInputTimer,
		};
	},
});
</script>
<style scoped>
.day-picker {
	display: flex;
	width: calc(100vw - 14px);
	flex-direction: column;
	justify-content: center;
}

.date-span {
	width: 320px;
	position: relative;
	display: block;
}

.picker-container {
	display: flex;
	flex-direction: column;
	align-content: center;
	align-items: center;
}

.single-day-link {
	background-color: #002e70;
	color: white;
	display: flex;
	text-decoration: none;
	padding: 2px 5px;
	flex-direction: row-reverse;
	font-size: 16px;
	box-sizing: border-box;
	width: fit-content;
	padding: 10px 15px;
	border-radius: 4px;
}

.check-mark {
	width: 25px;
}

.day-picker.container {
	display: flex;
	align-items: center;
}

.check-mark:before {
	content: '';
	display: block;
	width: 2px;
	height: 20px;
	transform: rotateZ(45deg);
	background-color: white;
	position: absolute;
	margin-top: 0px;
	margin-left: 5px;
}

.check-mark:after {
	content: '';
	display: block;
	width: 2px;
	height: 9px;
	transform: rotateZ(-45deg);
	background-color: white;
	position: absolute;
	margin-top: 10px;
	margin-left: -5px;
}

.single-day-link.disabled {
	background-color: gray;
	pointer-events: none;
}

.single-day-link span {
	display: block;
	text-align: center;
	width: 100%;
}

.single-day-link.disabled .link-arrow {
	border-left: 8px solid gray;
}

.time {
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

.time-container {
	display: flex;
	justify-content: space-around;
	flex-direction: column;
	align-items: center;
	padding-top: 20px;
	width: 320px;
	align-items: flex-end;
	padding-left: 8px;
	padding-right: 8px;
}

.container {
	width: 100%;
}
/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		display: flex;
		flex-direction: column;
		max-width: 1150px;
	}

	.day-picker {
		flex-direction: column;
		gap: 25px;
		justify-content: center;
		padding-right: 50px;
		padding-top: 30px;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
	.full-width {
		width: 100vw;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		padding-right: 0;
		padding-left: 0;
	}
}
</style>
