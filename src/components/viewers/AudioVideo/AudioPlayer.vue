<template>
	<media-player
		class="player"
		title=""
		:src="src"
		ref="player"
		view-type="audio"
	>
		<media-provider></media-provider>
	</media-player>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import type { MediaPlayerElement } from 'vidstack/elements';

import 'vidstack/player/styles/base.css';

import 'vidstack/player';

export default defineComponent({
	name: 'AudioPlayer',
	components: {},
	props: {
		audioUrl: String,
	},
	setup(props) {
		const player = ref<MediaPlayerElement>();
		const src = ref('');
		onMounted(() => {
			src.value = props.audioUrl ? props.audioUrl : '';
			// Clean up
			const cleanup = () => {
				if (player.value) {
					player.value.destroy();
				}
			};

			// Attach cleanup to unmmount
			onBeforeUnmount(() => {
				cleanup();
			});
		});
		return { src, player };
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.player {
	display: block;
}
</style>
