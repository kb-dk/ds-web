<template>
	<figure
		class="image-wrapper"
		:style="`background: rgb(60,60,60); aspect-ratio: ${data.aspect}`"
	>
		<img
			ref="image-item"
			draggable="false"
			loading="lazy"
			:class="`image-item ${loaded ? 'loaded' : ''}`"
			:src="data.imgSrc"
			:style="imgStyle()"
			:alt="data.altText"
			:title="data.title"
			@load="loaded = true"
		/>
		<span
			v-if="data.icon"
			role="img"
			:aria-label="`${data.icon} ${t('app.a11y.imageComponentTitle')}`"
			:class="data.iconLowerRight ? 'type-symbol material-icons lower-left' : 'type-symbol material-icons'"
			:style="`color: ${data.iconColor}`"
		>
			{{ data.icon }}
		</span>
	</figure>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { ImageComponentType } from '@/types/ImageComponentType';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'ImageComponent',
	props: {
		imageData: {
			type: String as PropType<string>,
			required: true,
			default() {
				return JSON.stringify({
					imgSrc: '',
					altText: '',
					imgTitle: '',
					placeholder: '',
					imgOption: '',
					objectPos: '',
					icon: '',
					iconColor: '',
					aspect: '',
					iconLowerRight: false,
				} as ImageComponentType);
			},
		},
	},
	setup(props) {
		const { t } = useI18n();
		const loaded = ref(false);
		const background = `linear-gradient(${Math.round(Math.random() * 360)}deg, #caf0fe, #002e70)`;
		const data = ref(JSON.parse(props.imageData) as ImageComponentType);
		const imgStyle = () => {
			return `background-color: 'rgb(237,237,237)'; object-position: ${data.value.objectPos}; object-fit: ${data.value.imgOption};`;
		};
		watch(
			() => props.imageData,
			(newVal) => {
				data.value = JSON.parse(newVal) as ImageComponentType;
			},
		);
		return {
			background,
			imgStyle,
			loaded,
			data,
			t,
		};
	},
});
</script>

<style scoped>
:host {
	--image-item-scale: 1;
	--image-item-hue-rotation: 0rad;
}
.material-icons {
	font-family: 'Material Icons';
	font-weight: normal;
	font-style: normal;
	font-size: 16px;
	line-height: 1;
	letter-spacing: normal;
	text-transform: none;
	display: inline-block;
	white-space: nowrap;
	word-wrap: normal;
	direction: ltr;
	-webkit-font-feature-settings: 'liga';
	-webkit-font-smoothing: antialiased;
}

.type-symbol {
	font-size: 58px;
	position: absolute !important;
	left: 50% !important;
	top: 50% !important;
	transform: translate(-50%, -50%);
	background: radial-gradient(circle, rgba(0, 46, 112, 1) 0%, rgba(0, 46, 112, 1) 50%, rgba(255, 255, 255, 0) 50%);
	border: 2px solid #002e70;
	height: 48px;
	width: 48px;
	border-radius: 90px;
	align-items: center;
	justify-content: center;
	display: flex;
}

.lower-left {
	font-size: 36px;
	bottom: -10px;
	right: -10px;
	top: initial !important;
	left: initial !important;
	height: 30px;
	width: 30px;
	display: flex;
}

.image-wrapper {
	position: relative;
	overflow: hidden;
	background: linear-gradient(45deg, #caf0fe, #002e70);
	width: 100%;
	height: 100%;
	padding: 0px;
	margin-block-start: 0em;
	margin-block-end: 0em;
	margin-inline-start: 0px;
	margin-inline-end: 0px;
	transition:
		opacity 0.3s ease-in-out 0s,
		filter 0.3s ease-in-out 0s,
		transform 0.3s ease-in-out 0s;
	filter: hue-rotate(var(--image-item-hue-rotation));
	animation: rotateGradient 2s linear infinite; /* Apply the animation */
}

.image-item {
	width: calc(100% + 1px);
	height: calc(100% + 1px);
	object-fit: cover;
	transition:
		opacity 0.3s ease-in-out 0s,
		filter 0.3s ease-in-out 0s,
		transform 0.3s ease-in-out 0s,
		all 0.3s ease-in-out 0s;
	opacity: 0;
	transform: scale3d(var(--image-item-scale), var(--image-item-scale), var(--image-item-scale));
	transform-origin: center;
	will-change: transform;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-o-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.loaded {
	opacity: 1;
}

@keyframes rotateGradient {
	from {
		background-position: 0% 0%;
	}
	to {
		background-position: 100% 100%;
	}
}
</style>
