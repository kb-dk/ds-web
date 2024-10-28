<template>
	<div class="hero-container">
		<img
			:src="backgroundImage"
			title="search background"
			alt="Image of the Royal Danish Library"
			loading="lazy"
			class="bg-image"
		/>
		<div
			ref="overlayRef"
			class="hue-overlay"
		></div>
		<div class="bluify"></div>
		<div class="noise"></div>
		<div class="container">
			<h1>
				<span class="subtitle"><span class="text">Det Kgl. Biblioteks</span></span>
				<span class="headline"><span class="text">DR-Arkiv</span></span>
			</h1>
			<div class="hero-info">
				<div class="info">
					<div class="progress-headline">
						<h2>Vi er nået 35%...</h2>
						<p>
							I DR-arkivet finder du en stor mængde af DR's egenproducerede TV- og radioudsendelser. Vi tilføjer løbende
							både nyere og ældre udsendelser, så arkivet bliver større og større
						</p>
					</div>
					<div class="process-bar">
						<div class="progress">
							<div class="color-part"></div>
						</div>
					</div>
					<div class="link-container">
						<a
							class="link"
							href="https://www.kb.dk/find-materiale/tjenester/dr-arkivet"
						>
							Læs mere om DR-arkivet
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

export default defineComponent({
	name: 'Hero',

	setup() {
		const overlayRef = ref<HTMLElement | null>(null);

		const backgroundImage = computed(() => {
			return new URL(`@/assets/images/rgb_hero_dr.svg`, import.meta.url).href;
		});

		const handleMouseMove = (e: MouseEvent) => {
			if (overlayRef.value) {
				const { left, top } = overlayRef.value.getBoundingClientRect();

				// Calculate the mouse position relative to the div
				const x = Math.round(e.clientX - left);
				const y = Math.round(e.clientY - top);

				console.log(x, y);
				overlayRef.value.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0) 0%, rgba(243, 243, 243, 0.3) 35%)`;
			}
		};

		return {
			backgroundImage,
			overlayRef,
			handleMouseMove,
		};
	},
});
</script>
<style scoped>
.hero-container {
	position: relative;
	height: 400px;
	display: flex;
	margin-top: -120px;
	margin-bottom: 6vw;
	align-items: center;
	z-index: 3;
	transition: all 0.5s linear 0s;
}
h1 {
	pointer-events: none;
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

.noise {
	pointer-events: none;
	background-image: url('@/assets/images/noise.png');
	transition: all 0.2s ease-in-out 0s;
}

.container {
	width: 100%;
	margin-left: 12px;
	flex-direction: column;
	display: flex;
	height: 100%;
}

.progress-headline {
	background-color: white;
}

.hero-info {
	max-width: 400px;
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

.info {
	height: 100%;
	display: flex;
	/* margin-bottom: calc(70px - 3vw); */
	flex-direction: column;
	justify-content: center;
}

.hero-info h2,
.hero-info p,
.hero-info .link-container {
	padding: 5px 25px;
	font-family: 'noway';
	font-weight: 100;
	color: #0a2e70;
}

.hero-info h2 {
	font-size: 26px;
}

.hero-info p {
	font-size: 16px;
}

.hero-info h2,
.hero-info p {
	margin: 0;
}

.hero-info .link-container {
	display: block;
	padding-bottom: 50px;
}

.link-container .link {
	background-color: #0a2e70;
	width: 100%;
	color: white;
	display: block;
	text-align: center;
	text-decoration: none;
	font-size: 18px;
	padding: 5px 0px;
	border-radius: 3px;
}

.subtitle {
	text-align: center;
	letter-spacing: 0px;
	color: #0b0d0a;
	font-size: 24px;
}

.headline {
	text-align: center;
	letter-spacing: 1.15px;
	color: #0b0d0a;
	text-transform: uppercase;
	font-family: 'LibreBaskerville';
	font-size: 49px;
	position: relative;
	top: -1px;
}

.hue-overlay {
	width: 100vw;
	height: 100%;
	position: absolute;
	background: linear-gradient(40deg, #c1f0f6 0%, #e0bbe4 20%, #ffd7b5 40%, #ffd1dc 60%, #e0bbe4 80%, #c1f0f6 100%);
	background-size: 100% 100%;
	transition: all 0.2s ease-in-out 0s;
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
	transition: all 0.5s linear 0s;
}

.hero-container:hover {
	background-color: #0a2e70;
}

.svg-noise {
	width: 100%;
	height: 100%;
	position: absolute;
	mix-blend-mode: screen;
	animation: noiseVerticalEffect 0.1s infinite;
	pointer-events: none;
}

.gray-overlay {
	width: 100vw;
	height: 100%;
	object-fit: cover;
	position: absolute;
	transition: all 3s linear 0.2s;
}

.noise {
	background-image: url('@/assets/images/noise.png');
	position: fixed;
	top: -50%;
	left: -50%;
	right: -50%;
	bottom: -50%;
	width: 200%;
	height: 200%;
	object-fit: cover;
	position: absolute;
	mix-blend-mode: overlay;
	opacity: 0.5;
	animation: noiseEffect 0.1s infinite;
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

@keyframes hueRotateHover {
	0% {
		filter: hue-rotate(0deg) grayscale(0);
	}
	100% {
		filter: hue-rotate(360deg) grayscale(0);
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
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.hero-container {
		justify-content: center;
	}
	.container {
		display: flex;
		flex-direction: row;
		max-width: 1150px;
		justify-content: space-between;
		align-items: center;
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
		padding-right: 0;
		padding-left: 0;
		width: 100%;
		margin-left: initial;
	}
	.hero-info {
		margin-right: 0px;
	}
}
</style>
