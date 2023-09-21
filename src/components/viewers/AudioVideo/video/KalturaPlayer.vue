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
	width: 100%;
	height: 400px;
}
</style>
