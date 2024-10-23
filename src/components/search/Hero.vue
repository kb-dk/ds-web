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
			class="gray-overlay"
			@mousemove="handleMouseMove"
		></div>
		<div
			ref="overlayRef"
			class="hue-overlay"
		></div>
		<div class="noise"></div>
		<svg class="svg-noise">
			<filter
				id="noise"
				x="0%"
				y="0%"
				width="100%"
				height="150%"
			>
				<feTurbulence
					baseFrequency="0.00001 0.2"
					result="NOISE"
				/>
			</filter>

			<rect
				x="0"
				y="0"
				width="100%"
				height="100%"
				filter="url(#noise)"
			></rect>
		</svg>
		<div class="container">
			<h1>
				<span class="subtitle"><span class="text">Det Kgl. Biblioteks</span></span>
				<span class="headline"><span class="text">DR-Arkiv</span></span>
			</h1>
			<div class="hero-info">
				<div class="info">
					<h2>Vi er nået 35%...</h2>
					<p>
						I DR-arkivet finder du en stor mængde af DR's egenproducerede TV- og radioudsendelser. Vi tilføjer løbende
						både nyere og ældre udsendelser, så arkivet bliver større og større
					</p>
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

.hero-info {
	max-width: 400px;
	position: relative;
	z-index: 0;
	height: 100%;
	bottom: 0px;
	display: flex;
	align-items: flex-end;
	border-top: 2px solid white;
}

.info {
	margin-bottom: calc(70px - 3vw);
}

.hero-info h2,
.hero-info p,
.hero-info .link-container {
	background-color: rgba(255, 255, 255, 0.8);
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

.hue-overlay:hover ~ .noise {
	opacity: 0;
}

.hue-overlay {
	width: 100vw;
	height: 100%;
	position: absolute;
	opacity: 0;
	background: linear-gradient(40deg, #c1f0f6 0%, #e0bbe4 20%, #ffd7b5 40%, #ffd1dc 60%, #e0bbe4 80%, #c1f0f6 100%);
	/* 	background: linear-gradient(40deg, #93ff41 0%, #c3e9ff 20%, #000000 40%, #ffffff 60%, #c3e9ff 80%, #93ff41 100%);
 */
	background-size: 500% 100%; /* Adjust the size to match the animation */
	animation: gradientLoop 5s linear infinite;
	transition: all 0.2s ease-in-out 0s;
}

.hue-overlay:hover {
	mix-blend-mode: hard-light;
	opacity: 0.7;
	animation-play-state: running; /* Start animation on hover */
}

.svg-noise rect {
	opacity: 0;
	transition: all 0.2s ease-in-out 0s;
}

.hue-overlay:hover ~ .svg-noise rect {
	opacity: 1;
}

@keyframes gradientLoop {
	0% {
		background-position: 500% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
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
	width: 100vw;
	height: 100%;
	object-fit: cover;
	position: absolute;
	mix-blend-mode: overlay;
	opacity: 1;
	animation: noiseEffect 0.1s infinite;
	filter: grayscale(1);
}

@keyframes noiseEffect {
	0% {
		background-position: 0px 0px;
	}
	25% {
		background-position: 5px -5px;
	}
	50% {
		background-position: -5px 5px;
	}
	75% {
		background-position: -5px -5px;
	}
	100% {
		background-position: 5px 5px;
	}
}
@keyframes noiseVerticalEffect {
	0% {
		top: -15px;
	}
	25% {
		top: 10px;
	}
	50% {
		top: 13px;
	}
	75% {
		top: -16px;
	}
	100% {
		top: 10px;
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
}
</style>
