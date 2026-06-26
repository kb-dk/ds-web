<template>
	<div
		ref="root"
		class="datepicker"
		@keydown.esc="close"
	>
		<label
			class="datepicker-explanation"
			:for="inputId"
		>
			{{ t('calendar.select') }}:
		</label>

		<div class="input-wrap">
			<input
				:id="inputId"
				ref="input"
				v-model="displayValue"
				class="dp-input"
				:aria-invalid="invalid"
				:aria-describedby="hintId"
				placeholder="DD-MM-YYYY"
				autocomplete="off"
				@keydown.enter.prevent="onInputEnter"
				@blur="onInputEnter"
			/>
			<Transition name="fade">
				<div
					v-if="invalid && displayValue.length > 0"
					class="error-container"
				>
					{{ t('datepicker.error', { start: formatErrorDate(startYear), end: formatErrorDate(endYear) }) }}
				</div>
			</Transition>
			<button
				type="button"
				class="dp-toggle"
				:aria-expanded="opened"
				:aria-controls="calendarId"
				:aria-label="opened ? t('calendar.close') : t('calendar.open')"
				@click="toggle"
			>
				<span class="material-icons">calendar_month</span>
			</button>
		</div>

		<p
			:id="hintId"
			class="visually-hidden"
		>
			{{ t('calendar.explanation') }}
		</p>
		<Transition name="closeAndFade">
			<div
				v-if="opened"
				:id="calendarId"
				ref="calendar"
				class="dp-calendar"
				role="dialog"
				aria-modal="false"
				:aria-labelledby="calendarHeadingId"
			>
				<div class="dp-calendar-header">
					<div class="dp-calendar-selectors">
						<div class="dp-selectors">
							<select
								v-model="selectedMonth"
								class="btn-big"
								@change="onMonthChange"
							>
								<option
									v-for="(m, i) in monthNames"
									:key="i"
									:value="i"
								>
									{{ m }}
								</option>
							</select>

							<select
								v-model="selectedYear"
								class="btn-big"
								@change="onYearChange"
							>
								<option
									v-for="y in yearRange"
									:key="y"
									:value="y"
								>
									{{ y }}
								</option>
							</select>
						</div>
					</div>
					<div class="dp-calender-prev-next">
						<button
							type="button"
							:aria-label="t('calendar.prevMonth')"
							class="material-icons change-month left"
							@click="prevMonth"
						>
							keyboard_arrow_left
						</button>
						<h3 :id="calendarHeadingId">{{ monthTitle }}</h3>
						<button
							type="button"
							:aria-label="t('calendar.nextMonth')"
							class="material-icons change-month right"
							@click="nextMonth"
						>
							keyboard_arrow_right
						</button>
					</div>
				</div>
				<div
					ref="grid"
					role="grid"
					class="dp-grid"
				>
					<div
						role="row"
						class="dp-weeknames"
					>
						<div
							v-for="day in weekNames"
							:key="day"
							role="columnheader"
							class="dp-weekname"
						>
							{{ day }}
						</div>
					</div>
					<div role="rowgroup">
						<div
							v-for="(week, index) in weeks"
							:key="index"
							role="row"
							class="dp-week"
						>
							<button
								v-for="day in week"
								:key="day.key"
								class="dp-day"
								:disabled="day.disabled"
								:class="{
									'dp-day-selected': isSameDate(day.date, modelValue),
									'dp-day-outside': !day.inMonth,
								}"
								role="gridcell"
								:aria-selected="isSameDate(day.date, modelValue) ? 'true' : 'false'"
								:tabindex="isSameDate(day.date, focusDate) ? 0 : -1"
								:aria-label="day.ariaLabel"
								:data-key="day.key"
								@click="selectDay(day.date)"
								@keydown="onDayKeydown($event, day)"
							>
								<span class="dp-day-label label-regular">{{ day.label }}</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import { CalendarDay } from '@/types/CalendarTypes';
import { startYear, endYear } from './timeSearch/TimeSearchInitValues';

export default defineComponent({
	name: 'DatePicker',

	props: {
		modelValue: { type: Date, default: null },
		startDate: { type: Date, default: null },
		endDate: { type: Date, default: null },
		name: { type: String, required: true },
	},

	emits: ['update:modelValue', 'check'],

	setup(props, { emit }) {
		const { t, locale } = useI18n();
		const inputTimer = ref<number | null>(null);

		const today = new Date();
		const opened = ref(false);
		const invalid = ref(false);

		const input = ref<HTMLInputElement>();
		const calendar = ref<HTMLDivElement>();

		const currentView = ref(
			props.modelValue
				? new Date(props.modelValue.getFullYear(), props.modelValue.getMonth(), 1)
				: new Date(today.getFullYear(), today.getMonth(), 1),
		);

		const focusDate = ref(props.modelValue ? new Date(props.modelValue) : new Date(today));

		const uid = useId();
		const idBase = `dp-${props.name}-${uid}`;

		const inputId = idBase;
		const calendarId = `${idBase}-cal`;
		const calendarHeadingId = `${idBase}-heading`;
		const hintId = `${idBase}-hint`;

		const monthNames = computed(() => {
			const formatter = new Intl.DateTimeFormat(locale.value, { month: 'long' });
			return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2000, i, 1)));
		});

		const weekNames = computed(() => {
			const formatter = new Intl.DateTimeFormat(locale.value, { weekday: 'short' });
			const base = new Date(2024, 0, 1);
			return Array.from({ length: 7 }, (_, i) =>
				formatter.format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)).slice(0, 2),
			);
		});

		const selectedMonth = ref(currentView.value.getMonth());
		const selectedYear = ref(currentView.value.getFullYear());

		const minDate = computed(() => (props.startDate ? new Date(props.startDate) : null));
		const maxDate = computed(() => (props.endDate ? new Date(props.endDate) : null));

		const yearRange = computed(() => {
			const start = minDate.value ? minDate.value.getFullYear() : today.getFullYear() - 100;
			const end = maxDate.value ? maxDate.value.getFullYear() : today.getFullYear() + 20;
			const arr = [];
			for (let y = start; y <= end; y++) {
				arr.push(y);
			}
			return arr;
		});

		watch(currentView, (date) => {
			selectedMonth.value = date.getMonth();
			selectedYear.value = date.getFullYear();
		});

		function formatDate(date: Date | null) {
			if (!date) {
				return '';
			}
			const dd = String(date.getDate()).padStart(2, '0');
			const mm = String(date.getMonth() + 1).padStart(2, '0');
			const yyyy = date.getFullYear();
			return `${dd}-${mm}-${yyyy}`;
		}

		function parseInputToDate(str: string) {
			const m = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
			if (!m) {
				return null;
			}
			const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
			return isNaN(d.getTime()) ? null : d;
		}

		function isSameDate(a: Date, b: Date) {
			if (!(a instanceof Date) || !(b instanceof Date)) {
				return false;
			}
			return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
		}

		const displayValue = ref(formatDate(props.modelValue));

		watch(displayValue, (val) => {
			if (inputTimer.value) {
				clearTimeout(inputTimer.value);
			}

			inputTimer.value = window.setTimeout(() => {
				const normalized = val.replace(/[^0-9]/g, (m, i) => (i === 2 || i === 5 ? '-' : ''));
				if (normalized !== val) {
					displayValue.value = normalized;
				}

				const parsed = parseInputToDate(normalized);
				let isInvalid = !parsed;

				if (parsed) {
					const year = parsed.getFullYear();
					if (year < startYear.value.getFullYear() || year > endYear.value.getFullYear()) {
						isInvalid = true;
					}
				}

				invalid.value = isInvalid;

				emit('update:modelValue', parsed);
			}, 100);
		});

		function onInputEnter() {
			const parsed = parseInputToDate(displayValue.value);
			if (!parsed) {
				invalid.value = true;
				return;
			}
			selectDay(parsed);
			close();
		}

		function selectDay(date: Date) {
			/* emit('update:modelValue', new Date(date)); */
			currentView.value = new Date(date.getFullYear(), date.getMonth(), 1);
			focusDate.value = new Date(date);
			displayValue.value = formatDate(date);

			requestAnimationFrame(() => {
				const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
				const el = calendar.value?.querySelector<HTMLElement>(`[data-key="${key}"]`);
				el?.focus();
			});
		}

		function onMonthChange() {
			currentView.value = new Date(selectedYear.value, selectedMonth.value, 1);
			focusDate.value = new Date(selectedYear.value, selectedMonth.value, 1);
		}

		function onYearChange() {
			if (minDate.value && selectedYear.value < minDate.value.getFullYear()) {
				selectedYear.value = minDate.value.getFullYear();
			}
			if (maxDate.value && selectedYear.value > maxDate.value.getFullYear()) {
				selectedYear.value = maxDate.value.getFullYear();
			}
			currentView.value = new Date(selectedYear.value, selectedMonth.value, 1);
			focusDate.value = new Date(selectedYear.value, selectedMonth.value, 1);
		}

		const monthTitle = computed(() =>
			currentView.value.toLocaleString(locale.value, { month: 'long', year: 'numeric' }),
		);

		function buildCalendar(year: number, month: number) {
			const first = new Date(year, month, 1);
			const startDay = (first.getDay() + 6) % 7;
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
			const startDate = new Date(year, month, 1 - startDay);
			const days: CalendarDay[] = [];

			for (let i = 0; i < totalCells; i++) {
				const date = new Date(startDate);
				date.setDate(startDate.getDate() + i);
				const isBeforeMin = !!minDate.value && date < minDate.value;
				const isAfterMax = !!maxDate.value && date > maxDate.value;
				const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

				days.push({
					date,
					label: date.getDate(),
					inMonth: date.getMonth() === month,
					key,
					disabled: isBeforeMin || isAfterMax,
					ariaLabel: date.toLocaleDateString(locale.value, {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					}),
				});
			}

			const weeks = [];
			for (let i = 0; i < days.length; i += 7) {
				weeks.push(days.slice(i, i + 7));
			}
			return weeks;
		}

		const weeks = computed(() => buildCalendar(currentView.value.getFullYear(), currentView.value.getMonth()));
		const flatDays = computed(() => weeks.value.flat());

		function focusSelectedOrToday() {
			const key = props.modelValue
				? `${props.modelValue.getFullYear()}-${props.modelValue.getMonth()}-${props.modelValue.getDate()}`
				: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
			const el = calendar.value?.querySelector<HTMLElement>(`[data-key="${key}"]`);
			el?.focus();
		}

		function prevMonth() {
			const prev = new Date(currentView.value.getFullYear(), currentView.value.getMonth() - 1, 1);
			if (!(minDate.value && prev < minDate.value)) {
				currentView.value = prev;
				focusDate.value = new Date(prev);
			}
		}

		function nextMonth() {
			const next = new Date(currentView.value.getFullYear(), currentView.value.getMonth() + 1, 1);
			if (!(maxDate.value && next > maxDate.value)) {
				currentView.value = next;
				focusDate.value = new Date(next);
			}
		}

		function onDayKeydown(e: KeyboardEvent, day: CalendarDay) {
			const key = e.key;
			const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
			const selectKeys = ['Enter', ' '];

			if (![...arrowKeys, ...selectKeys].includes(key)) {
				return;
			}
			if (day.disabled) {
				e.preventDefault();
				return;
			}
			e.preventDefault();

			if (selectKeys.includes(key)) {
				selectDay(day.date);
				return;
			}

			let newDate = new Date(day.date);
			if (key === 'ArrowLeft') {
				newDate.setDate(newDate.getDate() - 1);
			}
			if (key === 'ArrowRight') {
				newDate.setDate(newDate.getDate() + 1);
			}
			if (key === 'ArrowUp') {
				newDate.setDate(newDate.getDate() - 7);
			}
			if (key === 'ArrowDown') {
				newDate.setDate(newDate.getDate() + 7);
			}

			if (minDate.value && newDate < minDate.value) {
				newDate = new Date(minDate.value);
			}
			if (maxDate.value && newDate > maxDate.value) {
				newDate = new Date(maxDate.value);
			}

			if (
				newDate.getMonth() !== currentView.value.getMonth() ||
				newDate.getFullYear() !== currentView.value.getFullYear()
			) {
				currentView.value = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
			}

			requestAnimationFrame(() => {
				const key = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;
				const el = calendar.value?.querySelector<HTMLElement>(`[data-key="${key}"]`);
				el?.focus();
			});
		}

		function formatErrorDate(date: Date) {
			if (!(date instanceof Date)) {
				return '';
			}
			return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
		}

		function open() {
			opened.value = true;
			requestAnimationFrame(focusSelectedOrToday);
		}
		function close() {
			opened.value = false;
		}
		function toggle() {
			opened.value ? close() : open();
		}

		return {
			t,
			locale,
			inputId,
			calendarId,
			calendarHeadingId,
			hintId,
			opened,
			invalid,
			input,
			calendar,
			currentView,
			focusDate,
			monthNames,
			weekNames,
			selectedMonth,
			selectedYear,
			yearRange,
			minDate,
			maxDate,
			displayValue,
			weeks,
			flatDays,
			monthTitle,
			open,
			close,
			toggle,
			onInputEnter,
			onMonthChange,
			onYearChange,
			prevMonth,
			nextMonth,
			selectDay,
			onDayKeydown,
			isSameDate,
			formatErrorDate,
			startYear,
			endYear,
		};
	},
});
</script>

<style scoped>
.closeAndFade-enter-active,
.closeAndFade-leave-active {
	transition:
		opacity 0.6s ease,
		max-height 0.6s ease,
		margin-bottom 0.6s ease;
	overflow: hidden;
}

.closeAndFade-enter-from,
.closeAndFade-leave-to {
	opacity: 0;
	max-height: 0;
}

.closeAndFade-enter-to,
.closeAndFade-leave-from {
	opacity: 1;
	max-height: 400px;
}

.visually-hidden {
	position: absolute !important;
	height: 1px;
	width: 1px;
	overflow: hidden;
	clip: rect(1px, 1px, 1px, 1px);
}

.dp-day-outside .dp-day-label {
	color: #aaa; /* light grey */
}

.material-icons {
	color: var(--color-main);
}

.datepicker-explanation {
	text-align: start;
	width: 100%;
	margin-bottom: 5px;
	visibility: hidden;
}

.datepicker {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	font-family: noway, sans-serif;
}

.dp-selectors {
	width: 100%;
	display: flex;
	justify-content: space-between;
}

.dp-selectors select {
	border: 0px;
	background-color: white;
	border: 1px solid #dadada;
	border-radius: 4px;
	padding: 4px 50px 5px 8px;
	color: #002e70;
	-webkit-appearance: none;
	-moz-appearance: none;
	background-color: white;
	background: url('@/assets/icons/blue/dd-arrow-blue.svg') white;
	background-repeat: no-repeat;
	background-position-x: 85px;
	background-position-y: 13px;
	width: 118px;
	box-sizing: border-box;
	height: 48px;
}

.input-wrap {
	display: flex;
	gap: 8px;
	align-items: center;
	position: relative;
}

.dp-day:hover {
	background-color: var(--bg-light);
}

.dp-day-disabled {
	color: #ccc;
	opacity: 0.4;
	cursor: default;
	pointer-events: none;
}

.dp-input {
	padding: 8px 10px;
	width: calc(266px - 22px);
	height: 22px;
	font-family: noway, sans-serif;
	font-size: 20px;
	color: #0a2e70;
	border-radius: 4px;
	border: 1px solid var(--color-main);
	height: 48px;
	box-sizing: border-box;
}

.dp-toggle {
	background: transparent;
	border: 1px solid var(--bg-default-gray);
	padding: 8px;
	border-radius: 4px;
	height: 48px;
	width: 48px;
	cursor: pointer;
	border: 1px solid var(--color-main);
	transition: all 0.15s linear 0s;
}

.dp-toggle span {
	transition: all 0.15s linear 0s;
}

.dp-toggle:hover span {
	color: #ffffff;
}

.dp-toggle:hover {
	background-color: var(--color-main);
}

.dp-selectors select {
	width: calc(50% - 5px);
	cursor: pointer;
}

.dp-calendar {
	position: relative;
	z-index: 50;
	margin-top: 8px;
	background: white;
	border: 1px solid #ddd;
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
	padding: 12px;
	border-radius: 6px;
}
.dp-calendar-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8px;
	flex-direction: column;
}

.dp-calender-prev-next {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	justify-content: space-between;
}

.dp-calender-prev-next button {
	border: 0px;
	background-color: transparent;
	font-size: 32px;
	cursor: pointer;
}

.dp-calender-prev-next h3 {
	text-transform: capitalize;
}

.dp-calendar-selectors {
	width: 100%;
	display: flex;
	justify-content: space-between;
}

.dp-grid {
	display: block;
}
.dp-weeknames {
	display: grid;
	grid-template-columns: repeat(7, 36px);
	gap: 4px;
	margin-bottom: 6px;
}

.dp-weekname {
	text-transform: capitalize;
	display: flex;
	justify-content: center;
}

.dp-week {
	display: grid;
	grid-template-columns: repeat(7, 36px);
	gap: 4px;
}
.dp-day {
	height: 36px;
	width: 36px;
	border: none;
	background: transparent;
	cursor: pointer;
	border-radius: 4px;
	transition: all 0.15s linear 0s;
}
.dp-day:focus {
	outline: 2px solid var(--color-main);
}
.dp-day[aria-selected='true'],
.dp-day-selected {
	background-color: var(--color-main);
	color: white;
	font-weight: bold;
}

.error-container {
	width: 50%;
	position: absolute;
	height: fit-content;
	left: 65px;
	top: -78px;
	color: white;
	padding: 5px;
	background-color: var(--color-alert-red);
	box-sizing: border-box;
	z-index: 200;
	bottom: -5px;
}

.error-container:before {
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 7px solid transparent;
	border-right: 7px solid transparent;
	border-top: 7px solid var(--color-alert-red);
	bottom: -7px;
	position: absolute;
	left: 50%;
	transform: translate(-50%, 0%);
}
</style>
