<template>
	<div
		ref="root"
		class="datepicker"
		@keydown.esc="close"
	>
		<label
			:for="inputId"
			class="visually-hidden"
		>
			Select date
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
			/>
			<Transition name="fade">
				<div
					v-if="invalid"
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
				:aria-label="opened ? 'Close calendar' : 'Open calendar'"
				@click="toggle"
			>
				<span class="material-icons">event</span>
			</button>
		</div>

		<p
			:id="hintId"
			class="visually-hidden"
		>
			Type a date in format DD-MM-YYYY or pick from the calendar.
		</p>

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
						aria-label="Previous month"
						@click="prevMonth"
					>
						‹
					</button>
					<h3 :id="calendarHeadingId">{{ monthTitle }}</h3>
					<button
						type="button"
						aria-label="Next month"
						@click="nextMonth"
					>
						›
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
							:disabled="day.disabled ? true : false"
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
							<span class="dp-day-label">{{ day.label }}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { startYear, endYear } from './timeSearch/TimeSearchInitValues';
import { CalendarDay } from '@/types/CalendarTypes';

const props = defineProps({
	modelValue: {
		type: Date,
		default: null,
	},
	startDate: {
		type: Date,
		default: null,
	},
	endDate: {
		type: Date,
		default: null,
	},
});
const emit = defineEmits(['update:modelValue', 'check']);

const { t, locale } = useI18n();

const inputId = `dp-${Math.random().toString(36).slice(2, 9)}`;
const calendarId = `dp-cal-${Math.random().toString(36).slice(2, 9)}`;
const calendarHeadingId = `dp-h-${Math.random().toString(36).slice(2, 9)}`;
const hintId = `dp-hint-${Math.random().toString(36).slice(2, 9)}`;

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

const monthNames = computed(() => {
	const formatter = new Intl.DateTimeFormat(locale.value, { month: 'long' });
	return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2000, i, 1)));
});

const weekNames = computed(() => {
	const formatter = new Intl.DateTimeFormat(locale.value, { weekday: 'short' });
	const base = new Date(2024, 0, 1);

	return Array.from({ length: 7 }, (_, i) => {
		const w = formatter.format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
		return w.slice(0, 2);
	});
});

const selectedMonth = ref(currentView.value.getMonth());
const selectedYear = ref(currentView.value.getFullYear());

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

watch(currentView, (v) => {
	selectedMonth.value = v.getMonth();
	selectedYear.value = v.getFullYear();
});

const yearRange = computed(() => {
	const start = minDate.value ? minDate.value.getFullYear() : today.getFullYear() - 100;
	const end = maxDate.value ? maxDate.value.getFullYear() : today.getFullYear() + 20;

	const years = [];
	for (let y = start; y <= end; y++) years.push(y);
	return years;
});

const minDate = computed(() =>
	props.startDate
		? new Date(props.startDate.getFullYear(), props.startDate.getMonth(), props.startDate.getDate())
		: null,
);

const maxDate = computed(() =>
	props.endDate ? new Date(props.endDate.getFullYear(), props.endDate.getMonth(), props.endDate.getDate()) : null,
);

function monthIsBefore(date: Date, min: Date | null) {
	if (!min) return false;
	return (
		date.getFullYear() < min.getFullYear() ||
		(date.getFullYear() === min.getFullYear() && date.getMonth() < min.getMonth())
	);
}

function monthIsAfter(date: Date, max: Date | null) {
	if (!max) return false;
	return (
		date.getFullYear() > max.getFullYear() ||
		(date.getFullYear() === max.getFullYear() && date.getMonth() > max.getMonth())
	);
}

const formatErrorDate = (date: Date) => {
	if (!(date instanceof Date)) return '';
	return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
};

function formatDate(date: Date) {
	if (!date) return '';
	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const yyyy = date.getFullYear();
	return `${dd}-${mm}-${yyyy}`;
}

function parseInputToDate(str: string) {
	const m = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
	if (!m) return null;

	const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
	if (isNaN(d.getTime())) return null;

	return d;
}

function isSameDate(a: Date, b: Date) {
	if (!(a instanceof Date) || !(b instanceof Date)) return false;
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const displayValue = computed({
	get() {
		return formatDate(props.modelValue);
	},
	set(value) {
		const d = parseInputToDate(value);
		invalid.value = !d;
		if (d) {
			currentView.value = new Date(d.getFullYear(), d.getMonth(), 1);
		}
	},
});

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

function onInputEnter() {
	if (!invalid.value) close();
}

const monthTitle = computed(() =>
	currentView.value.toLocaleString(locale.value, {
		month: 'long',
		year: 'numeric',
	}),
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

		const key = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

		days.push({
			date: date,
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
	if (!monthIsBefore(prev, minDate.value)) {
		currentView.value = prev;
		focusDate.value = new Date(prev);
	}
}

function nextMonth() {
	const next = new Date(currentView.value.getFullYear(), currentView.value.getMonth() + 1, 1);
	if (!monthIsAfter(next, maxDate.value)) {
		currentView.value = next;
		focusDate.value = new Date(next);
	}
}

function selectDay(date: Date) {
	emit('update:modelValue', new Date(date));
	currentView.value = new Date(date.getFullYear(), date.getMonth(), 1);
	focusDate.value = new Date(date);
	requestAnimationFrame(() => {
		const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
		const el = calendar.value?.querySelector<HTMLElement>(`[data-key="${key}"]`);
		el?.focus();
	});
}

function onDayKeydown(e: KeyboardEvent, day: CalendarDay) {
	const key = e.key;

	const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
	const selectKeys = ['Enter', ' '];

	if (![...arrowKeys, ...selectKeys].includes(key)) return;

	if (day.disabled) {
		e.preventDefault();
		return;
	}

	e.preventDefault();

	const allDays = flatDays.value;
	const currentIndex = allDays.findIndex((d) => d.key === day.key);
	if (currentIndex === -1) return;

	if (selectKeys.includes(key)) {
		return selectDay(day.date);
	}
	let targetIndex = currentIndex;
	if (key === 'ArrowLeft') targetIndex -= 1;
	if (key === 'ArrowRight') targetIndex += 1;
	if (key === 'ArrowUp') targetIndex -= 7;
	if (key === 'ArrowDown') targetIndex += 7;

	let targetDay: CalendarDay | null = null;

	if (targetIndex < 0 && key === 'ArrowUp') {
		const prevMonth = new Date(currentView.value.getFullYear(), currentView.value.getMonth() - 1, 1);
		const prevMonthWeeks = buildCalendar(prevMonth.getFullYear(), prevMonth.getMonth());
		const lastWeek = prevMonthWeeks[prevMonthWeeks.length - 1];
		const col = currentIndex % 7;
		targetDay = lastWeek[col];
		currentView.value = prevMonth;
	} else if (targetIndex >= allDays.length && key === 'ArrowDown') {
		const nextMonth = new Date(currentView.value.getFullYear(), currentView.value.getMonth() + 1, 1);
		const nextMonthWeeks = buildCalendar(nextMonth.getFullYear(), nextMonth.getMonth());
		const firstWeek = nextMonthWeeks[0];
		const col = currentIndex % 7;
		targetDay = firstWeek[col];
		currentView.value = nextMonth;
	} else if (targetIndex >= 0 && targetIndex < allDays.length) {
		targetDay = allDays[targetIndex];
		if (!targetDay.inMonth) {
			currentView.value = new Date(targetDay.date.getFullYear(), targetDay.date.getMonth(), 1);
		}
	}
	if (targetDay) {
		requestAnimationFrame(() => {
			const el = calendar.value?.querySelector<HTMLElement>(`[data-key="${targetDay.key}"]`);
			el?.focus();
		});
	}
}
</script>

<style scoped>
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
	color: rgb(10, 46, 112);
}

.datepicker {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}

.dp-selectors {
	width: 100%;
	display: flex;
	justify-content: space-between;
}

.dp-selectors select {
	padding: 4px 6px;
	border: 1px solid #ccc;
	border-radius: 4px;
	background: white;
	text-align: center;
}

.input-wrap {
	display: flex;
	gap: 8px;
	align-items: center;
}

.dp-day-disabled {
	color: #ccc;
	opacity: 0.4;
	cursor: default;
	pointer-events: none;
}

.dp-input {
	padding: 8px 10px;
	width: calc(266px - 40px);
	height: 20px;
}
.dp-toggle {
	background: transparent;
	border: 1px solid #ccc;
	padding: 8px;
	border-radius: 4px;
	height: 40px;
	width: 40px;
}

.dp-selectors select {
	width: calc(50% - 5px);
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
}
.dp-day:focus {
	outline: 2px solid #007acc;
}
.dp-day[aria-selected='true'],
.dp-day-selected {
	background-color: #007acc;
	color: white;
	font-weight: bold;
}

.error-container {
	width: 50%;
	position: absolute;
	height: fit-content;
	left: 65px;
	top: -45px;
	color: white;
	padding: 5px;
	background-color: rgb(184, 0, 0);
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
	border-top: 7px solid rgb(184, 0, 0);
	bottom: -7px;
	position: absolute;
	left: 50%;
	transform: translate(-50%, 0%);
}
</style>
