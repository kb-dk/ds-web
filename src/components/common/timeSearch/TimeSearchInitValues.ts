import { SelectorData } from '@/types/TimeSearchTypes';
import { computed, ref } from 'vue';

const initSliderValues = ref<number[]>([2015, 2015]);
const initStartDate = ref<Date>(new Date(2015, 0, 1, 0, 0, 0)); // January 1, 2015, 00:00:00
const initEndDate = ref<Date>(new Date(2015, 11, 31, 23, 59, 59)); // December 31, 2015, 23:59:59

const timeSliderValues = ref<number[]>(initSliderValues.value);
const startDate = ref<Date | null>(initStartDate.value); // January 1, 2015, 00:00:00
const endDate = ref<Date | null>(initEndDate.value); // December 31, 2015, 23:59:59

/* these are just the preset values. Should be updated when we got the new index in solr */
const startYear = ref<Date>(new Date(2006, 0, 1, 0, 0, 0));
const endYear = ref<Date>(new Date(2024, 11, 31, 23, 59, 59));

const estimatedQueryLength = ref({
	weekdays: 0,
	months: 0,
	timeslots: 0,
});
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
const addToEstimatedQueryLength = (length: number, type: string, array: SelectorData[]) => {
	let initialExtraString = 0;
	if (getNumberOfChecked(array) === 1) {
		initialExtraString = `&fq=temporal_start_${type}_da%253A(`.length;
	} else {
		initialExtraString = '%2520OR%2520'.length;
	}
	estimatedQueryLength.value[type as keyof typeof estimatedQueryLength.value] += length + initialExtraString;
};
const removeFromEstimatedQueryLength = (length: number, type: string, array: SelectorData[]) => {
	let initialExtraString = `&fq=temporal_start_${type}_da%253A(`.length;
	if (getNumberOfChecked(array) > 0) {
		initialExtraString = '%2520OR%2520'.length;
	}
	estimatedQueryLength.value[type as keyof typeof estimatedQueryLength.value] -= length + initialExtraString;
};
const clearEstimatedQueryLength = () => {
	estimatedQueryLength.value.months = 0;
	estimatedQueryLength.value.weekdays = 0;
	estimatedQueryLength.value.timeslots = 0;
};
const calcEstimatedTimeSearchStringLength = computed(() => {
	return estimatedQueryLength.value.weekdays + estimatedQueryLength.value.timeslots + estimatedQueryLength.value.months;
});

const getNumberOfChecked = (array: SelectorData[]) => {
	return array.filter((val) => val.selected).length;
};

const allDaysChecked = computed(() => {
	return getNumberOfChecked(days.value) === days.value.length;
});
const allMonthsChecked = computed(() => {
	return getNumberOfChecked(months.value) === months.value.length;
});
const allTimeslotsChecked = computed(() => {
	return getNumberOfChecked(timeslots.value) === timeslots.value.length;
});
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
	estimatedQueryLength,
	addToEstimatedQueryLength,
	removeFromEstimatedQueryLength,
	calcEstimatedTimeSearchStringLength,
	clearEstimatedQueryLength,
	allDaysChecked,
	allMonthsChecked,
	allTimeslotsChecked,
};
