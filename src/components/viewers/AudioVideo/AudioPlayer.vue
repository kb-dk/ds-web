<template>
	<div class="audio-player-box">
		<div
			id="audio-player"
			class="player"
		></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeUnmount, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { KalturaPlayerType, PlayerType } from '@/types/KalturaTypes';
import { useAuthStore } from '@/store/authStore';
import { useRoute } from 'vue-router';
import { Priority, Severity } from '@/types/NotificationType';

// Third party script - global variable typing and declaring.
declare const KalturaPlayer: KalturaPlayerType;
export default defineComponent({
	name: 'AudioPlayer',
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
					errorManager.submitCustomError(
						'player-error',
						t('error.title'),
						t('error.players.audio.fileInit'),
						Severity.ERROR,
						true,
						Priority.MEDIUM,
					);
					break;
				}
				case 'loadScript': {
					errorManager.submitCustomError(
						'player-error',
						t('error.title'),
						t('error.players.audio.playerInit'),
						Severity.ERROR,
						true,
						Priority.MEDIUM,
					);
					break;
				}
				default: {
					errorManager.submitCustomError(
						'player-error',
						t('error.title'),
						t('error.players.audio.generic'),
						Severity.ERROR,
						true,
						Priority.MEDIUM,
					);
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
						}
					},
				);
			} else {
				setupPlayer();
			}
		});

		watch(
			() => route.params.id,
			() => {
				if (KalturaPlayer) {
					audioPlayer.destroy();
				}
				setupPlayer();
			},
		);

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
				audioPlayer.destroy();
			}
		});
	},
});
</script>

<style scoped>
.player {
	aspect-ratio: 4 / 2.4;
	width: 100%;
	height: auto;
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
	position: relative;
}

.edge {
	height: 31px;
}

@media (min-width: 640px) {
	.player {
		aspect-ratio: 4/2;
	}

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
</style>
