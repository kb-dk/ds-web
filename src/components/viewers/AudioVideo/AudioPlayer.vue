<template>
	<div class="audio-player-box">
		<div
			id="audio-player"
			class="player"
		></div>
	</div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, defineComponent, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { PlayerType, KalturaPlayerType } from '@/types/KalturaTypes';

// Third party script - global variable typing and declaring.
declare const KalturaPlayer: KalturaPlayerType;
export default defineComponent({
	name: 'AudioPlayer',
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
		let audioPlayer: PlayerType;
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
				audioPlayer = KalturaPlayer.setup({
					targetId: 'audio-player',
					provider: {
						partnerId: 380,
						uiConfId: 23454104,
					},
				});
				audioPlayer.loadMedia({ referenceId: props.fileId });
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
</style>
