<template>
	<div class="hero-container">
		<picture>
			<source
				:srcset="currentImages.desktop"
				media="(width > 991px)"
			/>
			<source
				:srcset="currentImages.tablet"
				media="(width > 641px)"
			/>
			<img
				ref="imageRef"
				:src="currentImages.mobile"
				class="bg-image"
				fetchpriority="high"
				alt=""
			/>
		</picture>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/store/authStore';
import hero1Desktop from '@/assets/images/hero1_desktop.jpg';
import hero1Tablet from '@/assets/images/hero1_tablet.jpg';
import hero1Mobile from '@/assets/images/hero1_mobile.jpg';
import hero2Desktop from '@/assets/images/hero2_desktop.jpg';
import hero2Tablet from '@/assets/images/hero2_tablet.jpg';
import hero2Mobile from '@/assets/images/hero2_mobile.jpg';
import hero3Desktop from '@/assets/images/hero3_desktop.jpg';
import hero3Tablet from '@/assets/images/hero3_tablet.jpg';
import hero3Mobile from '@/assets/images/hero3_mobile.jpg';

export default defineComponent({
	name: 'Hero',
	setup() {
		const authStore = useAuthStore();
		const { t } = useI18n();
		const currentProgress = ref();
		const imageRef = ref<HTMLImageElement | null>();
		const currentImages = computed(() => {
			switch (authStore.heroBannerNumber) {
				case 1:
					return {
						mobile: hero1Mobile,
						tablet: hero1Tablet,
						desktop: hero1Desktop,
					};
				case 2:
					return {
						mobile: hero2Mobile,
						tablet: hero2Tablet,
						desktop: hero2Desktop,
					};
				default:
					return {
						mobile: hero3Mobile,
						tablet: hero3Tablet,
						desktop: hero3Desktop,
					};
			}
		});
		onMounted(() => {
			if (authStore.currentArchiveProgress !== 0) {
				currentProgress.value = authStore.currentArchiveProgress;
			}
			if (imageRef.value) {
				if (authStore.heroBannerNumber === 0) {
					const randomNumber = Math.floor(Math.random() * 3) + 1;
					authStore.heroBannerNumber = randomNumber;
				}

				if (authStore.heroBannerNumber === 1) {
					imageRef.value.alt = 'Image of King Frederik X proclamation';
				} else if (authStore.heroBannerNumber === 2) {
					imageRef.value.alt = '';
				} else {
					imageRef.value.alt = '';
				}
			}
		});

		return {
			authStore,
			currentProgress,
			t,
			imageRef,
			currentImages,
		};
	},
});
</script>
<style scoped>
.hero-container {
	position: relative;
	height: 100%;
	width: 100%;
	justify-content: center;
	display: flex;
	z-index: 3;
	overflow: visible;
	margin-bottom: 20px;
}

.bg-image {
	display: block;
	width: 100%;
	height: auto;
	max-width: 1420px;
}

.hero-container picture {
	width: 100%;
}

@media (min-width: 1280px) {
	.hero-container picture {
		width: initial;
	}
}

@media (min-width: 990px) and (max-width: 1279px) {
	.bg-image {
		object-fit: cover;
		height: 563px !important;
	}
}

@media (min-width: 1280px) and (max-width: 1439px) {
	.bg-image {
		object-fit: cover;
		height: 680px;
	}
}
@media (min-width: 1440px) {
	.bg-image {
		object-fit: cover;
		height: 800px !important;
	}
}
</style>
