<template>
	<span>({{ formattedDuration }})</span>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from 'vue';

export default defineComponent({
	name: 'Duration',
	props: {
		isoDuration: {
			type: String as PropType<string>,
			required: true,
		},
	},
	setup(props) {
		const formattedDuration = ref('');

		const formatDuration = () => {
			const isoDuration = props.isoDuration;
			if (isoDuration) {
				const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
				if (match) {
					const hours = parseInt(match[1] || '0');
					const minutes = parseInt(match[2] || '0');
					const seconds = parseInt(match[3] || '0');
					// TODO: Remember to handle translation and localization
					const durationParts: string[] = [];
					if (hours > 0) {
						durationParts.push(`${hours}t`);
					}
					if (minutes > 0) {
						durationParts.push(`${minutes}min`);
					}
					if (seconds > 0) {
						durationParts.push(`${seconds}sek`);
					}
					formattedDuration.value = durationParts.join(' ');
				} else {
					console.log('No match found for the ISO duration format.');
				}
			} else {
				console.log('No ISO duration provided.');
			}
		};

		onMounted(formatDuration);

		return {
			formattedDuration,
		};
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
