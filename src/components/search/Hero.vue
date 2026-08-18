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
				:alt="locale === 'da' ? currentImages.daAlt : currentImages.enAlt"
			/>
		</picture>
		<div class="credit container">{{ currentImages.credit }}</div>
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
		const { t, locale } = useI18n();
		const currentProgress = ref();
		const imageRef = ref<HTMLImageElement | null>();
		const currentImages = computed(() => {
			console.log('authStore.heroBannerNumber', authStore.heroBannerNumber);
			switch (authStore.heroBannerNumber) {
				case 1:
					return {
						mobile: hero1Mobile,
						tablet: hero1Tablet,
						desktop: hero1Desktop,
						credit: 'Foto: Jonas Olufson/Ritzau Scanpix',
						daAlt:
							'Billede af statsminister Mette Frederiksen, der proklamerer Frederik 10. som Danmarks nye konge 14. januar 2024',
						enAlt:
							'Image of the Danish Prime Minister Mette Frederiksen proclaiming Frederik X as King of Denmark on January 14th 2026',
					};
				case 2:
					return {
						mobile: hero2Mobile,
						tablet: hero2Tablet,
						desktop: hero2Desktop,
						credit: 'Foto: Lars Hansen/Ritzau Scanpix',
						daAlt: 'Billede af demonstration mod atomkraft på Københavns Rådhusplads 1976',
						enAlt: 'Image of demonstration against nuclear power on City Hall Square, Copenhagen in 1976',
					};
				default:
					return {
						mobile: hero3Mobile,
						tablet: hero3Tablet,
						desktop: hero3Desktop,
						credit: 'Foto: Erik Gleie/Ritzau Scanpix',
						daAlt:
							"Billede af Danmarks landshold på Københavns Rådhus' balkon efter at have vundet mændenes EM i fodbold i 1992",
						enAlt:
							"Image of Denmark's national team on the balcony of Copenhagen City Hall after winning the men's European Football Championship in 1992",
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
			}
		});

		return {
			authStore,
			currentProgress,
			t,
			imageRef,
			currentImages,
			locale,
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
	flex-direction: column;
	align-items: center;
}

.credit {
	color: var(--color-credits);
	display: flex;
	align-items: flex-end;
	padding-top: 10px;
	padding-bottom: 30px;
	justify-content: flex-end;
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
		height: 540px !important;
	}
}

@media (min-width: 1280px) and (max-width: 1479px) {
	.bg-image {
		object-fit: cover;
		height: 660px;
	}
}
@media (min-width: 1480px) {
	.bg-image {
		object-fit: cover;
		height: 800px !important;
	}
}

.container {
	text-align: left;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
	padding-right: 12px;
	padding-left: 12px;
	background-color: var(--bg-default);
	width: 100%;
}
/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
		padding-right: 12px;
		padding-left: 12px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		max-width: 1150px;
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
	}
}
</style>
