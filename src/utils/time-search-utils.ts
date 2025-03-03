import { SelectorData } from '@/types/TimeSearchTypes';
import { ComposerTranslation } from 'vue-i18n';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { months, days, timeslots, startDate, endDate } from '@/components/common/timeSearch/TimeSearchInitValues';

const getYears = (TimeSliderValues: number[]) => {
	return Number(TimeSliderValues[1] - TimeSliderValues[0]) === 0
		? 1
		: Number(TimeSliderValues[1] - TimeSliderValues[0]);
};

const getMonths = (months: SelectorData[]) => {
	return months.filter((item) => item.selected);
};

const getDays = (days: SelectorData[]) => {
	return days.filter((item) => item.selected);
};

const getTimeslots = (timeslots: SelectorData[]) => {
	return timeslots.filter((item) => item.selected);
};

const getSelectedFromArray = (array: SelectorData[]) => {
	return array.filter((entity) => entity.selected).map((entity) => entity.value);
};

const resetAllSelectorValues = (array: SelectorData[]) => {
	array.forEach((item) => {
		item.selected = false;
	});
};

const getTimeResults = (allowYearSearch: boolean) => {
	const timeSearchStore = useTimeSearchStore();
	timeSearchStore.getTimeSearchResults(
		allowYearSearch ? startDate.value.toISOString() : '',
		allowYearSearch ? endDate.value.toISOString() : '',
		getSelectedFromArray(months.value),
		getSelectedFromArray(days.value),
		getSelectedFromArray(timeslots.value),
	);
};

const getQueryStringFromArray = (array: string[], prefix: string) => {
	let selected = '';
	if (array.length > 0) {
		selected = prefix;
	}
	array.forEach((item, index) => {
		selected += encodeURIComponent(`${item}`);
		if (index !== array.length - 1) {
			selected += ' OR ';
		}
	});
	if (array.length > 0) {
		selected += ')';
	}
	return selected;
};

const getSublineForYears = (startDate: Date, endDate: Date, t: ComposerTranslation) => {
	const startYear = startDate.getFullYear();
	const endYear = endDate.getFullYear();

	let yearsDifference = endYear - startYear + 1;

	const isBeforeStartDate =
		endDate.getMonth() < startDate.getMonth() ||
		(endDate.getMonth() === startDate.getMonth() && endDate.getDate() < startDate.getDate());

	if (isBeforeStartDate) {
		yearsDifference--;
	}

	return `${yearsDifference} ${t('timeSearch.year', yearsDifference)}`;
};

const getSublineForMonths = (months: SelectorData[], t: ComposerTranslation) => {
	if (getMonths(months).length === 0 || getMonths(months).length === 12) {
		return `${t('timeSearch.allMonths')}`;
	} else {
		return `${getMonths(months).length} ${t('timeSearch.month', getMonths(months).length)}`;
	}
};

const getSublineForDays = (days: SelectorData[], t: ComposerTranslation) => {
	if (getDays(days).length === 0 || getDays(days).length === 7) {
		return `${t('timeSearch.allDays')}`;
	} else {
		return `${getDays(days).length} ${t('timeSearch.weekday', getDays(days).length)}`;
	}
};

const getSublineForTimeslots = (timeslots: SelectorData[], t: ComposerTranslation) => {
	if (getTimeslots(timeslots).length === 0 || getTimeslots(timeslots).length === 4) {
		return `${t('timeSearch.allTimeslots')}`;
	} else {
		return `${getTimeslots(timeslots).length} ${t('timeSearch.timePeriods', getTimeslots(timeslots).length)}`;
	}
};

export {
	getYears,
	getMonths,
	getDays,
	getSelectedFromArray,
	getTimeResults,
	getQueryStringFromArray,
	getTimeslots,
	resetAllSelectorValues,
	getSublineForMonths,
	getSublineForDays,
	getSublineForTimeslots,
	getSublineForYears,
};
