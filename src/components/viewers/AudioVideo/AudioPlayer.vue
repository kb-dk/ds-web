<template>
	<div class="audio-player-box">
		<div
			id="audio-player"
			class="player"
		></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeUnmount, onMounted, watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { KalturaPlayerType, PlayerType } from '@/types/KalturaTypes';
import { useAuthStore } from '@/store/authStore';
import { useRoute } from 'vue-router';
import { Priority, Severity } from '@/types/NotificationType';
import boogie from '@/assets/images/audio-thumbnails/boogie.jpg';
import initial from '@/assets/images/audio-thumbnails/default.jpg';
import mama from '@/assets/images/audio-thumbnails/mama.jpg';
import p1 from '@/assets/images/audio-thumbnails/p1.jpg';
import p2 from '@/assets/images/audio-thumbnails/p2.jpg';
import p3 from '@/assets/images/audio-thumbnails/p3.jpg';
import p4 from '@/assets/images/audio-thumbnails/p4.jpg';
import p5 from '@/assets/images/audio-thumbnails/p5.jpg';
import p6 from '@/assets/images/audio-thumbnails/p6.jpg';
import p7 from '@/assets/images/audio-thumbnails/p7.jpg';
import p8 from '@/assets/images/audio-thumbnails/p8.jpg';
import p5000 from '@/assets/images/audio-thumbnails/p5000.jpg';
import ramasjang from '@/assets/images/audio-thumbnails/ramasjang.jpg';

// Third party script - global variable typing and declaring.
declare const KalturaPlayer: KalturaPlayerType;

interface KalturaErrorEvent {
	payload: {
		code: number;
		message: string;
	};
}

export default defineComponent({
	name: 'AudioPlayer',
	props: {
		entryId: {
			type: String,
			default() {
				return '';
			},
		},
		channel: {
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
		const restrictedErrorDispatched = ref(false);

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

		const getThumbnailPicture = (channel: string) => {
			channel = channel.toLowerCase();
			switch (true) {
				case channel.includes('p5000'):
					return p5000;

				case channel.includes('mama'):
					return mama;

				case channel.includes('boogie'):
					return boogie;

				case channel.includes('ramasjang'):
					return ramasjang;

				case channel.includes('p1'):
					return p1;

				case channel.includes('p2'):
					return p2;

				case channel.includes('p3'):
					return p3;

				case channel.includes('p4'):
					return p4;

				case channel.includes('p5'):
					return p5;

				case channel.includes('p6'):
					return p6;

				case channel.includes('p7'):
					return p7;

				case channel.includes('p8'):
					return p8;

				default:
					return initial;
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
					sources: {
						poster: getThumbnailPicture(props.channel),
					},
				});
				audioPlayer.loadMedia({ entryId: props.entryId }).then(() => {
					document
						.querySelector('.playkit-pre-playback-play-button')
						?.setAttribute('data-testid', 'player-kaltura-playbutton-0');
					const audio = document.querySelector('#audio-player') as HTMLElement | null;
					if (audio) {
						const innerAudio = audio?.querySelector('video') as HTMLVideoElement | null;
						if (innerAudio) innerAudio.disablePictureInPicture = true;
					}
					audio ? audio.setAttribute('data-testid', 'audio-player-kaltura-container-0') : null;
				});
				audioPlayer.addEventListener(audioPlayer.Event.ERROR, (e: KalturaErrorEvent) => {
					const error = e.payload;
					if (error.code === 1002 && !restrictedErrorDispatched.value) {
						restrictedErrorDispatched.value = true;
						errorManager.submitCustomError(
							'player-error',
							t('error.title'),
							`${t('error.record.restricted')}\n\n${t('error.record.restrictedExplained')}`,
							Severity.INFO,
							true,
							Priority.MEDIUM,
						);
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
			const script = document.getElementById('kaltura-player-script');
			if (script) {
				script.parentNode?.removeChild(script);
			}
			appendScript();
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
	aspect-ratio: 4 / 1;
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
		aspect-ratio: 4/1;
	}

	.audio-player-box {
		margin-left: -36px;
		width: 100vw;
		max-width: calc(100% + 36px * 2);
	}
}

@media (min-width: 769px) {
	.player {
		aspect-ratio: 4 / 1;
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
