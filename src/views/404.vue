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
						<div>
							<KBButton
								button-type="btn-main-inverted"
								class="btn-medium"
								href="/find-materiale/dr-arkivet/"
								:data-testid="addTestDataEnrichment('button', '404', 'link-to-home', 0)"
								:is-router-link="true"
								:button-text="t('error.wrongUrl.frontPage')"
							></KBButton>
						</div>

						<div>
							<KBButton
								button-type="btn-main-inverted"
								class="btn-medium"
								:href="t('footer.column1.links.1.link')"
								:data-testid="addTestDataEnrichment('button', '404', 'link-to-about', 0)"
								:is-router-link="true"
								:button-text="t('footer.column1.links.1.title')"
							></KBButton>
						</div>

						<div>
							<KBButton
								button-type="btn-main-inverted"
								class="btn-medium"
								href="https://www.kb.dk"
								:data-testid="addTestDataEnrichment('button', '404', 'link-to-kb', 0)"
								:is-router-link="true"
								:button-text="t('error.wrongUrl.kbPage')"
							></KBButton>
						</div>
					</div>
				</div>
			</div>
		</div>
		<ContactUs></ContactUs>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import ContactUs from '@/components/search/ContactUs.vue';
import KBButton from '@/components/common/KBButton.vue';

export default defineComponent({
	name: '404',
	components: { ContactUs, KBButton },
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
	justify-content: space-around;
}

.extra-suggest {
	display: block;
	padding-bottom: 40px;
}
.extra-suggest div {
	display: inline-block;
	margin-right: 10px;
	margin-bottom: 10px;
}
.not-found-container {
	box-sizing: border-box;
	background-color: #002e70;
	position: relative;
	top: calc(-6vw);
	z-index: 1;
	color: white;
	width: 100%;
	justify-content: space-around;
}
.not-found-details {
	display: flex;
	flex-direction: column;
	width: 100%;
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
	min-width: 400px;
	margin-top: 14px;
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
	.imageContainer {
		min-height: 20%;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.not-found-content {
		max-width: 990px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.not-found-content {
		justify-content: space-around;
		display: flex;
		max-width: 1150px;
		flex-direction: row;
		min-height: 40vh;
		padding-right: 12px;
		padding-left: 12px;
		margin-right: auto;
		margin-left: auto;
	}
	.wrongUrlImage {
		min-width: 500px;
	}
	.imageContainer {
		min-height: 100%;
	}
	.not-found-details {
		width: 42%;
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
