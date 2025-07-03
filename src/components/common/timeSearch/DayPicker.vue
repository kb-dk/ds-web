<template>
	<div class="day-picker container">
		<div class="picker-container">
			<span class="date-span">{{ t('datepicker.date') }}:</span>
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
				allow-null="true"
				@update:model-value="updateSeeMoreLink()"
				@update-month-year="HandleMonthYear"
				@keydown="setupInputTimer"
				@keydown.enter="executeUpdate($event)"
				@blur="validDate = true"
			></VueDatePicker>
			<Transition name="fade">
				<div
					v-if="!validDate"
					class="error-container"
				>
					{{ t('datepicker.error', { start: formatDate(startYear), end: formatDate(endYear) }) }}
				</div>
			</Transition>
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
import { defineComponent, onMounted, ref, watch } from 'vue';
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
import { updateSelectedDate } from '@/utils/datepicker-utils';

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
		let inputTimer: ReturnType<typeof setTimeout> | null = null;

		const singleDatePicker = ref<DatePickerInstance>();
		const selectedDate = ref<Date | null>(new Date(2015, 0, 1, 0, 0, 0));
		const singleDayStartDate = ref<Date>(new Date(2015, 0, 1, 0, 0, 0)); // January 1, 2015, 00:00:00
		const singleDayEndDate = ref<Date>(new Date(2015, 0, 1, 23, 59, 59)); // January 1, 2015, 23:59:59

		const { locale, t } = useI18n();
		const validDate = ref(true);
		const format = (date: Date) => {
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();

			return `${day}-${month}-${year}`;
		};

		onMounted(() => {
			watch(
				() => singleDatePicker.value?.dpWrapMenuRef as unknown as HTMLElement | null,
				(newVal: HTMLElement | null) => {
					if (newVal !== null) {
						const picker = document.querySelector('.day-picker');
						if (picker) {
							const inputs = Array.from(picker.querySelectorAll('input')) as HTMLElement[];
							if (inputs[0]) {
								inputs[0].setAttribute('data-testid', addTestDataEnrichment('input', 'day-picker', 'start', 0));
							}

							const calendar = Array.from(picker.querySelectorAll('.dp__outer_menu_wrap')) as HTMLElement[];
							if (calendar[0]) {
								calendar[0].setAttribute('data-testid', addTestDataEnrichment('calendar', 'day-picker', 'start', 0));
							}
						}
					}
				},
				{ deep: true },
			);
		});

		watch(
			() => selectedDate.value,
			() => {
				if (inputTimer !== null) {
					clearTimeout(inputTimer);
				}
				updateSeeMoreLink();
			},
		);

		const setupInputTimer = (e: Event) => {
			if (inputTimer !== null) {
				clearTimeout(inputTimer);
			}
			inputTimer = setTimeout(() => {
				updateSelectedDate(e, inputTimer, validDate, selectedDate, updateSeeMoreLink);
			}, 750); // 750 milliseconds (0.75 second) delay
		};

		const formatDate = (date: Date) => {
			if (!(date instanceof Date)) return '';
			return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
		};

		const textInputOptions = {
			format: 'd-M-yyyy',
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

		const moveToSearchPage = () => {
			if (selectedDate.value !== null && startDate.value !== null && endDate.value !== null) {
				startDate.value.setFullYear(selectedDate.value.getFullYear());
				startDate.value.setMonth(selectedDate.value.getMonth());
				startDate.value.setDate(selectedDate.value.getDate());

				endDate.value.setFullYear(selectedDate.value.getFullYear());
				endDate.value.setMonth(selectedDate.value.getMonth());
				endDate.value.setDate(selectedDate.value.getDate());
			}

			resetAllSelectorValues(months.value);
			resetAllSelectorValues(days.value);
			resetAllSelectorValues(timeslots.value);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		};

		const executeUpdate = (e: Event) => {
			updateSelectedDate(e, inputTimer, validDate, selectedDate, updateSeeMoreLink); // Pass .value here as well
		};

		const updateSeeMoreLink = () => {
			if (selectedDate.value !== null && selectedDate.value instanceof Date) {
				validDate.value = true;
				singleDayStartDate.value.setFullYear(selectedDate.value.getFullYear());
				singleDayStartDate.value.setMonth(selectedDate.value.getMonth());
				singleDayStartDate.value.setDate(selectedDate.value.getDate());
				singleDayStartDate.value.setHours(0, 0, 0, 0); // Start of the day

				singleDayEndDate.value.setFullYear(selectedDate.value.getFullYear());
				singleDayEndDate.value.setMonth(selectedDate.value.getMonth());
				singleDayEndDate.value.setDate(selectedDate.value.getDate());
				singleDayEndDate.value.setHours(23, 59, 59, 999); // End of the day

				const fqArray = [];

				fqArray.push(
					encodeURIComponent(
						`startTime:[${singleDayStartDate.value.toISOString()} TO ${singleDayEndDate.value.toISOString()}]`,
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
			} else {
				validDate.value = false;
			}
		};

		const HandleMonthYear = ({ month, year }: MonthYearEvent) => {
			const holder = new Date();
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
			setupInputTimer,
			inputTimer,
			validDate,
			executeUpdate,
			formatDate,
			t,
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

.error-container {
	width: 50%;
	position: absolute;
	height: fit-content;
	left: 0px;
	top: 55px;
	color: white;
	padding: 5px;
	background-color: rgb(184, 0, 0);
	box-sizing: border-box;
}

.error-container:before {
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

.picker-container {
	display: flex;
	flex-direction: column;
	align-content: center;
	align-items: center;
}

.single-day-link {
	background-color: #49da87;
	color: #002e70;
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
	background-color: #002e70;
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
	background-color: #002e70;
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
		padding-right: 12px;
		padding-left: 12px;
	}
}
</style>
