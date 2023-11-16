<template>
	<span>({{ formattedDuration }})</span>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDuration } from '@/utils/time-utils';

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

		watch(locale, () => {
			formattedDuration.value = formatDuration(props.isoDuration, props.startDate, props.endDate, t);
		});

		onMounted(() => {
			formattedDuration.value = formatDuration(props.isoDuration, props.startDate, props.endDate, t);
		});

		return {
			formattedDuration,
		};
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
