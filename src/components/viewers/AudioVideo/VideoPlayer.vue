<template>
	<div>
		<video
			ref="videoElement"
			class="video-js vjs-default-skin vjs-custom"
			controls
		>
			<source
				:src="videoSrc"
				type="video/mp4"
			/>
		</video>
	</div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default defineComponent({
	name: 'VideoPlayer',
	components: {},

	setup() {
		const videoElement = ref(null);
		//harcoded for now
		const videoSrc = ref('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

		onMounted(() => {
			const options = {
				autoplay: false,
				controls: true,
			};

			//Mount player
			const player = videojs(videoElement.value, options);

			// Clean up
			const cleanup = () => {
				if (player) {
					player.dispose();
				}
			};

			// Attach cleanup to unmmount
			onBeforeUnmount(() => {
				cleanup();
			});
		});
		return { videoSrc, videoElement };
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.vjs-custom {
	width: 1200px;
	height: 440px;
	margin: 0 4% 0 5%;
}
</style>
