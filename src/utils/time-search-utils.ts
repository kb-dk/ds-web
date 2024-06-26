import { SelectorData } from '@/types/TimeSearchTypes';
import { ComposerTranslation } from 'vue-i18n';

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

const getSelectedFromArray = (array: SelectorData[]) => {
	return array.filter((entity) => entity.selected).map((entity) => entity.value);
};

const selectionSummary = (years: number[], months: SelectorData[], days: SelectorData[], t: ComposerTranslation) => {
	const nrYears = getYears(years);
	const nrMonths = getMonths(months);
	const nrDays = getDays(days);
	return `${nrYears} ${t('timeSearch.year', nrYears)} / ${Number(nrMonths.length * nrYears)} ${t(
		'timeSearch.month',
		Number(nrMonths.length * nrYears),
	)} / ${Number(nrMonths.length * nrYears * nrDays.length)} ${t(
		'timeSearch.day',
		Number(nrMonths.length * nrYears * nrDays.length),
	)}`;
};

const showMonthSelection = (years: number[], months: SelectorData[], t: ComposerTranslation) => {
	const nrYears = getYears(years);
	const nrMonths = getMonths(months);
	return `${nrMonths.length} ${t('timeSearch.month', nrMonths.length)} x (${nrYears} ${t(
		'timeSearch.year',
		nrYears,
	)}) = `;
	//return nrMonths.length + ' måneder x (' + nrYears + ') = ';
};

const showMonthResult = (years: number[], months: SelectorData[], t: ComposerTranslation) => {
	const nrYears = getYears(years);
	const nrMonths = getMonths(months);
	return `${Number(nrMonths.length * nrYears)} ${t('timeSearch.month', Number(nrMonths.length * nrYears))}`;
};

const showDaySelection = (years: number[], months: SelectorData[], days: SelectorData[], t: ComposerTranslation) => {
	const nrYears = getYears(years);
	const nrMonths = getMonths(months);
	const nrDays = getDays(days);
	return `${nrDays.length} ${t('timeSearch.day', nrDays.length)} x (${Number(nrMonths.length * nrYears)} ${t(
		'timeSearch.month',
		Number(nrMonths.length * nrYears),
	)}) = `;
};

const showDayResult = (years: number[], months: SelectorData[], days: SelectorData[], t: ComposerTranslation) => {
	const nrYears = getYears(years);
	const nrMonths = getMonths(months);
	const nrDays = getDays(days);
	return `${Number(nrMonths.length * nrYears * nrDays.length)} ${t(
		'timeSearch.day',
		Number(nrMonths.length * nrYears * nrDays.length),
	)}`;
};

const updateCheckbox = (array: SelectorData[], index: number, val: boolean) => {
	array[index].selected = val;
};

const updateAllCheckbox = (array: SelectorData[], index: number, val: boolean) => {
	if (val === true) {
		array.forEach((item) => {
			item.selected = true;
		});
	} else {
		array.forEach((item, index) => {
			if (index === 0) {
				item.selected = true;
			} else {
				item.selected = false;
			}
		});
	}
};

export {
	getYears,
	getMonths,
	getDays,
	selectionSummary,
	showMonthSelection,
	showMonthResult,
	showDaySelection,
	showDayResult,
	updateCheckbox,
	updateAllCheckbox,
	getSelectedFromArray,
};
