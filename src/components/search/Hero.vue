<template>
	<div class="hero-container">
		<img
			:src="backgroundImage"
			title="search background"
			alt="Image of the Royal Danish Library"
			loading="lazy"
			class="bg-image"
		/>
	</div>
</template>
<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
	name: 'Hero',

	setup() {
		const backgroundImage = computed(() => {
			return new URL(`@/assets/images/_Den_Sorte_Diamant-Laura_Stamer-min.jpg`, import.meta.url).href;
		});

		return {
			backgroundImage,
		};
	},
});
</script>
<style scoped>
.hero-container {
	position: relative;
	height: 400px;
	display: flex;
	justify-content: center;
	margin-top: -6vw;
	margin-bottom: 85px;
}

.bg-image {
	width: 100vw;
	height: 100%;
	object-fit: cover;
	position: absolute;
}
</style>
