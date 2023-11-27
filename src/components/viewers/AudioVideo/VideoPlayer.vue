<template>
	<div class="mobile-edge edge top"></div>
	<div
		class="video-player"
		v-if="src"
	>
		<media-player
			class="player"
			title=""
			:src="src"
			ref="player"
		>
			<media-provider></media-provider>
			<media-video-layout></media-video-layout>
		</media-player>
	</div>
	<div class="mobile-edge edge bottom"></div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import type { MediaPlayerElement } from 'vidstack/elements';

import 'vidstack/player';
import 'vidstack/player/layouts';
import 'vidstack/player/ui';

export default defineComponent({
	name: 'VideoPlayer',
	components: {},
	props: {
		videoUrl: String,
	},
	setup(props) {
		const player = ref<MediaPlayerElement>();
		const src = ref('');
		onMounted(() => {
			src.value = props.videoUrl ? props.videoUrl : '';
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

<style scoped>
@import 'vidstack/player/styles/default/theme.css';
@import 'vidstack/player/styles/default/layouts/video.css';

.player {
	aspect-ratio: 4/2;
}
.video-player {
	background-color: black;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	/*aspect-ratio disabled - messes with the controls but now player is too high...*/
	/*aspect-ratio: 4/2;*/
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
</style>
