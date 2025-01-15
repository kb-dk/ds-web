<template>
	<figure
		class="image-wrapper"
		:style="`background: ${background}; aspect-ratio: ${aspectRatio}`"
	>
		<img
			ref="image-item"
			draggable="false"
			loading="lazy"
			:class="`image-item ${loaded ? 'loaded' : ''}`"
			:src="thumbSrc"
			:style="imgStyle"
			:alt="altText"
			:title="title"
			@load="loaded = true"
		/>
		<span
			class="type-symbol material-icons"
			:style="`color: ${iconColor}`"
		>
			{{ icon }}
		</span>
	</figure>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { ImageComponentType } from '@/types/ImageComponentType';

export default defineComponent({
	name: 'ImageComponent',
	props: {
		imageData: {
			type: Object as PropType<string>,
			required: true,
		},
	},
	setup(props) {
		const loaded = ref(false);
		const thumbSrc = ref();
		const objectPosition = ref();
		const objectFit = ref();
		const altText = ref();
		const title = ref();
		const icon = ref();
		const iconColor = ref();
		const aspectRatio = ref();
		const background = `linear-gradient(${Math.round(Math.random() * 360)}deg, #caf0fe, #002e70)`;
		const imgStyle = () => {
			return {
				backgroundColor: 'rgb(237,237,237)',
				objectPosition: objectPosition.value,
				objectFit: objectFit.value,
			};
		};
		watch(
			() => props.imageData,
			(newVal: string) => {
				const imageData = JSON.parse(newVal) as ImageComponentType;
				if (imageData.imgSrc) {
					thumbSrc.value = imageData.imgSrc;
				}
				if (imageData.placeholder) {
					thumbSrc.value = imageData.placeholder;
				}
				objectPosition.value = imageData.objectPos;
				objectFit.value = imageData.imgOption;
				altText.value = imageData.altText;
				title.value = imageData.title;
				icon.value = imageData.icon;
				iconColor.value = imageData.iconColor;
				aspectRatio.value = imageData.aspect;
			},
		);
		return {
			background,
			objectPosition,
			objectFit,
			altText,
			title,
			icon,
			iconColor,
			aspectRatio,
			thumbSrc,
			imgStyle,
			loaded,
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
	font-size: 64px !important;
	position: absolute !important;
	left: 50% !important;
	top: 50% !important;
	transform: translate(-50%, -50%);
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
