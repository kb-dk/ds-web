<template>
	<div class="video-player-box">
		<div
			id="video-player"
			class="player"
		></div>
		<NotAllowedBanner></NotAllowedBanner>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeUnmount, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { KalturaPlayerType, PlayerType } from '@/types/KalturaTypes';
import { useAuthStore } from '@/store/authStore';
import NotAllowedBanner from '@/components/global/content-elements/NotAllowedBanner.vue';
import { Priority, Severity } from '@/types/NotificationType';

// Third party script - global variable typing and declaring.
declare const KalturaPlayer: KalturaPlayerType;

export default defineComponent({
	name: 'VideoPlayer',
	components: { NotAllowedBanner },
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
					errorManager.submitCustomError(
						'player-error',
						t('error.title'),
						t('error.players.video.fileInit'),
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
						t('error.players.video.playerInit'),
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
						t('error.players.video.generic'),
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
					playback: {
						autoplay: route.query?.autoplay ? true : false,
					},
					provider: {
						partnerId: authStore.partnerId !== '' ? authStore.partnerId : import.meta.env.VITE_KALTURA_PARTNER_ID,
						uiConfId:
							authStore.videoUiConfId !== '' ? authStore.videoUiConfId : import.meta.env.VITE_KALTURA_VIDEO_UI_CONF_ID,
					},
				});
				videoPlayer.loadMedia({ entryId: props.entryId }).then(() => {
					document
						.querySelector('.playkit-pre-playback-play-button')
						?.setAttribute('data-testid', 'player-kaltura-playbutton-0');
				});
				document.querySelector('#video-player')?.setAttribute('data-testid', 'video-player-kaltura-container-0');
				videoPlayer.ready().then(() => {
					videoPlayer.currentTime = route.query.startAt ? Number(route.query.startAt) : 0;
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

		watch(
			() => props.entryId,
			() => {
				if (KalturaPlayer) {
					videoPlayer.destroy();
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
	padding-top: 31px;
	padding-bottom: 31px;
	background-color: white;
	position: relative;
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
