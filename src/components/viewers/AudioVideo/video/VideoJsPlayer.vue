<template>
	<div class="mobile-edge edge top"></div>
	<div class="video-player">
		<video
			ref="videoElement"
			class="video-js vjs-default-skin vjs-custom"
		></video>
	</div>
	<div class="mobile-edge edge bottom"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default defineComponent({
	name: 'VideoPlayer',
	components: {},
	props: {
		videoUrl: String,
	},
	setup(props) {
		const videoElement = ref(null);
		//const videoSrc = ref('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
		onMounted(() => {
			const options = {
				autoplay: false,
				controls: true,
			};
			//Mount player with options and src
			const player = videojs(videoElement.value, options);
			player.src({ type: 'application/x-mpegURL', src: props.videoUrl });

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
		return { videoElement };
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
	padding-top: 31px;
	padding-bottom: 31px;
	background-color: #caf0fe;
}

.edge {
	height: 31px;
}

.mobile-edge {
	width: 100%;
	position: absolute;
	background-color: white;
	clip-path: polygon(100% 0, 0 0, 0 100%);
	z-index: 3;
	left: 0px;
}

.top {
	clip-path: polygon(100% 0, 0 0, 0 100%);
}

.bottom {
	clip-path: polygon(100% 0, 100% 100%, 0 100%);
	margin-top: -30px;
}

@media (min-width: 640px) {
	.video-player {
		margin-left: -36px;
		width: 100vw;
		max-width: calc(100% + 36px * 2);
	}
}

@media (min-width: 990px) {
	.mobile-edge {
		display: none;
	}
	.video-player {
		width: 100%;
		margin-left: 0px;
		max-width: 100%;
		padding: 0px;
	}
}

.vjs-custom {
	height: 100%;
	width: 100%;
}
</style>
