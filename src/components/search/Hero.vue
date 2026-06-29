<template>
	<div class="hero-container">
		<div class="container">
			<h1 :aria-label="`${t('hero.title')}`">
				<span class="headline heading-display">
					<span class="text">{{ t('hero.title') }}</span>
				</span>
			</h1>
			<SearchBar></SearchBar>
		</div>
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
import hero1 from '@/assets/images/hero_image_1.jpg';
import hero2 from '@/assets/images/hero_image_2.jpg';
import hero3 from '@/assets/images/hero_image_3.jpg';
import SearchBar from './SearchBar.vue';

export default defineComponent({
	name: 'Hero',
	components: { SearchBar },
	setup() {
		const authStore = useAuthStore();
		const { t } = useI18n();
		const currentProgress = ref();
		const backgroundImage = computed(() => {
			if (randomImageNumber.value === 1) {
				return hero1;
			}
			if (randomImageNumber.value === 2) {
				return hero2;
			}
			return hero3;
		});
		const randomImageNumber = ref<number>(1);
		onMounted(() => {
			if (authStore.currentArchiveProgress !== 0) {
				currentProgress.value = authStore.currentArchiveProgress;
			}
			randomImageNumber.value = Math.floor(Math.random() * 3) + 1;
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

h1 .headline {
	display: block;
	background-color: transparent;
	width: fit-content;
	padding: 0px 0px;
	pointer-events: all;
	position: relative;
	z-index: 1;
	pointer-events: none;
	text-transform: uppercase;
	letter-spacing: 1.15px;
	color: var(--color-main);
}
h1 {
	margin: 0;
	height: calc(var(--fs-xl) + 50px);
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
.container {
	position: absolute;
	display: flex;
	flex-direction: column;
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
