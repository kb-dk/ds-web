<template>
	<div class="video-player-box">
		<div
			id="video-player"
			class="player"
		></div>
	</div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, defineComponent, inject, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { PlayerType, KalturaPlayerType } from '@/types/KalturaTypes';
import { useAuthStore } from '@/store/authStore';

// Third party script - global variable typing and declaring.
declare const KalturaPlayer: KalturaPlayerType;

export default defineComponent({
	name: 'VideoPlayer',
	components: {},
	props: {
		entryId: {
			type: String,
			default() {
				return '';
			},
		},
	},

	setup(props) {
		const { t } = useI18n();
		const errorManager = inject('errorManager') as ErrorManagerType;
		let videoPlayer: PlayerType;
		const route = useRoute();
		const authStore = useAuthStore();

		const handleErrorDispatch = (type: string) => {
			switch (type) {
				case 'loadMedia': {
					errorManager.submitCustomError('player-error', t('error.players.video.fileInit'));
					break;
				}
				case 'loadScript': {
					errorManager.submitCustomError('player-error', t('error.players.video.playerInit'));
					break;
				}
				default: {
					errorManager.submitCustomError('player-error', t('error.players.video.generic'));
				}
			}
		};

		const appendScript = () => {
			let kalturaScript = document.createElement('script');
			kalturaScript.setAttribute(
				'src',
				authStore.streamingBaseUrlVideo !== ''
					? authStore.streamingBaseUrlVideo
					: import.meta.env.VITE_KALTURA_BASE_URL_VIDEO,
			);
			kalturaScript.setAttribute('id', 'kaltura-script');
			kalturaScript.setAttribute('type', 'application/javascript');
			kalturaScript.id = 'kaltura-player-script';
			kalturaScript.onload = () => {
				bootstrapPlayer();
			};
			kalturaScript.onerror = () => {
				handleErrorDispatch('loadScript');
			};
			document.head.appendChild(kalturaScript);
		};

		const bootstrapPlayer = () => {
			try {
				videoPlayer = KalturaPlayer.setup({
					targetId: 'video-player',
					provider: {
						partnerId: authStore.partnerId !== '' ? authStore.partnerId : import.meta.env.VITE_KALTURA_PARTNER_ID,
						uiConfId:
							authStore.videoUiConfId !== '' ? authStore.videoUiConfId : import.meta.env.VITE_KALTURA_VIDEO_UI_CONF_ID,
					},
				});
				videoPlayer.loadMedia({ entryId: props.entryId });
				videoPlayer.ready().then(() => {
					if (route.query?.startAt) {
						videoPlayer.currentTime = Number(route.query.startAt);
					}
					if (route.query?.autoplay) {
						videoPlayer.play();
					}
				});
			} catch (e) {
				handleErrorDispatch('');
			}
		};

		onMounted(() => {
			if (authStore.kalturaIdFetchExecuted === false) {
				watch(
					() => authStore.kalturaIdFetchExecuted as boolean,
					(newVal: boolean) => {
						if (newVal === true) {
							setupPlayer();
							console.log(authStore.streamingBaseUrlVideo);
						}
					},
				);
			} else {
				setupPlayer();
			}

			watch(
				() => route.query.startAt as string,
				(newStartAt: string, prevStartAt: string) => {
					if (newStartAt !== prevStartAt) {
						if (videoPlayer) {
							videoPlayer.currentTime = Number(route.query.startAt);
							videoPlayer.play();
						}
					}
				},
			);
		});

		const setupPlayer = () => {
			const no_script = !document.getElementById('kaltura-player-script');
			if (no_script) {
				appendScript();
			} else {
				bootstrapPlayer();
			}
		};

		onBeforeUnmount(() => {
			if (KalturaPlayer) {
				videoPlayer.destroy();
			}
		});
	},
});
</script>

<style scoped>
.player {
	aspect-ratio: 4/2;
	width: 100%;
	height: auto;
}
.video-player-box {
	background-color: black;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-left: 0px;
	overflow-y: hidden;
	background-color: #caf0fe;
}

.edge {
	height: 31px;
}

@media (min-width: 640px) {
	.video-player-box {
		margin-left: -36px;
		width: 100vw;
		max-width: calc(100% + 36px * 2);
	}
}

@media (min-width: 990px) {
	.video-player-box {
		width: 100%;
		margin-left: 0px;
		max-width: 100%;
		padding: 0px;
	}
}
</style>
