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
		<div class="bluify"></div>
		<div class="noise"></div>
		<div class="container">
			<h1 :aria-label="`${t('hero.subtitle')} ${t('hero.title')}`">
				<span class="subtitle">
					<span class="text">{{ t('hero.subtitle') }}</span>
				</span>
				<span class="headline">
					<span class="text">{{ t('hero.title') }}</span>
				</span>
			</h1>
			<transition name="fade">
				<div
					v-show="authStore.currentArchiveProgress !== 0"
					class="hero-info"
				>
					<div class="info">
						<div class="progress-headline">
							<h2>{{ t('hero.progress', { index: currentProgress }) }}</h2>
							<p>
								{{ t('hero.explanation') }}
							</p>
						</div>
						<div class="process-bar">
							<div
								:style="`left:${currentProgress}%`"
								class="procentage"
							>
								{{ currentProgress }}%
							</div>
							<div
								v-for="i in 20"
								:key="i"
								:class="progress(i)"
							></div>
						</div>
						<div class="link-container">
							<a
								class="link"
								:href="t('hero.link')"
							>
								{{ t('hero.linkText') }}
							</a>
						</div>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/store/authStore';
import gsap from 'gsap';

export default defineComponent({
	name: 'Hero',

	setup() {
		const authStore = useAuthStore();
		const { t } = useI18n();
		const currentProgress = ref(0);
		const backgroundImage = computed(() => {
			return new URL(`@/assets/images/rgb_hero_dr.png`, import.meta.url).href;
		});

		onMounted(() => {
			if (authStore.currentArchiveProgress !== 0) {
				currentProgress.value = authStore.currentArchiveProgress;
			}
		});

		const progress = (index: number) => {
			const maxRange = 20;
			let pt = Math.round((maxRange / 100) * currentProgress.value);
			if (index < pt) return 'step darkblue';
			if (index === pt) return 'step darkblue';
			if (index === pt + 1) return 'step blue';
			if (index === pt + 2) return 'step lightblue';
			if (index === pt + 3) return 'step grey';
			if (index === pt + 4) return 'step lightgrey';
			if (index > pt + 4) return 'step white';
		};

		watch(
			() => authStore.currentArchiveProgress,
			(newVal: number) => {
				if (newVal !== 0) {
					gsap.to(currentProgress, {
						value: authStore.currentArchiveProgress,
						duration: 2,
						ease: 'power2.out',
						snap: { value: 1 },
						onUpdate() {
							console.log(Math.round(currentProgress.value));
						},
					});
					console.log('lets fucking go!');
				}
			},
		);

		return {
			backgroundImage,
			authStore,
			progress,
			currentProgress,
			t,
		};
	},
});
</script>
<style scoped>
.hero-container {
	position: relative;
	height: auto;
	display: flex;
	margin-top: -120px;
	margin-bottom: 6vw;
	align-items: center;
	z-index: 3;
	overflow: hidden;
	transition: background-color 0.5s linear 0s;
}
h1 {
	pointer-events: none;
}

.process-bar {
	margin-top: 10px;
	margin-bottom: 10px;
	height: 34px;
	display: flex;
	padding: 5px 15px;
}

.procentage {
	position: absolute;
	text-align: center;
	transform: translate(-50%, 0%);
	color: white;
	font-size: 26px;
}

.step {
	width: 5%;
	height: 100%;
	box-sizing: border-box;
	border-left: 1px solid rgba(255, 255, 255, 0.05);
	transition: all 0.15s ease-in-out 0s;
}

.step.darkblue {
	background-color: #0a2e70;
}
.step.blue {
	background-color: #002e70cc;
}

.step.lightblue {
	background-color: #002e7066;
}

.step.grey {
	background-color: #ffffff66;
}

.step.lightgrey {
	background-color: #ffffffcc;
}

.step.white {
	background-color: white;
}

h1 .headline,
h1 .subtitle {
	display: block;
	font-weight: 100;
	background-color: white;
	width: fit-content;
	padding: 0px 10px;
	pointer-events: all;
}

h1 .subtitle {
	font-size: 24px;
	margin-top: 10%;
}

h1 .headline {
	font-size: 40px;
}

.container {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-evenly;
}
.container h1 {
	margin-top: 135px;
	margin-bottom: 55px;
}

.progress-headline {
	background-color: white;
	box-shadow: 0 0px 2px rgb(0 0 0 / 0.3);
	margin: 15px 15px 0px 15px;
}

.hero-info {
	max-width: 100%;
	position: relative;
	z-index: 0;
	display: flex;
	border-top: 1px solid white;
	border-bottom: 1px solid white;
	background-color: rgba(255, 255, 255, 0.35);
	box-sizing: border-box;
	padding-bottom: 75px;
}

.info {
	height: 100%;
	margin-top: 0%;
	display: flex;
	/* margin-bottom: calc(70px - 3vw); */
	flex-direction: column;
}

.hero-info h2,
.hero-info p,
.hero-info .link-container {
	padding: 5px 15px;
	font-family: 'noway';
	font-weight: 100;
	color: #0a2e70;
}

.hero-info h2 {
	font-size: 20px;
	padding: 12px 25px 6px 25px;
}

h1 {
	margin-left: 12px;
}

.hero-info p {
	font-size: 14px;
	padding: 0px 25px 17px 25px;
}

.hero-info h2,
.hero-info p {
	margin: 0;
}

.hero-info .link-container {
	display: block;
}

.link-container .link {
	background-color: #0a2e70;
	width: 100%;
	color: white;
	display: block;
	text-align: center;
	text-decoration: none;
	font-size: 24px;
	padding: 4px 10px 6px 10px;
	border-radius: 4px;
	height: 55px;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	justify-content: center;
	border: 1px solid white;
	margin-bottom: 15px;
	transition: all 0.1s linear 0s;
}
.subtitle {
	text-align: center;
	letter-spacing: 0px;
	color: #0b0d0a;
	font-size: 16px;
}

.headline {
	text-align: center;
	letter-spacing: 1.15px;
	color: #0b0d0a;
	text-transform: uppercase;
	font-family: 'LibreBaskerville';
	font-size: 28px;
	position: relative;
	top: -1px;
}

.hue-overlay {
	width: 100vw;
	height: 100%;
	position: absolute;
	background: linear-gradient(40deg, #c1f0f6 0%, #e0bbe4 20%, #ffd7b5 40%, #ffd1dc 60%, #e0bbe4 80%, #c1f0f6 100%);
	background-size: 100% 100%;
	mix-blend-mode: difference;
	opacity: 0.2;
}

.bluify {
	width: 100vw;
	height: 100%;
	position: absolute;
	background-size: 100% 100%;
	background: radial-gradient(circle, rgba(0, 46, 112, 0) 0%, rgba(0, 46, 112, 0.1) 30%, rgba(0, 46, 112, 0.7) 100%);
	pointer-events: none;
}

h1 {
	position: relative;
	z-index: 1;
}

.bg-image {
	width: 100vw;
	height: 100%;
	object-fit: cover;
	position: absolute;
	animation: hueRotate 5s infinite;
}

.hero-container:hover {
	background-color: #0a2e70;
}

.noise {
	background-image: url('@/assets/images/noise.jpg');
	position: fixed;
	top: -25%;
	left: -50%;
	right: -50%;
	bottom: -50%;
	width: 200%;
	height: 150%;
	object-fit: cover;
	position: absolute;
	mix-blend-mode: overlay;
	opacity: 0.5;
	animation: noiseEffect 0.1s infinite alternate-reverse;
	filter: grayscale(1);
}

@keyframes hueRotate {
	0% {
		filter: hue-rotate(0deg) grayscale(0.5);
	}
	100% {
		filter: hue-rotate(360deg) grayscale(0.5);
	}
}

@keyframes noiseEffect {
	0% {
		transform: translate(0, 0);
	}
	10% {
		transform: translate(-5%, -5%);
	}
	20% {
		transform: translate(-10%, 5%);
	}
	30% {
		transform: translate(5%, -10%);
	}
	40% {
		transform: translate(-5%, 15%);
	}
	50% {
		transform: translate(-10%, 5%);
	}
	60% {
		transform: translate(15%, 0);
	}
	70% {
		transform: translate(0, 10%);
	}
	80% {
		transform: translate(-15%, 0);
	}
	90% {
		transform: translate(10%, 5%);
	}
	100% {
		transform: translate(5%, 0);
	}
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
	.link-container .link {
		font-size: 26px;
	}
}

/* MEDIA QUERY 800 */
@media (min-width: 800px) {
	.container {
		flex-direction: row;
		margin-left: 12px;
		justify-content: space-between;
		height: 100%;
	}
	h1 {
		margin-left: 0px;
	}
	.container h1 {
		margin-top: 125px;
	}
	.process-bar {
		padding: 5px 20px;
		margin-bottom: 20px;
	}
	.progress-headline {
		margin: 20px 0px 0px 0px;
	}
	.hero-info h2 {
		font-size: 26px;
		padding: 14px 20px 0px 20px;
	}
	.hero-info p {
		font-size: 16px;
		padding: 6px 20px 20px 20px;
	}

	.hero-info {
		max-width: 440px;
		position: relative;
		z-index: 0;
		height: 100%;
		bottom: 0px;
		display: flex;
		border-left: 2px solid white;
		border-right: 2px solid white;
		background-color: rgba(255, 255, 255, 0.5);
		margin-right: 12px;
		box-sizing: border-box;
	}
	.hero-info .link-container {
		padding: 5px 20px;
	}
	.hero-info .info {
		margin-top: 125px;
	}
	.hero-container {
		height: 500px;
	}

	.headline {
		font-size: 49px;
	}
	.subtitle {
		font-size: 24px;
	}
}

/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.hero-info h2 {
		font-size: 26px;
		padding: 14px 25px 0px 25px;
	}
	.hero-info p {
		padding: 6px 25px 20px 25px;
	}
	.hero-info {
		max-width: 580px;
	}
	.process-bar {
		padding: 5px 25px;
	}
	.hero-info .info {
		margin-top: 105px;
	}
	.hero-info .link-container {
		padding: 5px 25px;
	}
	.hero-container {
		justify-content: center;
	}
	.container {
		display: flex;
		flex-direction: row;
		max-width: 1150px;
		justify-content: space-between;
	}
	.container h1 {
		margin-top: 105px;
	}
	.link-container .link:hover {
		background-color: #c4f1ed;
		color: #0a2e70;
		border: 1px solid #0a2e70;
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
	.hero-info {
		max-width: 620px;
	}
	.hero-info p {
		padding: 6px 45px 20px 45px;
	}
	.hero-info h2 {
		padding: 14px 45px 0px 45px;
	}
	.process-bar {
		padding: 5px 45px;
	}
	.container {
		padding-right: 12px;
		padding-left: 12px;
		width: 100%;
		margin-left: initial;
	}
	.hero-info {
		margin-right: 0px;
	}
	.hero-info .link-container {
		padding: 5px 45px;
	}
}
</style>
