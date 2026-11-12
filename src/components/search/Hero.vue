<template>
	<div class="hero-container">
		<div class="image-wrapper">
			<Transition name="slide">
				<picture :key="currentIndex">
					<source
						:srcset="currentImages.desktop"
						media="(width > 991px)"
					/>
					<source
						:srcset="currentImages.tablet"
						media="(width > 641px)"
					/>
					<img
						:src="currentImages.mobile"
						class="bg-image"
						fetchpriority="high"
						:alt="locale === 'da' ? currentImages.daAlt : currentImages.enAlt"
					/>
				</picture>
			</Transition>
			<div class="carousel-controls">
				<KBButton
					button-size="medium"
					button-type="btn-cta"
					:button-text="t('hero.searchButton') + currentImages.searchText"
					button-color="cta"
					class="btn-medium"
					right-icon-name="arrow_forward_ios"
					:is-router-link="true"
					:to="{
						name: 'Search',
						query: {
							q: currentImages.searchText,
							start: 0,
						},
					}"
				></KBButton>
				<div>
					<button
						class="carousel-button pause-button"
						:aria-label="isPaused ? t('frontpage.hero.play') : t('frontpage.hero.pause')"
						@click="togglePause"
					>
						<span
							class="material-icons"
							aria-hidden="true"
						>
							{{ isPaused ? 'play_arrow' : 'pause' }}
						</span>
					</button>
					<button
						v-for="(image, index) in images"
						:key="index"
						class="carousel-button"
						:class="{ active: index === currentIndex }"
						:aria-label="t('frontpage.hero.goTo', { number: index + 1, total: images.length })"
						:aria-current="index === currentIndex"
						@click="goTo(index)"
					>
						<span class="indicator"></span>
					</button>
				</div>
			</div>
		</div>
		<div class="container">
			<p class="description label-small">{{ locale === 'da' ? currentImages.daAlt : currentImages.enAlt }}</p>
			<p class="credit label-small-bold">{{ currentImages.credit }}</p>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed } from 'vue';
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
import KBButton from '@/components/common/KBButton.vue';

const ROTATION_INTERVAL_MS = 7000;

const images = [
	{
		mobile: hero1Mobile,
		tablet: hero1Tablet,
		desktop: hero1Desktop,
		credit: 'Foto: Jonas Olufson/Ritzau Scanpix',
		daAlt:
			'Billede af statsminister Mette Frederiksen, der proklamerer Frederik 10. som Danmarks nye konge 14. januar 2024',
		enAlt:
			'Image of the Danish Prime Minister Mette Frederiksen proclaiming Frederik X as King of Denmark on January 14th 2026',
		searchText: '"kongehuset"',
	},
	{
		mobile: hero2Mobile,
		tablet: hero2Tablet,
		desktop: hero2Desktop,
		credit: 'Foto: Lars Hansen/Ritzau Scanpix',
		daAlt: 'Billede af demonstration mod atomkraft på Københavns Rådhusplads 1976',
		enAlt: 'Image of demonstration against nuclear power on City Hall Square, Copenhagen in 1976',
		searchText: '"atomkraft"',
	},
	{
		mobile: hero3Mobile,
		tablet: hero3Tablet,
		desktop: hero3Desktop,
		credit: 'Foto: Erik Gleie/Ritzau Scanpix',
		daAlt:
			"Billede af Danmarks landshold på Københavns Rådhus' balkon efter at have vundet mændenes EM i fodbold i 1992",
		enAlt:
			"Image of Denmark's national team on the balcony of Copenhagen City Hall after winning the men's European Football Championship in 1992",
		searchText: '"landsholdet"',
	},
];

export default defineComponent({
	name: 'Hero',
	components: {
		KBButton,
	},
	setup() {
		const authStore = useAuthStore();
		const { t, locale } = useI18n();
		const isPaused = ref(false);
		let timer: ReturnType<typeof setInterval> | undefined;

		const currentIndex = computed(() => Math.max(authStore.heroBannerNumber - 1, 0));
		const currentImages = computed(() => images[currentIndex.value]);

		const goTo = (index: number) => {
			authStore.heroBannerNumber = index + 1;
			if (!isPaused.value) startTimer();
		};

		const next = () => goTo((currentIndex.value + 1) % images.length);

		const stopTimer = () => {
			if (timer) clearInterval(timer);
			timer = undefined;
		};

		const startTimer = () => {
			stopTimer();
			timer = setInterval(next, ROTATION_INTERVAL_MS);
		};

		const togglePause = () => {
			isPaused.value = !isPaused.value;
			if (isPaused.value) stopTimer();
			else startTimer();
		};

		onMounted(() => {
			startTimer();
		});

		onBeforeUnmount(stopTimer);

		return {
			t,
			locale,
			images,
			currentIndex,
			currentImages,
			isPaused,
			goTo,
			togglePause,
		};
	},
});
</script>
<style scoped>
.image-wrapper {
	position: relative;
	width: 100%;
	max-width: 1420px;
	overflow: hidden;
}

.slide-enter-active,
.slide-leave-active {
	transition: transform 0.6s ease-in-out;
}

.slide-leave-active {
	position: absolute;
	top: 0;
	left: 0;
}

.slide-enter-from {
	transform: translateX(100%);
}

.slide-leave-to {
	transform: translateX(-100%);
}

@media (prefers-reduced-motion: reduce) {
	.slide-enter-active,
	.slide-leave-active {
		transition: none;
	}
}

.carousel-controls {
	position: absolute;
	z-index: 1;
	right: 24px;
	bottom: 12px;
	display: flex;
	gap: 38px;
	flex-direction: column;
	align-items: flex-end;
}
.carousel-controls > div {
	display: flex;
	gap: 12px;
	align-items: center;
}

.carousel-button {
	width: 32px;
	height: 32px;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2px solid var(--bg-main);
	background-color: var(--bg-default);
	color: var(--color-default);
	cursor: pointer;
}

.carousel-button:focus-visible {
	outline: 2px solid var(--bg-main-3);
	outline-offset: 2px;
}

.pause-button {
	background-color: var(--bg-main);
}

.pause-button .material-icons {
	font-size: 24px;
}

.indicator {
	width: 12px;
	height: 12px;
	background-color: transparent;
}

.carousel-button.active .indicator,
.carousel-button:hover .indicator {
	background-color: var(--bg-main);
}

.carousel-button.pause-button:hover {
	background-color: var(--bg-main-hover);
}

.hero-container {
	position: relative;
	height: 100%;
	width: 100%;
	justify-content: center;
	display: flex;
	z-index: 3;
	overflow: visible;
	margin-bottom: 24px;
	flex-direction: column;
	align-items: center;
}

.credit,
.description {
	color: var(--color-credits);
	display: flex;
	align-items: flex-end;
	padding-top: 10px;
	justify-content: flex-end;
	margin: 0;
}

.bg-image {
	display: block;
	width: 100%;
	height: auto;
	max-width: 1420px;
}

.hero-container picture {
	display: block;
	width: 100%;
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
	text-align: right;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
	padding-right: 12px;
	padding-left: 12px;
	background-color: var(--bg-default);
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: end;
	height: 95px;
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
	.credit,
	.description {
		max-width: 75%;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		max-width: 1150px;
	}
	.credit,
	.description {
		max-width: 50%;
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
