<template>
	<div class="hero-container">
		<div class="container">
			<h1>
				<span class="subtitle"><span class="text">Det Kgl. Biblioteks</span></span>
				<span class="headline"><span class="text">DR-Arkiv</span></span>
			</h1>
		</div>
		<img
			:src="backgroundImage"
			title="search background"
			alt="Image of the Royal Danish Library"
			loading="lazy"
			class="bg-image"
		/>
		<img
			:src="backgroundImage"
			title="search background"
			alt="Image of the Royal Danish Library"
			loading="lazy"
			class="bg-image cyan"
		/>
		<img
			:src="backgroundImage"
			title="search background"
			alt="Image of the Royal Danish Library"
			loading="lazy"
			class="bg-image magenta"
		/>
		<div class="noise"></div>
	</div>
</template>
<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
	name: 'Hero',

	setup() {
		const backgroundImage = computed(() => {
			return new URL(`@/assets/images/_Den_Sorte_Diamant-Laura_Stamer-min.jpg`, import.meta.url).href;
		});

		return {
			backgroundImage,
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
}

h1 .headline,
h1 .subtitle {
	display: block;
	font-weight: 100;
	background-color: white;
	width: fit-content;
	padding: 0px 10px;
}
.noise {
	background-image: url('@/assets/images/noise.png');
}

.container {
	width: 100%;
	margin-left: 12px;
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
		flex-direction: column;
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
		padding-right: 0;
		padding-left: 0;
		width: 100%;
		margin-left: initial;
	}
}
</style>
