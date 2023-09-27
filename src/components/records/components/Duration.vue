<template>
	<span>({{ formattedDuration }})</span>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'Duration',
	props: {
		isoDuration: {
			type: String as PropType<string>,
		},
		startDate: {
			type: String as PropType<string>,
			required: true,
		},
		endDate: {
			type: String as PropType<string>,
			required: true,
		},
	},

	setup(props) {
		const formattedDuration = ref('');
		const { locale, t } = useI18n();

		const calculateDuration = (startDate: string, endDate: string) => {
			const startDateObj = new Date(startDate);
			const endDateObj = new Date(endDate);

			const isStartDateValid = startDate && !isNaN(startDateObj.getTime());
			const isEndDateValid = endDate && !isNaN(endDateObj.getTime());

			if (isStartDateValid && isEndDateValid) {
				const duration = endDateObj.getTime() - startDateObj.getTime();

				if (!isNaN(duration)) {
					const hours = Math.floor(duration / 3600000);
					const minutes = Math.floor((duration % 3600000) / 60000);
					const seconds = Math.floor((duration % 60000) / 1000);
					const durationParts = generateDurationParts(hours, minutes, seconds);
					formattedDuration.value = durationParts.join(' ');
					return;
				}
			}
			formattedDuration.value = t('duration.unknown');
		};

		const formatDuration = () => {
			const isoDuration = props.isoDuration;
			const startDate = props.startDate;
			const endDate = props.endDate;

			if (isoDuration && isoDuration !== '') {
				const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
				if (match) {
					const hours = parseInt(match[1] || '0');
					const minutes = parseInt(match[2] || '0');
					const seconds = parseInt(match[3] || '0');
					const durationParts = generateDurationParts(hours, minutes, seconds);
					formattedDuration.value = durationParts.join(' ');
				} else {
					//If the matcher does not come through - do manual calc
					calculateDuration(startDate, endDate);
				}
			} else if (startDate && endDate) {
				//If there is no duration at all or it is empty - do manual calc
				calculateDuration(startDate, endDate);
			} else {
				formattedDuration.value = t('duration.unknown');
			}
		};

		const generateDurationParts = (hours: number, minutes: number, seconds: number) => {
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
		};

		watch(locale, () => {
			formatDuration();
		});

		onMounted(formatDuration);

		return {
			formattedDuration,
		};
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
