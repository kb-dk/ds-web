<template>
	<div>
		<!--TODO: remember to create unique ID for Openseadragon element so component reuse doesn't mess up -->
		<div
			id="deepZoomViewer"
			ref="deepZoom"
			class="deep-zoom-viewer"
		></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
//import OpenSeadragon from 'openseadragon';

export default defineComponent({
	name: 'DeepZoomViewer',
	components: {},

	setup() {
		const deepZoom = ref<HTMLElement | null>(null);
		const options = {
			id: '',
			constrainDuringPan: true,
			//TODO replace with our own custom button icons
			prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
			//TODO: remember dynamic tilesource when data is ready
			tileSources: [
				'https://kb-images.kb.dk/online_master_arkiv_7/non-archival/Letters/judsam/2010/jan/dsa/eaa-ejc/dsa_eaa-ejc_0865/info.json',
			],
		};

		onMounted(() => {
			if (deepZoom.value !== null) {
				options.id = deepZoom.value.id;
				//OpenSeadragon(options);
			}
		});
		return { deepZoom };
	},
	data() {
		return {
			viewer: null,
			options: {
				id: '',
				prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
				constrainDuringPan: true,
				showNavigator: true,
			},
		};
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.deep-zoom-viewer {
	width: 800px;
	height: 600px;
	margin: auto;
}
</style>
