import { SelectorData } from '@/types/TimeSearchTypes';
import { ref } from 'vue';

const timeSliderValues = ref<number[]>([1992, 1992]);

const days = ref<SelectorData[]>([
	{ name: 'timeSearch.weekdays.monday', value: 'Monday', selected: false },
	{ name: 'timeSearch.weekdays.tuesday', value: 'Tuesday', selected: false },
	{ name: 'timeSearch.weekdays.wednesday', value: 'Wednesday', selected: false },
	{ name: 'timeSearch.weekdays.thursday', value: 'Thursday', selected: false },
	{ name: 'timeSearch.weekdays.friday', value: 'Friday', selected: false },
	{ name: 'timeSearch.weekdays.saturday', value: 'Saturday', selected: false },
	{ name: 'timeSearch.weekdays.sunday', value: 'Sunday', selected: false },
]);
const timeslots = ref<SelectorData[]>([
	{ name: 'timeSearch.timeslots.morning', value: '[6 TO 12]', selected: false },
	{ name: 'timeSearch.timeslots.midday', value: '[12 TO 18]', selected: false },
	{ name: 'timeSearch.timeslots.evening', value: '[18 TO 24]', selected: false },
	{ name: 'timeSearch.timeslots.night', value: '[0 TO 6]', selected: false },
]);

const months = ref<SelectorData[]>([
	{ name: 'timeSearch.months.january', value: '1', selected: false },
	{ name: 'timeSearch.months.february', value: '2', selected: false },
	{ name: 'timeSearch.months.march', value: '3', selected: false },
	{ name: 'timeSearch.months.april', value: '4', selected: false },
	{ name: 'timeSearch.months.may', value: '5', selected: false },
	{ name: 'timeSearch.months.june', value: '6', selected: false },
	{ name: 'timeSearch.months.july', value: '7', selected: false },
	{ name: 'timeSearch.months.august', value: '8', selected: false },
	{ name: 'timeSearch.months.september', value: '9', selected: false },
	{ name: 'timeSearch.months.october', value: '10', selected: false },
	{ name: 'timeSearch.months.november', value: '11', selected: false },
	{ name: 'timeSearch.months.december', value: '12', selected: false },
]);

export { timeSliderValues, months, days, timeslots };
