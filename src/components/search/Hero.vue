<template>
	<div class="hero-container">
		<img
			ref="imageRef"
			title="search background"
			class="bg-image"
			fetchpriority="high"
			:srcset="srcSetValues"
			sizes="100vw"
		/>
		<div class="hue-overlay"></div>
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
		const srcSetValues = computed(() => {
			if (authStore.heroBannerNumber === 1) {
				return `${hero1Mobile} 640w, ${hero1Tablet} 980w, ${hero1Desktop} 1920w`;
			} else if (authStore.heroBannerNumber === 2) {
				return `${hero2Mobile} 640w, ${hero2Tablet} 980w, ${hero2Desktop} 1920w`;
			} else {
				return `${hero3Mobile} 640w, ${hero3Tablet} 980w, ${hero3Desktop} 1920w`;
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
			srcSetValues,
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

.hue-overlay {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	max-width: 1420px;
	width: 100vw;
}

.bg-image {
	display: block;
	width: 100%;
	height: auto;
	max-width: 1420px;
}

/* MEDIA QUERY 800 */
@media (min-width: 800px) {
	h1 {
		margin-left: 0px;
	}
}
@media (min-width: 1680px) {
	.hue-overlay {
		background-image: linear-gradient(to right, var(--bg-default), transparent 100px),
			linear-gradient(to left, var(--bg-default), transparent 100px);
	}
}
</style>
