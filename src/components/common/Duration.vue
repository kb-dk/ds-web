<template>
	<span class="duration-container">
		<span class="set-duration">{{ parenthesis ? '(' : '' }} {{ formattedDuration }} {{ parenthesis ? ')' : '' }}</span>
	</span>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDuration } from '@/utils/time-utils';

export default defineComponent({
	name: 'Duration',
	props: {
		isoDuration: {
			type: String as PropType<string>,
			default() {
				return '';
			},
		},
		startDate: {
			type: String as PropType<string>,
			required: true,
		},
		endDate: {
			type: String as PropType<string>,
			required: true,
		},
		parenthesis: {
			type: Boolean,
			default() {
				return true;
			},
		},
	},

	setup(props) {
		const { t } = useI18n();

		const formattedDuration = computed(() => {
			return formatDuration(props.isoDuration, props.startDate, props.endDate, t);
		});

		return {
			formattedDuration,
		};
	},
});
</script>

<style scoped>
.set-duration {
	display: flex;
	flex-wrap: wrap;
}
</style>
