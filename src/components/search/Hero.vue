<template>
	<div class="hero-container">
		<section
			class="carousel"
			aria-roledescription="carousel"
			:aria-label="t('frontpage.hero.label')"
			@focusin="isInteracting = true"
			@focusout="onFocusOut"
		>
			<div
				class="carousel-controls"
				@mouseenter="isInteracting = true"
				@mouseleave="isInteracting = false"
			>
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
						:aria-label="t('frontpage.hero.goTo', { number: index + 1, total: images.length, topic: image.searchTerm })"
						:aria-current="index === currentIndex"
						@click="goTo(index)"
					>
						<span class="indicator"></span>
					</button>
				</div>
				<KBButton
					button-size="medium"
					button-type="btn-cta"
					:button-text="t('hero.searchButton', { query: currentImages.searchTerm })"
					button-color="cta"
					class="btn-medium"
					right-icon-name="arrow_forward_ios"
					:is-router-link="true"
					:to="{
						name: 'Search',
						query: {
							q: searchQuery,
							start: 0,
						},
					}"
				></KBButton>
			</div>
			<figure
				class="slide"
				role="group"
				aria-roledescription="slide"
				:aria-label="t('frontpage.hero.slide', { number: currentIndex + 1, total: images.length })"
			>
				<div class="image-wrapper">
					<Transition name="slide">
						<picture :key="currentIndex">
							<source
								:srcset="currentImages.desktop"
								:media="MEDIA_DESKTOP"
								width="1920"
								height="960"
							/>
							<source
								:srcset="currentImages.tablet"
								:media="MEDIA_TABLET"
								width="1200"
								height="700"
							/>
							<!-- Empty alt: the figcaption below carries the description, so screen readers read it once. -->
							<img
								:src="currentImages.mobile"
								class="bg-image"
								fetchpriority="high"
								width="800"
								height="700"
								alt=""
							/>
						</picture>
					</Transition>
				</div>
				<figcaption
					class="container"
					:aria-live="isRotating ? 'off' : 'polite'"
					aria-atomic="true"
				>
					<p class="description label-small">
						{{ locale === 'da' ? currentImages.daCaption : currentImages.enCaption }}
						<span class="credit label-small-bold">{{ currentImages.credit }}</span>
					</p>
				</figcaption>
			</figure>
		</section>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
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
const MEDIA_DESKTOP = '(width > 991px)';
const MEDIA_TABLET = '(width > 641px)';

const images = [
	{
		mobile: hero1Mobile,
		tablet: hero1Tablet,
		desktop: hero1Desktop,
		credit: 'Foto: Jonas Olufson/Ritzau Scanpix',
		daCaption: 'Kong Frederik Xs indsættelse, 14. januar 2024.',
		enCaption: 'King Frederik X’s inauguration, January 14th 2024.',
		searchTerm: 'kongehuset',
	},
	{
		mobile: hero2Mobile,
		tablet: hero2Tablet,
		desktop: hero2Desktop,
		credit: 'Foto: Lars Hansen/Ritzau Scanpix',
		daCaption: 'Landsholdet fejres på Københavns rådhuset efter EM-sejr, 1992.',
		enCaption: 'The national team celebrated at Copenhagen City Hall after EM win, 1992.',
		searchTerm: 'atomkraft',
	},
	{
		mobile: hero3Mobile,
		tablet: hero3Tablet,
		desktop: hero3Desktop,
		credit: 'Foto: Erik Gleie/Ritzau Scanpix',
		daCaption: 'Demonstration mod atomkraft, Rådhuspladsen 1974.',
		enCaption: 'Anti-nuclear demonstration, City Hall Square 1974.',
		searchTerm: 'landsholdet',
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
		const isInteracting = ref(false);
		const isRotating = computed(() => !isPaused.value && !isInteracting.value);
		let timer: ReturnType<typeof setInterval> | undefined;

		const currentIndex = computed(() => Math.max(authStore.heroBannerNumber - 1, 0));
		const currentImages = computed(() => images[currentIndex.value]);
		const searchQuery = computed(() => currentImages.value.searchTerm);
		const variantFor = (image: (typeof images)[number]) => {
			if (window.matchMedia(MEDIA_DESKTOP).matches) {
				return image.desktop;
			}
			if (window.matchMedia(MEDIA_TABLET).matches) {
				return image.tablet;
			}
			return image.mobile;
		};

		const decoded = new Set<string>();
		const loadImage = async (index: number) => {
			const src = variantFor(images[index]);
			if (decoded.has(src)) {
				return;
			}
			const img = new Image();
			img.src = src;
			try {
				await img.decode();
				decoded.add(src);
			} catch {
				// Load/decode failed: switch anyway rather than leaving the carousel stuck.
			}
		};
		let goToRequest = 0;
		const goTo = async (index: number) => {
			const request = ++goToRequest;
			if (isRotating.value) {
				startTimer();
			}
			await loadImage(index);
			if (request !== goToRequest) {
				return;
			}
			authStore.heroBannerNumber = index + 1;
			void loadImage((index + 1) % images.length);
		};

		const next = () => goTo((currentIndex.value + 1) % images.length);

		const stopTimer = () => {
			if (timer) {
				clearInterval(timer);
			}
			timer = undefined;
		};

		const startTimer = () => {
			stopTimer();
			timer = setInterval(next, ROTATION_INTERVAL_MS);
		};

		const togglePause = () => {
			isPaused.value = !isPaused.value;
		};

		const onFocusOut = (event: FocusEvent) => {
			const carousel = event.currentTarget as HTMLElement;
			if (!carousel.contains(event.relatedTarget as Node | null)) {
				isInteracting.value = false;
			}
		};

		watch(isRotating, (rotating) => (rotating ? startTimer() : stopTimer()));

		onMounted(() => {
			isPaused.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (isRotating.value) {
				startTimer();
			}
			void loadImage((currentIndex.value + 1) % images.length);
		});

		onBeforeUnmount(stopTimer);

		return {
			t,
			locale,
			images,
			MEDIA_DESKTOP,
			MEDIA_TABLET,
			currentIndex,
			currentImages,
			searchQuery,
			isPaused,
			isInteracting,
			isRotating,
			goTo,
			togglePause,
			onFocusOut,
		};
	},
});
</script>
<style scoped>
.carousel {
	--caption-height: 75px;
	position: relative;
	width: 100%;
	max-width: 1420px;
}

.slide {
	margin: 0;
}

.image-wrapper {
	position: relative;
	width: 100%;
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
	bottom: calc(var(--caption-height));
	display: flex;
	gap: 28px;
	flex-direction: column-reverse;
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
	border: 1px solid var(--bg-main);
	background-color: var(--bg-default);
	color: var(--color-default);
	cursor: pointer;
	border-radius: var(--rounded-medium);
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
	width: 16px;
	height: 16px;
	background-color: transparent;
	border-radius: var(--rounded-small);
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
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

.description {
	color: var(--color-credits);
	margin: 0;
	text-align: right;
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
	height: var(--caption-height);
	padding-top: 46px;
	margin-bottom: 38px;
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
		padding-top: 10px;
		max-width: 990px;
		margin-bottom: 0px;
	}
	.description {
		max-width: 75%;
	}
	.carousel-controls {
		bottom: calc(var(--caption-height) + 12px);
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		max-width: 1150px;
	}
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
	.carousel-button {
		height: 28px;
		width: 28px;
	}
	.indicator {
		width: 14px;
		height: 14px;
	}
}
</style>
