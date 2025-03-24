<template>
	<div class="sound-thumbnail-container">
		<div class="thumb">
			<img
				:src="getImgServerSrcURL()"
				title="Thumbnail for audio results"
				:alt="`Image of soundwaves for ${resultTitle}`"
			/>
		</div>
		<span
			role="img"
			:aria-label="t('app.a11y.soundIcon')"
			class="material-icons play"
			aria-hidden="true"
		>
			play_circle_filled
		</span>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'SoundThumbnail',
	props: {
		resultTitle: { type: String as PropType<string>, required: true },
	},
	setup() {
		const { t } = useI18n();

		const getImgServerSrcURL = () => {
			return new URL(`@/assets/images/soundwave.svg`, import.meta.url).href;
		};
		return { getImgServerSrcURL, t };
	},
});
</script>

<style scoped>
.sound-thumbnail-container {
	position: relative;
	width: 100%;
	height: 100%;
	background: linear-gradient(139deg, rgba(232, 232, 232, 1) 4%, rgba(217, 217, 217, 1) 100%);
}
.thumb {
	position: relative;
	width: 100%;
	display: flex;
	align-items: center;
	align-content: center;
	flex-direction: row;
	flex-wrap: nowrap;
	height: 100%;
	gap: 1px;
	justify-content: center;
	box-sizing: border-box;
	overflow: hidden;
}

.play {
	font-size: 64px !important;
	color: white;
	transform: translate(-50%, -50%);
	position: absolute;
	top: 50%;
	left: 50%;
}

.line {
	border-radius: 25px;
	background: #002e70;
	width: 1px;
}

.thumb:after {
	content: '';
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0px;
	left: 0px;
	opacity: 0.4;
	mix-blend-mode: hard-light;
	background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(0, 46, 112, 0.5) 50%, rgba(255, 255, 255, 0) 100%);
}
</style>
