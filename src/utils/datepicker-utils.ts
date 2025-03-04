import { endYear, startYear } from '@/components/common/timeSearch/TimeSearchInitValues';
import { Ref } from 'vue';

const updateSelectedDate = (
	e: Event,
	timer: ReturnType<typeof setTimeout> | null,
	isDateValid: Ref<boolean>,
	inputVar: Ref<Date | null>,
	updateLink: () => void,
) => {
	if (timer) {
		clearTimeout(timer);
	}
	const input = e.target as HTMLInputElement;
	let dateInput = input.value;
	dateInput = dateInput.replace(/[.-]/g, '/');
	const splitDateInput = dateInput.split('/');
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
					const holder = new Date(setDate.getTime());
					inputVar.value = holder;
					updateLink();
					isDateValid.value = true;
				} else {
					isDateValid.value = false;
				}
			} else {
				isDateValid.value = false;
			}
		} else {
			isDateValid.value = false;
		}
	} else {
		isDateValid.value = false;
	}
};

export { updateSelectedDate };
