import { ComposerTranslation } from 'vue-i18n';

function calculateDuration(startDate: string, endDate: string, t: ComposerTranslation) {
	const startDateObj = new Date(startDate);
	const endDateObj = new Date(endDate);
	let formattedDuration;

	const isStartDateValid = startDate && !isNaN(startDateObj.getTime());
	const isEndDateValid = endDate && !isNaN(endDateObj.getTime());

	if (isStartDateValid && isEndDateValid) {
		const duration = endDateObj.getTime() - startDateObj.getTime();

		if (!isNaN(duration)) {
			const hours = Math.floor(duration / 3600000);
			const minutes = Math.floor((duration % 3600000) / 60000);
			const seconds = Math.floor((duration % 60000) / 1000);
			const durationParts = generateDurationParts(hours, minutes, seconds, t);
			return (formattedDuration = durationParts.join(' '));
		}
	}
	formattedDuration = t('duration.unknown');
	return formattedDuration;
}

function formatDuration(
	isoDuration: string | undefined,
	startDate: string | undefined,
	endDate: string | undefined,
	t: ComposerTranslation,
): string {
	let formattedDuration = '';

	if (isoDuration && isoDuration !== '') {
		const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
		if (match) {
			const hours = parseInt(match[1] || '0');
			const minutes = parseInt(match[2] || '0');
			const seconds = parseInt(match[3] || '0');
			const durationParts = generateDurationParts(hours, minutes, seconds, t);
			formattedDuration = durationParts.join(' ');
		} else {
			if (startDate && endDate) {
				//If the matcher does not come through - do manual calc
				formattedDuration = calculateDuration(startDate, endDate, t);
			} else {
				formattedDuration = t('duration.unknown');
			}
		}
	} else if (startDate && endDate) {
		//If there is no duration at all or it is empty - do manual calc
		formattedDuration = calculateDuration(startDate, endDate, t);
	} else {
		formattedDuration = t('duration.unknown');
	}
	return formattedDuration;
}

function generateDurationParts(hours: number, minutes: number, seconds: number, t: ComposerTranslation) {
	const durationParts: string[] = [];
	if (hours > 0) {
		durationParts.push(`${hours}${t('duration.hours')}`);
	}
	if (minutes > 0) {
		durationParts.push(`${minutes}${t('duration.minutes')}`);
	}
	if (seconds > 0) {
		durationParts.push(`${seconds}${t('duration.seconds')}`);
	}
	return durationParts;
}

function getTimeFromISOFormat(duration: string) {
	const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
	if (match) {
		const hours = parseInt(match[1] || '0');
		const minutes = parseInt(match[2] || '0');
		const seconds = parseInt(match[3] || '0');

		const totalMilliseconds = ((hours * 60 + minutes) * 60 + seconds) * 1000;

		return totalMilliseconds;
	} else {
		return 0;
	}
}

function convertSecondstoShow(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000); // Convert milliseconds to seconds
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	const timeStringSecond = (remainingSeconds < 10 ? '0' : '') + Math.round(remainingSeconds);
	const timeStringMinutes = (minutes < 10 ? '0' : '') + minutes;
	const timeString = `${hours}:${timeStringMinutes}:${timeStringSecond}`;
	return timeString;
}

function getBroadcastDate(isoDate: string, locale: string): string {
	const date = new Date(isoDate);

	// Define formatting options - had to do the weird const typing...
	const options = {
		year: 'numeric' as const,
		month: 'long' as const,
		day: 'numeric' as const,
	};

	return locale === 'da'
		? new Intl.DateTimeFormat('da-DK', options).format(date)
		: new Intl.DateTimeFormat('en-GB', options).format(date);
}
function getBroadcastTime(isoDate: string): string {
	const dateObj = new Date(isoDate);

	// Formatting options - had to do the weird const typing...
	const options = {
		hour: '2-digit' as const,
		minute: '2-digit' as const,
		hour12: false as const,
	};

	return new Intl.DateTimeFormat('en-GB', options).format(dateObj);
}

export { formatDuration, getBroadcastDate, getBroadcastTime, getTimeFromISOFormat, convertSecondstoShow };
