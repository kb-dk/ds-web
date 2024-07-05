import { SelectorData } from '@/types/TimeSearchTypes';
import { ref } from 'vue';

const timeSliderValues = ref<number[]>([1992, 2002]);

const days = ref<SelectorData[]>([
	{ name: 'timeSearch.weekdays.monday', value: 'Monday', selected: true },
	{ name: 'timeSearch.weekdays.tuesday', value: 'Tuesday', selected: true },
	{ name: 'timeSearch.weekdays.wednesday', value: 'Wednesday', selected: true },
	{ name: 'timeSearch.weekdays.thursday', value: 'Thursday', selected: true },
	{ name: 'timeSearch.weekdays.friday', value: 'Friday', selected: true },
	{ name: 'timeSearch.weekdays.saturday', value: 'Saturday', selected: true },
	{ name: 'timeSearch.weekdays.sunday', value: 'Sunday', selected: true },
]);
const timeslots = ref<SelectorData[]>([
	{ name: 'timeSearch.timeslots.morning', value: '[6 TO 12]', selected: true },
	{ name: 'timeSearch.timeslots.midday', value: '[12 TO 18]', selected: true },
	{ name: 'timeSearch.timeslots.evening', value: '[18 TO 24]', selected: true },
	{ name: 'timeSearch.timeslots.night', value: '[0 TO 6]', selected: true },
]);

const months = ref<SelectorData[]>([
	{ name: 'timeSearch.months.january', value: '1', selected: true },
	{ name: 'timeSearch.months.february', value: '2', selected: true },
	{ name: 'timeSearch.months.march', value: '3', selected: true },
	{ name: 'timeSearch.months.april', value: '4', selected: true },
	{ name: 'timeSearch.months.may', value: '5', selected: true },
	{ name: 'timeSearch.months.june', value: '6', selected: true },
	{ name: 'timeSearch.months.july', value: '7', selected: true },
	{ name: 'timeSearch.months.august', value: '8', selected: true },
	{ name: 'timeSearch.months.september', value: '9', selected: true },
	{ name: 'timeSearch.months.october', value: '10', selected: true },
	{ name: 'timeSearch.months.november', value: '11', selected: true },
	{ name: 'timeSearch.months.december', value: '12', selected: true },
]);

export { timeSliderValues, months, days, timeslots };
