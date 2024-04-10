<template>
	<div
		ref="itemSliderRef"
		:class="move ? 'item-slider active' : 'item-slider'"
	>
		<slot :disable-links="move"></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
	name: 'ItemSlider',
	props: {
		itemClass: { type: String, required: true },
	},
	setup(props) {
		const itemSliderRef = ref<HTMLElement | null>(null);
		const isDown = ref(false);
		const startX = ref(0);
		const scrollLeft = ref(0);
		const linkItems = ref(null as null | NodeList);
		const move = ref(false);

		onMounted(() => {
			if (itemSliderRef.value) {
				linkItems.value = itemSliderRef?.value.querySelectorAll('.' + props.itemClass);
			}
			if (itemSliderRef.value) {
				itemSliderRef.value.addEventListener('mousedown', startAndCalculateOffset);
				itemSliderRef.value.addEventListener('mouseleave', stopMovementOnParent);
				itemSliderRef.value.addEventListener('mouseup', stopMovementOnParent);
				itemSliderRef.value.addEventListener('mousemove', calculateMovement);
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
	margin-top: 20px;
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
}

.item-slider::-webkit-scrollbar-track {
	background-color: rgb(255, 255, 255);
	margin: -6px;
}

.item-slider.active a {
	pointer-events: none;
}

.item-slider::-webkit-scrollbar {
	width: 20px;
}

.item-slider::-webkit-scrollbar-thumb {
	background-color: rgb(200, 200, 200);
}
</style>
