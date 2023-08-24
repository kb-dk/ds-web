<template>
	<div class="">
		<!-- <deep-zoom-viewer /> -->
		<div>Author: {{ recordItemData }}</div>
	</div>
</template>

<script lang="ts">
import { GenericRecord } from '@/types/GenericRecord';
import { defineComponent, PropType } from 'vue';
/* import DeepZoomViewer from '../viewers/deepzoom/DeepZoomViewer.vue';
 */
export default defineComponent({
	name: 'RecordItem',
	components: {
		/* 		DeepZoomViewer,
		 */
	},
	props: {
		recordItemData: {
			type: Object as PropType<GenericRecord>,
			required: true,
		},
	},
});
</script>
