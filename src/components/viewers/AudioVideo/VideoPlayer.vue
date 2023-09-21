<template>
	<div class="video-player">
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
.video-player {
	background-color: black;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	aspect-ratio: 4/2;
	margin-left: 0px;
	overflow-y: hidden;
}

@media (min-width: 640px) {
	.video-player {
		margin-left: -36px;
		width: 100vw;
		max-width: calc(100% + 36px * 2);
	}
}

@media (min-width: 990px) {
	.video-player {
		width: 100%;
		margin-left: 0px;
		max-width: 100%;
	}
}

.vjs-custom {
	height: 100%;
	/* width: 1200px;
	height: 440px;
	margin: 0 4% 0 5%; */
}
</style>
