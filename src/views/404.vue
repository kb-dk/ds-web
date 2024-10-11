<template>
	<div class="not-found">
		<div class="edge-top"></div>
		<div class="not-found-content">
			<div class="imageContainer">
				<img
					class="wrongUrlImage"
					:src="getImgServerSrcURL()"
				/>
			</div>
			<div>
				<h1>Vi kan desværre ikke finde siden som du søger :(</h1>
				<p>Det er ærgerligt fordi vi har faktisk 25.000 TB websider på lager</p>
				<h2>Måske du leder efter</h2>
				<div>
					<a
						class="btn-light btn"
						href="/find-materiale/dr-arkivet/"
						role="button"
					>
						Forsiden af DR-arkivet
					</a>
					<a
						class="btn-light btn"
						href="https://www.kb.dk"
						role="button"
					>
						Forsiden af Det Kgl. Bibliotek
					</a>
				</div>
			</div>
		</div>
		<div class="edge-bottom"></div>
		<Footer />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Footer from '@/components/global/nav/Footer.vue';

export default defineComponent({
	name: '404',
	components: {
		Footer,
	},
	setup() {
		const getImgServerSrcURL = () => {
			return new URL(`@/assets/images/404.svg`, import.meta.url).href;
		};
		return { getImgServerSrcURL };
	},
});
</script>

<style scoped>
.not-found {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.not-found-content {
	padding-left: 10vw;
	padding-right: 10vw;
	box-sizing: border-box;
	min-height: 50vh;
	background-color: #002e70;
	position: relative;
	width: 110%;
	height: 6vw;
	top: calc(-6vw);
	z-index: 1;
	color: white;
	display: flex;
}
.edge-top {
	width: 110%;
	position: relative;
	background-color: #002e70;
	height: 6vw;
	left: -5%;
	transform: rotateZ(-2deg);
	transform-origin: center bottom;
	top: calc(-4vw);
	z-index: -1;
}
.wrongUrlImage {
	max-width: 30em;
	max-height: 30em;
}
.btn {
	display: inline-block;
	font-weight: 400;
	color: #171717;
	text-align: center;
	text-decoration: none;
	vertical-align: middle;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	background-color: transparent;
	border: 1px solid transparent;
	border-top-color: transparent;
	border-right-color: transparent;
	border-bottom-color: transparent;
	border-left-color: transparent;
	padding: 13px 2.875rem;
	font-size: 1rem;
	line-height: 1.25rem;
	border-radius: 0.25rem;
	transition:
		color 0.15s ease-in-out,
		background-color 0.15s ease-in-out,
		border-color 0.15s ease-in-out,
		box-shadow 0.15s ease-in-out;
	margin: 2px;
}
.btn-light {
	color: #212529;
	background-color: #f2f4f8;
	border-color: #f2f4f8;
}
.btn-light:hover {
	color: #212529;
	background-color: #d9dfeb;
	border-color: #d1d8e6;
}
.imageContainer {
	display: flex;
	width: 500px;
}
.edge-bottom {
	width: 110%;
	position: relative;
	background-color: white;
	height: 6vw;
	left: -5%;
	transform: rotateZ(2deg);
	transform-origin: center bottom;
	top: calc(-4vw);
	z-index: 1;
}
</style>
