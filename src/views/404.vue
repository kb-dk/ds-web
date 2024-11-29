<template>
	<div class="not-found">
		<div class="edge-top"></div>
		<div class="not-found-container">
			<div class="not-found-content">
				<div class="imageContainer">
					<img
						class="wrongUrlImage"
						title="KB 404"
						alt="Image of KB 404 status"
						:src="getImgServerSrcURL()"
					/>
				</div>
				<div class="not-found-details">
					<h1>{{ t('error.wrongUrl.header') }}</h1>
					<p>{{ t('error.wrongUrl.text') }}</p>
					<h2>{{ t('error.wrongUrl.altHeader') }}</h2>
					<div class="extra-suggest">
						<a
							class="btn-light btn"
							href="/find-materiale/dr-arkivet/"
							role="button"
							:data-testid="addTestDataEnrichment('button', '404', 'link-to-home', 0)"
						>
							{{ t('error.wrongUrl.frontPage') }}
						</a>
						<a
							class="btn-light btn"
							href="https://www.kb.dk"
							role="button"
							:data-testid="addTestDataEnrichment('button', '404', 'link-to-kb', 0)"
						>
							{{ t('error.wrongUrl.kbPage') }}
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: '404',
	setup() {
		const { t } = useI18n();
		const getImgServerSrcURL = () => {
			return new URL(`@/assets/images/404.svg`, import.meta.url).href;
		};
		return { getImgServerSrcURL, t };
	},
	methods: { addTestDataEnrichment },
});
</script>

<style scoped>
.not-found {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.not-found-content {
	align-items: center;
	padding: 0px 12px;
}

.extra-suggest {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	padding-bottom: 40px;
}

.not-found-container {
	box-sizing: border-box;
	background-color: #002e70;
	position: relative;
	top: calc(-6vw);
	z-index: 1;
	color: white;
	width: 100%;
}
.not-found-details {
	display: flex;
	flex-direction: column;
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
	max-width: 400px;
	margin-top: 14px;
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
	flex-direction: column;
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
/* MEDIA QUERY 450 */
@media (min-width: 450px) {
	.not-found-content {
		display: flex;
		flex-direction: column;
		max-width: 640px;
		margin-bottom: 40px;
	}
	.wrongUrlImage {
		min-width: 400px;
	}
	.imageContainer {
		min-height: 20%;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.not-found-content {
		max-width: 990px;
	}
	.extra-suggest {
		flex-direction: row;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.not-found-content {
		justify-content: space-between;
		display: flex;
		max-width: 1150px;
		flex-direction: row;
		min-height: 40vh;
		padding-right: 12px;
		padding-left: 12px;
		margin-right: auto;
		margin-left: auto;
	}
	.imageContainer {
		min-height: 100%;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.not-found-content {
		max-width: 100%;
		padding-right: 12px;
		padding-left: 12px;
		margin-right: auto;
		margin-left: auto;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.not-found-content {
		max-width: 1280px;
		padding-right: 12px;
		padding-left: 12px;
		margin-right: auto;
		margin-left: auto;
	}
}
</style>
