import { SelectorData } from '@/types/TimeSearchTypes';
import { ref } from 'vue';

const initSliderValues = ref<number[]>([1992, 1992]);
const initStartDate = ref<Date>(new Date(1992, 0, 1, 0, 0, 0)); // January 1, 1992, 00:00:00
const initEndDate = ref<Date>(new Date(1992, 11, 31, 23, 59, 59)); // December 31, 1992, 23:59:59

const timeSliderValues = ref<number[]>(initSliderValues.value);
const startDate = ref<Date>(initStartDate.value); // January 1, 1992, 00:00:00
const endDate = ref<Date>(initEndDate.value); // December 31, 1992, 23:59:59

/* these are just the preset values. Should be updated when we got the new repo */
const startYear = ref<Date>(new Date(1921, 0, 1, 0, 0, 0));
const endYear = ref<Date>(new Date(2022, 11, 31, 23, 59, 59));

const days = ref<SelectorData[]>([
	{ name: 'timeSearch.weekdays.monday', value: 'Monday', selected: false, index: 0 },
	{ name: 'timeSearch.weekdays.tuesday', value: 'Tuesday', selected: false, index: 1 },
	{ name: 'timeSearch.weekdays.wednesday', value: 'Wednesday', selected: false, index: 2 },
	{ name: 'timeSearch.weekdays.thursday', value: 'Thursday', selected: false, index: 3 },
	{ name: 'timeSearch.weekdays.friday', value: 'Friday', selected: false, index: 4 },
	{ name: 'timeSearch.weekdays.saturday', value: 'Saturday', selected: false, index: 5 },
	{ name: 'timeSearch.weekdays.sunday', value: 'Sunday', selected: false, index: 6 },
]);
const timeslots = ref<SelectorData[]>([
	{ name: 'timeSearch.timeslots.morning', value: '[6 TO 12]', selected: false, index: 0 },
	{ name: 'timeSearch.timeslots.midday', value: '[12 TO 18]', selected: false, index: 1 },
	{ name: 'timeSearch.timeslots.evening', value: '[18 TO 24]', selected: false, index: 2 },
	{ name: 'timeSearch.timeslots.night', value: '[0 TO 6]', selected: false, index: 3 },
]);

const months = ref<SelectorData[]>([
	{ name: 'timeSearch.months.january', value: '1', selected: false, index: 0 },
	{ name: 'timeSearch.months.february', value: '2', selected: false, index: 1 },
	{ name: 'timeSearch.months.march', value: '3', selected: false, index: 2 },
	{ name: 'timeSearch.months.april', value: '4', selected: false, index: 3 },
	{ name: 'timeSearch.months.may', value: '5', selected: false, index: 4 },
	{ name: 'timeSearch.months.june', value: '6', selected: false, index: 5 },
	{ name: 'timeSearch.months.july', value: '7', selected: false, index: 6 },
	{ name: 'timeSearch.months.august', value: '8', selected: false, index: 7 },
	{ name: 'timeSearch.months.september', value: '9', selected: false, index: 8 },
	{ name: 'timeSearch.months.october', value: '10', selected: false, index: 9 },
	{ name: 'timeSearch.months.november', value: '11', selected: false, index: 10 },
	{ name: 'timeSearch.months.december', value: '12', selected: false, index: 11 },
]);

export {
	timeSliderValues,
	months,
	days,
	timeslots,
	startDate,
	endDate,
	initSliderValues,
	initEndDate,
	initStartDate,
	startYear,
	endYear,
};
