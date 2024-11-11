<template>
	<div class="audio-player-box">
		<div class="not-allowed">
			<div
				id="audio-player"
				class="player"
			></div>
		</div>
	</div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, defineComponent, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { PlayerType, KalturaPlayerType } from '@/types/KalturaTypes';
import { useAuthStore } from '@/store/authStore';
import { useRoute } from 'vue-router';

// Third party script - global variable typing and declaring.
declare const KalturaPlayer: KalturaPlayerType;
export default defineComponent({
	name: 'AudioPlayer',
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
		let audioPlayer: PlayerType;
		const route = useRoute();
		const authStore = useAuthStore();

		const handleErrorDispatch = (type: string) => {
			switch (type) {
				case 'loadMedia': {
					errorManager.submitCustomError('player-error', t('error.players.audio.fileInit'));
					break;
				}
				case 'loadScript': {
					errorManager.submitCustomError('player-error', t('error.players.audio.playerInit'));
					break;
				}
				default: {
					errorManager.submitCustomError('player-error', t('error.players.audio.generic'));
				}
			}
		};
		const appendScript = () => {
			let kalturaScript = document.createElement('script');
			kalturaScript.setAttribute(
				'src',
				authStore.streamingBaseUrlAudio !== ''
					? authStore.streamingBaseUrlAudio
					: import.meta.env.VITE_KALTURA_BASE_URL_AUDIO,
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
				audioPlayer = KalturaPlayer.setup({
					targetId: 'audio-player',
					playback: {
						autoplay: route.query?.autoplay ? true : false,
					},
					provider: {
						partnerId: authStore.partnerId !== '' ? authStore.partnerId : import.meta.env.VITE_KALTURA_PARTNER_ID,
						uiConfId:
							authStore.audioUiConfId !== '' ? authStore.audioUiConfId : import.meta.env.VITE_KALTURA_AUDIO_UI_CONF_ID,
					},
				});
				audioPlayer.loadMedia({ entryId: props.entryId }).then(() => {
					document
						.querySelector('.playkit-pre-playback-play-button')
						?.setAttribute('data-testid', 'player-kaltura-playbutton-0');
				});
				document.querySelector('#audio-player')?.setAttribute('data-testid', 'audio-player-kaltura-container-0');
				audioPlayer.ready().then(() => {
					audioPlayer.currentTime = route.query.startAt ? Number(route.query.startAt) : 0;
				});
			} catch (e) {
				handleErrorDispatch('');
			}
		};
		onMounted(() => {
			const no_script = !document.getElementById('kaltura-player-script');
			if (no_script) {
				appendScript();
			} else {
				bootstrapPlayer();
			}
		});
		onBeforeUnmount(() => {
			if (KalturaPlayer) {
				audioPlayer.destroy();
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
	z-index: -2;
	background-color: rgba(244, 182, 100, 0.3) !important;
}

.audio-player-box {
	background-color: black;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-left: 0px;
	overflow-y: hidden;
	padding-top: 31px;
	padding-bottom: 31px;
	background-color: white;
}

.edge {
	height: 31px;
}

@media (min-width: 640px) {
	.audio-player-box {
		margin-left: -36px;
		width: 100vw;
		max-width: calc(100% + 36px * 2);
	}
}

@media (min-width: 990px) {
	.audio-player-box {
		width: 100%;
		margin-left: 0px;
		max-width: 100%;
		padding: 0px;
	}
}
.not-allowed {
	background-color: rgba(244, 182, 100, 0.3) !important;
	width: 100%;
	height: 100%;
	z-index: 90;
}
</style>
