<template>
	<div
		class="kaltura-player"
		ref="kalturaPlayer"
		id="kalturaPlayer"
	></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { loadScriptAsync } from '@/utils/load-script-async';
import { KalturaVideoBaseConfig } from '@/components/viewers/AudioVideo/video/conf/kaltura-video-base-conf';
import { KalturaProviderConf } from '@/components/viewers/AudioVideo/video/conf/kaltura-video-provider-conf';

export default defineComponent({
	name: 'KalturaVideoPlayer',
	props: {
		videoUrl: String,
	},
	setup(props) {
		const kalturaPlayer = ref<HTMLElement | null>(null);
		const runtimeConfig = {
			targetId: '',
			provider: KalturaProviderConf,
			sources: {
				progressive: [
					{
						mimetype: 'video/mp4',
						url: props.videoUrl,
					},
				],
			},
		};

		onMounted(() => {
			loadScriptAsync('../kaltura-tv-player.js')
				.then(() => {
					if (kalturaPlayer.value && props.videoUrl) {
						runtimeConfig.targetId = kalturaPlayer.value.id;
						const playerConfig = Object.assign(runtimeConfig, KalturaVideoBaseConfig);
						// TODO The two es-lint disable here are due to missing Kaltura types...
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const videoPlayer = (window as any).KalturaPlayer;
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						videoPlayer.setup(playerConfig);
					}
				})
				.catch((error) => {
					console.error('Error loading video player', error);
				});
		});

		return {
			kalturaPlayer,
		};
	},
});
</script>

<style scoped>
.kaltura-player {
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
	.kaltura-player {
		margin-left: -36px;
		width: 100vw;
		max-width: calc(100% + 36px * 2);
	}
}

@media (min-width: 990px) {
	.kaltura-player {
		width: 100%;
		margin-left: 0px;
		max-width: 100%;
	}
}
</style>
