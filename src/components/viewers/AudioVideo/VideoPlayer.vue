<template>
	 	<div class="mobile-edge edge top"></div>
	<div class="video-player">
	<div id="k-player" class="player" style="width: 1230px;height: 536px"></div>
	</div>
	 	<div class="mobile-edge edge bottom"></div>
</template>

<script lang="ts">
import {onMounted, onBeforeUnmount, defineComponent} from 'vue';
 
//Unfortunately no typing in third party script.
declare const KalturaPlayer: any;

export default defineComponent({
	name: 'VideoPlayer',
	components: {},
	props: {
		videoUrl: String,
		fileId: String
	},
	setup(props) {
		const bootstrapPlayer = () =>{
			try {
                      let kalturaPlayer = KalturaPlayer.setup({
                        targetId: "k-player",
                        provider: {
                          partnerId: 380,
                          uiConfId: 23454104
                        },
												
                      });
							       kalturaPlayer.loadMedia({referenceId: props.fileId});
                    } catch (e) {
											const errMsg = (e as Error).message;
											console.error(errMsg)
					          }
 		}

		const appendScript = () => {
			let kalturaScript = document.createElement('script')
      kalturaScript.setAttribute('src', import.meta.env.VITE_KALTURA_BASE_URL)
      kalturaScript.setAttribute('id', 'kaltura-script')
			kalturaScript.setAttribute('type', 'application/javascript')
			kalturaScript.id = "kaltura-player-script";
			kalturaScript.onload = () => {
				bootstrapPlayer()
        };
			document.head.appendChild(kalturaScript)
		}

		onMounted(() => {
			const no_script = !document.getElementById("kaltura-player-script")
			if (no_script) {
				appendScript()
			} else {
				bootstrapPlayer()
			};
		});
		
		onBeforeUnmount(() => {
			if (KalturaPlayer) {
				KalturaPlayer.destroy()
			}
		});
		
	},
});
</script>

<style scoped>
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
