<template>
	<div class="broadcast-record">
		<div class="video-container">
			<div>
				<VideoPlayer></VideoPlayer>
			</div>
		</div>

		<div class="extra-suggest">
			<h2>{{ t('error.wrongUrl.notAllowedButtonHeader') }}</h2>
			<a
				class="btn-blue btn"
				href="/find-materiale/dr-arkivet/"
				:data-testid="addTestDataEnrichment('button', 'unavailable-record', 'link-to-home', 0)"
			>
				{{ t('error.wrongUrl.frontPage') }}
			</a>
			<a
				class="btn-blue btn"
				:href="t('footer.column1.links.1.link')"
				:data-testid="addTestDataEnrichment('button', 'unavailable-record', 'link-to-about', 0)"
			>
				{{ t('footer.column1.links.1.title') }}
			</a>
			<a
				class="btn-blue btn"
				href="https://www.kb.dk"
				:data-testid="addTestDataEnrichment('button', 'unavailable-record', 'link-to-kb', 0)"
			>
				{{ t('error.wrongUrl.kbPage') }}
			</a>
			<div class="contactus">
				<ContactUs :relative-position="false" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import VideoPlayer from '@/components/viewers/AudioVideo/VideoPlayer.vue';
import { copyTextToClipboard } from '@/utils/copy-script';
import { getBroadcastDate, getBroadcastTime, getTimeFromISOFormat } from '@/utils/time-utils';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import ContactUs from '../search/ContactUs.vue';

export default defineComponent({
	name: 'NotAllowedRecord',
	components: {
		VideoPlayer,
		ContactUs,
	},
	props: {
		backLink: {
			type: String as PropType<string>,
			required: true,
		},
	},

	setup() {
		const lastPath = ref('');
		const { locale, t } = useI18n();

		const getCurrentUrl = () => {
			copyTextToClipboard();
		};

		const quotation = (name: string) => {
			return `"${name}"`;
		};

		return {
			lastPath,
			locale,
			t,
			getCurrentUrl,
			getBroadcastDate,
			getBroadcastTime,
			getTimeFromISOFormat,
			addTestDataEnrichment,
			quotation,
		};
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only
temporary styling until patterns from design system are implemented
-->
<style scoped>
:host {
	margin-top: -1px;
	position: relative;
}

.back-link {
	text-decoration: none;
	padding: 8px 14px 9px;
	margin-top: 2em;
}

.back-link a {
	text-decoration: none;
	padding: 8px 14px 9px;
	color: inherit;
}

.video-container {
	min-height: 300px;
	width: 100%;
	max-height: 50%;
}

.info {
	display: flex;
	align-items: center;
	gap: 7px;
}

.no-streaming {
	width: 100%;
	background-color: black;
	display: flex;
	height: 300px;
	color: white;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 10px;
	box-sizing: border-box;
}
.share-button {
	width: 100%;
	justify-content: center;
	display: flex;
}

.get-link {
	font-family: noway, sans-serif;
	background-color: transparent;
	border: 0px;
	cursor: pointer;
	padding-top: 0px;
	padding-left: 0px;
	padding-right: 0px;
	padding-bottom: 25px;
}

.get-link .link-text {
	text-decoration: underline;
}

.get-link .material-icons {
	position: relative;
	top: 3px;
	margin-right: 3px;
}

.material-icons.blue {
	color: #002e70;
}

.boardcast-record-data {
	display: flex;
	flex-direction: column;
	margin: 0px 20px;
}

.extra-record-data {
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin-bottom: 45px;
}

.accordion {
	margin: 0px 20px;
}

.accordion,
.main-record-data {
	flex: 0 0 100%;
	max-width: 100%;
}

.right-side {
	overflow: hidden;
	flex: 0 0 100%;
	max-width: 100%;
}

.right-side-metadata-box {
	color: #002e70;
	width: 100%;
	padding: 20px 10px 30px 10px;
	background-color: #f0fbff;
	box-sizing: border-box;
}

.related-record {
	margin-left: 20px;
}
.related-record:first-of-type {
	margin-left: 0px;
}

.title-box {
	margin: 0 0 0 5%;
}

.record-title {
	width: 60%;
	float: left;
	margin: 0 0 0 5%;
}

.broadcast-duration {
	font-size: 80%;
}

.divider {
	height: 13px;
	margin: 24px 0 36px;
	width: 100%;
	transform: skewX(-2deg) skewY(2deg);
	margin-top: -7px;
}

.extra-record-data {
	width: 100%;
}

.divider.darkblue {
	background-color: #002e70;
}

.offset {
	position: relative;
	top: 6px;
}

.related-content {
	padding: 0px 20px;
}

.related-record {
	flex: 0 0 90%;
	box-sizing: border-box;
}

.genre-link {
	color: #002e70;
	text-decoration: none;
}

.link-container {
	background-color: #0a2e70;
	width: 33.3%;
	color: white;
	text-align: center;
	text-decoration: none;
	font-size: 18px;
	border-radius: 4px;
	height: 40px;
	display: flex;
	box-sizing: border-box;
	margin-bottom: 15px;
	padding: 5px 25px;
	font-family: 'noway';
	font-weight: 100;
	flex-direction: row;
	justify-content: center;
}
.link {
	position: relative;
	top: 2px;
}
.link-container a {
	white-space: nowrap;
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
	padding: 13px 2.875rem;
	font-size: 18px;
	line-height: 1.25rem;
	border-radius: 4px;
	transition:
		color 0.15s ease-in-out,
		background-color 0.15s ease-in-out,
		border-color 0.15s ease-in-out,
		box-shadow 0.15s ease-in-out;
	margin-right: 15px;
	margin-bottom: 15px;
	white-space: nowrap;
	border: 1px solid #0a2e70;
}
.btn-blue {
	color: white;
	background-color: #002e70;
}
.btn:hover {
	background: #c4f1ed;
	color: #0a2e70;
}
.extra-suggest {
	padding-left: 12px;
	padding-right: 12px;
}
.extra-suggest > .contactus > div {
	margin-left: 0;
}
/* First breakpoint for tablet */

@media (min-width: 640px) {
	.extra-suggest {
		padding-left: 0px;
		padding-right: 0px;
	}
	.boardcast-record-data {
		flex-direction: row;
		margin-left: 0px;
		margin-right: 0px;
		gap: 20px;
		margin-top: 40px;
	}
	.main-record-data {
		flex: 0 0 calc(50% - 20px);
		max-width: calc(50% - 20px);
	}

	.accordion {
		margin-left: 0px;
		margin-right: 0px;
		flex: 0 0 calc(100%);
	}

	.right-side {
		flex: 0 0 50%;
		max-width: 50%;
	}
	.related-record {
		flex: 0 0 66.6666%;
	}
	.related-content {
		padding: 0px;
	}
	.extra-record-data {
		flex: 0 0 calc(100%);
		max-width: calc(100%);
	}
	.share-button {
		justify-content: flex-end;
	}
	.get-link {
		width: 50%;
	}
	.share-icon {
		margin-right: 5px;
	}
}

/* Second break for small screen */
@media (min-width: 800px) {
	.boardcast-record-data {
		flex-direction: row;
		margin-left: 0px;
		margin-right: 0px;
		gap: 20px;
	}
	.extra-record-data {
		flex: 0 0 calc(100%);
		max-width: calc(100%);
	}
	.main-record-data {
		flex: 0 0 calc(66.666666% - 20px);
		max-width: calc(66.666666% - 20px);
	}

	.right-side {
		flex: 0 0 33.33333%;
		max-width: 33.33333%;
	}
	.related-record {
		margin: 0px;
		flex: 0 0 33.3333%;
		box-sizing: border-box;
	}
	.related-record:nth-of-type(3n + 1) {
		padding-left: 0px;
		padding-right: 10px;
	}
	.related-record:nth-of-type(3n + 2) {
		padding-left: 5px;
		padding-right: 5px;
	}
	.related-record:nth-of-type(3n) {
		padding-right: 0px;
		padding-left: 10px;
	}
}

/* third break for large screen */
@media (min-width: 990px) {
	.boardcast-record-data {
		flex-direction: row;
		margin-left: 0px;
		margin-right: 0px;
		gap: 20px;
	}
	.main-record-data,
	.related-content,
	.accordion {
		flex: 0 0 calc(75% - 20px);
		max-width: calc(75% - 20px);
	}

	.right-side {
		flex: 0 0 25%;
		max-width: 25%;
	}
}

@media (min-width: 1200px) {
	.contactus {
		margin-bottom: -6vh;
	}
}
</style>
