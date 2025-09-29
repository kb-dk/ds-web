<template>
	<div :class="{ 'slider-container': displaySliderArrows }">
		<div
			v-if="displaySliderArrows && scrollLeft >= 25"
			class="direction-arrow left"
			@click="moveSlider(-250)"
		>
			<div class="direction-arrow-inner">
				<span class="material-icons">arrow_back_ios</span>
			</div>
		</div>
		<div
			ref="itemSliderRef"
			:class="setSliderClasses()"
		>
			<slot :disable-links="move"></slot>
		</div>
		<div
			v-if="displaySliderArrows && scrollLeft <= maxScrollWidth - 25"
			class="direction-arrow right"
			@click="moveSlider(250)"
		>
			<div class="direction-arrow-inner"><span class="material-icons">arrow_forward_ios</span></div>
		</div>
	</div>
</template>

<script lang="ts">
import { ComponentPublicInstance, computed, onUnmounted, PropType, watch } from 'vue';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
	name: 'ItemSlider',
	props: {
		itemClass: { type: String, required: true },
		bg: { type: String, default: 'white' },
		bgScrollWhite: { type: String, default: '' },
		padding: { type: Boolean, default: false },
		displaySliderArrows: { type: Boolean, default: false },
		visible: { type: Boolean, required: false },
		currentElement: { type: Array<ComponentPublicInstance<HTMLElement> | null>, required: false, default: null },
	},
	emits: ['upscaleSmallElements'],
	setup(props) {
		const itemSliderRef = ref<HTMLElement | null>(null);
		const isDown = ref(false);
		const startX = ref(0);
		const scrollLeft = ref(0);
		const move = ref(false);
		const maxScrollWidth = ref(0);
		onMounted(() => {
			if (itemSliderRef.value) {
				itemSliderRef.value.addEventListener('mousedown', startAndCalculateOffset);
				itemSliderRef.value.addEventListener('mouseleave', stopMovementOnParent);
				itemSliderRef.value.addEventListener('mouseup', stopMovementOnParent);
				itemSliderRef.value.addEventListener('mousemove', calculateMovement);
				// itemSliderRef.value.addEventListener('scroll', updateSrollLeft);
				itemSliderRef.value.style.backgroundColor = props.bg;
			}
		});

		onUnmounted(() => {
			if (itemSliderRef.value) {
				itemSliderRef.value.removeEventListener('mousedown', startAndCalculateOffset);
				itemSliderRef.value.removeEventListener('mouseleave', stopMovementOnParent);
				itemSliderRef.value.removeEventListener('mouseup', stopMovementOnParent);
				itemSliderRef.value.removeEventListener('mousemove', calculateMovement);
				// itemSliderRef.value.removeEventListener('scroll', updateSrollLeft);
			}
		});

		const startAndCalculateOffset = (e: MouseEvent) => {
			if (itemSliderRef.value) {
				isDown.value = true;
				startX.value = e.pageX - itemSliderRef.value.offsetLeft;
				scrollLeft.value = itemSliderRef.value.scrollLeft;
			}
		};
		const stopMovementOnParent = () => {
			move.value = false;

			if (itemSliderRef.value) {
				isDown.value = false;
				scrollLeft.value = itemSliderRef.value.scrollLeft;
			}
		};
		const calculateMovement = (e: MouseEvent) => {
			if (itemSliderRef.value) {
				if (!isDown.value) {
					return;
				}
				move.value = true;
				e.preventDefault();
				const x = e.pageX - itemSliderRef.value.offsetLeft;
				itemSliderRef.value.scrollLeft = scrollLeft.value - (x - startX.value);
			}
		};

		const setSliderClasses = () => {
			let activeClasses = 'item-slider';
			if (move.value) {
				activeClasses += ' active';
			}
			if (props.bgScrollWhite) {
				activeClasses += ' white-scrollbar';
			}
			if (props.padding) {
				activeClasses += ' padding';
			}
			if (props.displaySliderArrows) {
				activeClasses += ' arrow-slider';
			}

			return activeClasses;
		};

		const moveSlider = (moveBy: number) => {
			if (scrollLeft.value + moveBy < 0) {
				scrollLeft.value = 0;
			} else if (scrollLeft.value + moveBy > maxScrollWidth.value) {
				scrollLeft.value = maxScrollWidth.value;
			} else {
				scrollLeft.value += moveBy;
			}
			if (itemSliderRef.value && props.displaySliderArrows) {
				itemSliderRef.value.scrollTo({ behavior: 'smooth', left: scrollLeft.value });
			}
		};
		watch(
			() => props.visible,
			() => {
				if (itemSliderRef.value && props.displaySliderArrows) {
					maxScrollWidth.value = itemSliderRef.value.scrollWidth - itemSliderRef.value?.offsetWidth;
					if (props.currentElement[0]) {
						props.currentElement[0].$el.scrollIntoView({
							behavior: 'smooth',
							block: 'nearest',
							inline: 'center',
							top: 0,
						});
					}
				}
			},
		);
		return { itemSliderRef, move, setSliderClasses, moveSlider, maxScrollWidth, scrollLeft };
	},
});
</script>
<style scoped>
.slider-container {
	z-index: 0;
	overflow-x: auto;
	position: relative;
	overflow: hidden;
	display: flex;
	justify-content: flex-start;
}
.item-slider {
	position: relative;
	overflow: hidden;
	display: flex;
	justify-content: flex-start;
	height: 0px;
	align-items: center;
	overflow-x: auto;
	gap: 15px;
	width: 100%;
	height: 100%;
	transition: all 0.3s linear 0s;
	padding-bottom: 15px;
	box-sizing: border-box;
	scale: '1.0';
}

.item-slider.padding {
	padding-left: 15px;
	padding-right: 15px;
}

.item-slider.white-scrollbar::-webkit-scrollbar-track {
	background-color: #ffffff00;
}

.item-slider.white-scrollbar::-webkit-scrollbar-thumb {
	background-color: rgb(66, 66, 66);
}
.arrow-slider.item-slider.white-scrollbar::-webkit-scrollbar-thumb {
	border-radius: 5px;
}
.item-slider::-webkit-scrollbar-track {
	background-color: #002e70;
}

.item-slider.active a {
	pointer-events: none;
}
.item-slider::-webkit-scrollbar {
	height: 18px;
}
.arrow-slider.item-slider.white-scrollbar::-webkit-scrollbar {
	height: 10px;
}
.item-slider::-webkit-scrollbar-thumb {
	background-color: rgb(255, 255, 255);
}
.arrow-slider {
	flex-direction: column;
	align-items: flex-start;
	gap: 0px;
}
.direction-arrow {
	position: absolute;
	height: 48px;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
	width: 48px;
	color: rgba(0, 0, 0, 0.719);
	display: flex;
	opacity: 0;
	align-items: center;
	z-index: 10;
	background-color: rgb(255, 255, 255);
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
	cursor: pointer;
	pointer-events: none;
	top: 45px;
	border-radius: 30px;
}
.direction-arrow.right {
	right: 0px;
	justify-content: center;
}
.direction-arrow.left {
	left: 0px;
	justify-content: center;
}
.direction-arrow-inner {
	height: 40px;
	width: 40px;
	border-radius: 30px;
	background-color: #002e70;
	justify-content: center;
	align-items: center;
	color: white;
	display: flex;
	text-align: center;
}
.direction-arrow.left > .direction-arrow-inner > .material-icons {
	margin-left: 5px;
}

@media (min-width: 990px) {
	.direction-arrow {
		opacity: 1;
		pointer-events: all;
	}
}
</style>
