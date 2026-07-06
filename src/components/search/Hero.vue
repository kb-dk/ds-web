<template>
	<div class="hero-container">
		<img
			:src="backgroundImage"
			title="search background"
			alt="Image of the Royal Danish Library"
			class="bg-image"
			fetchpriority="high"
		/>
		<div class="hue-overlay"></div>
	</div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/store/authStore';
import hero1 from '@/assets/images/hero_image_1_PLACEHOLDER.jpg';
// import hero2 from '@/assets/images/hero_image_2.jpg';
// import hero3 from '@/assets/images/hero_image_3.jpg';

export default defineComponent({
	name: 'Hero',
	setup() {
		const authStore = useAuthStore();
		const { t } = useI18n();
		const currentProgress = ref();
		const backgroundImage = computed(() => {
			return hero1;
			// if (randomImageNumber.value === 1) {
			// 	return hero1;
			// }
			// if (randomImageNumber.value === 2) {
			// 	return hero2;
			// }
			// return hero3;
		});
		// const randomImageNumber = ref<number>(1);
		onMounted(() => {
			if (authStore.currentArchiveProgress !== 0) {
				currentProgress.value = authStore.currentArchiveProgress;
			}
			// randomImageNumber.value = Math.floor(Math.random() * 3) + 1;
		});

		return {
			backgroundImage,
			authStore,
			currentProgress,
			t,
		};
	},
});
</script>
<style scoped>
.hero-container {
	position: relative;
	height: 350px;
	display: flex;
	margin-bottom: 6vw;
	z-index: 3;
	overflow: visible;
	transition: background-color 0.5s linear 0s;
}

.hue-overlay {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	max-width: 1680px;
	width: 100vw;
}

.bg-image {
	width: 100vw;
	height: 300px;
	object-fit: cover;
	position: absolute;
	background-color: var(--bg-default);
	max-width: 1680px;
	bottom: 0;
}

/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
}

/* MEDIA QUERY 800 */
@media (min-width: 800px) {
	.container {
		margin-left: 12px;
		height: 100%;
	}
	h1 {
		margin-left: 0px;
	}

	.hero-container {
		height: 475px;
	}
	.bg-image {
		height: 400px;
	}
}

/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.hero-container {
		justify-content: center;
	}
	.hero-container {
		height: 575px;
	}
	.bg-image {
		height: 500px;
	}
	.container {
		display: flex;
		max-width: 1150px;
		width: 100%;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		padding-right: 12px;
		padding-left: 12px;
		width: 100%;
		margin-left: initial;
	}
}
@media (min-width: 1680px) {
	.hue-overlay {
		background-image: linear-gradient(to right, var(--bg-default), transparent 100px),
			linear-gradient(to left, var(--bg-default), transparent 100px);
	}
}
</style>
