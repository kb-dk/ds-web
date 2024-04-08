<template>
	<div class="mobile-edge edge top"></div>
	<div class="video-player-box">
		<div
			id="video-player"
			class="player"
		></div>
	</div>
	<div class="mobile-edge edge bottom"></div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, defineComponent, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import { ErrorManagerType } from '@/types/ErrorManagerType';
import { PlayerType, KalturaPlayerType } from '@/types/KalturaTypes';

// Third party script - global variable typing and declaring.
declare const KalturaPlayer: KalturaPlayerType;

export default defineComponent({
	name: 'VideoPlayer',
	components: {},
	props: {
		fileId: {
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
			kalturaScript.setAttribute('src', import.meta.env.VITE_KALTURA_BASE_URL);
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
						partnerId: 380,
						uiConfId: 23454104,
					},
				});
				videoPlayer.loadMedia({ referenceId: props.fileId });
			} catch (e) {
				handleErrorDispatch('');
				console.error(e);
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
	/*aspect-ratio disabled - messes with the controls but now player is too high...*/
	/*aspect-ratio: 4/2;*/
	margin-left: 0px;
	overflow-y: hidden;
	/* padding-top: 31px;
	padding-bottom: 31px; */
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
	.video-player-box {
		margin-left: -36px;
		width: 100vw;
		max-width: calc(100% + 36px * 2);
	}
}

@media (min-width: 990px) {
	.mobile-edge {
		display: none;
	}
	.video-player-box {
		width: 100%;
		margin-left: 0px;
		max-width: 100%;
		padding: 0px;
	}
}
</style>
