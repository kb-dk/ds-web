<template>
	<div
		ref="itemSliderRef"
		:class="move ? 'item-slider active' : 'item-slider'"
	>
		<slot :disable-links="move"></slot>
	</div>
</template>

<script lang="ts">
import { onUnmounted } from 'vue';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
	name: 'ItemSlider',
	props: {
		itemClass: { type: String, required: true },
		bg: { type: String, default: 'white' },
	},
	setup(props) {
		const itemSliderRef = ref<HTMLElement | null>(null);
		const isDown = ref(false);
		const startX = ref(0);
		const scrollLeft = ref(0);
		const move = ref(false);

		onMounted(() => {
			if (itemSliderRef.value) {
				itemSliderRef.value.addEventListener('mousedown', startAndCalculateOffset);
				itemSliderRef.value.addEventListener('mouseleave', stopMovementOnParent);
				itemSliderRef.value.addEventListener('mouseup', stopMovementOnParent);
				itemSliderRef.value.addEventListener('mousemove', calculateMovement);
				itemSliderRef.value.style.backgroundColor = props.bg;
			}
		});

		onUnmounted(() => {
			if (itemSliderRef.value) {
				itemSliderRef.value.removeEventListener('mousedown', startAndCalculateOffset);
				itemSliderRef.value.removeEventListener('mouseleave', stopMovementOnParent);
				itemSliderRef.value.removeEventListener('mouseup', stopMovementOnParent);
				itemSliderRef.value.removeEventListener('mousemove', calculateMovement);
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

		return { itemSliderRef, move };
	},
});
</script>
<style>
.item-slider {
	position: relative;
	overflow: hidden;
	display: flex;
	justify-content: space-evenly;
	height: 0px;
	align-items: center;
	overflow-x: scroll;
	gap: 5px;
	width: 100%;
	height: 100%;
	transition: all 0.3s linear 0s;
}

.item-slider.item-slider.active {
	margin-bottom: 20px;
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

.item-slider::-webkit-scrollbar-thumb {
	background-color: rgb(255, 255, 255);
}
</style>
