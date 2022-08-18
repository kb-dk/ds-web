<template>
	<div class="">
		<deep-zoom-viewer />
		<div>Author: {{ recordItemData.author[0].name['@value'] }}</div>
		<div>About: {{ recordItemData.about[0].name[0]['@value'] }}</div>
	</div>
</template>

<script lang="ts">
import { GenericRecord } from '@/types/GenericRecord';
import { defineComponent, PropType } from 'vue';
import DeepZoomViewer from '../viewers/deepzoom/DeepZoomViewer.vue';

export default defineComponent({
	name: 'RecordItem',
	components: {
		DeepZoomViewer,
	},
	props: {
		recordItemData: {
			type: Object as PropType<GenericRecord>,
			required: true,
		},
	},
});
</script>
