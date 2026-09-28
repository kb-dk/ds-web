<template>
	<div class="broadcast-record">
		<div class="video-container">
			<div>
				<VideoPlayer></VideoPlayer>
			</div>
		</div>

		<div class="extra-suggest">
			<h2>{{ t('error.wrongUrl.notAllowedButtonHeader') }}</h2>
			<div class="extra-suggest-buttons">
				<KBButton
					button-color="main"
					button-size="medium"
					button-type="btn-main-medium"
					:button-text="t('error.wrongUrl.frontPage')"
					href="/find-materiale/dr-arkivet/"
					:data-testid="addTestDataEnrichment('button', 'unavailable-record', 'link-to-home', 0)"
				></KBButton>
				<KBButton
					button-color="main"
					button-size="medium"
					button-type="btn-main-medium"
					:button-text="t('footer.column1.links.1.title')"
					:href="t('footer.column1.links.1.link')"
					:data-testid="addTestDataEnrichment('button', 'unavailable-record', 'link-to-about', 0)"
				></KBButton>
				<KBButton
					button-color="main"
					button-size="medium"
					button-type="btn-main-medium"
					:button-text="t('error.wrongUrl.kbPage')"
					href="https://www.kb.dk"
					:data-testid="addTestDataEnrichment('button', 'unavailable-record', 'link-to-kb', 0)"
				></KBButton>
			</div>

			<div class="container-backdrop"><ContainerSplitBar :is-top="false"></ContainerSplitBar></div>
			<div class="end-container">
				<ContactUs
					class="contact-us"
					:relative-position="false"
				></ContactUs>
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
import ContactUs from '@/components/search/ContactUs.vue';
import ContainerSplitBar from '@/components/global/content-elements/ContainerSplitBar.vue';
import KBButton from '@/components/common/KBButton.vue';

export default defineComponent({
	name: 'NotAllowedRecord',
	components: {
		VideoPlayer,
		ContactUs,
		ContainerSplitBar,
		KBButton,
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
.container-backdrop {
	position: absolute;
	left: 0;
	height: stretch;
	height: -webkit-fill-available;
	width: 100vw;
	background-color: var(--bg-default);
	justify-content: space-between;
	display: flex;
	flex-direction: column;
}
.end-container {
	display: flex;
	margin-top: 40px;
	position: relative;
	flex-direction: column;
}
:host {
	margin-top: -1px;
	position: relative;
}

.video-container {
	min-height: 300px;
	width: 100%;
	max-height: 50%;
}

.extra-suggest {
	padding-left: 12px;
	padding-right: 12px;
	color: var(--color-default);
}
.extra-suggest-buttons {
	display: flex;
	flex-direction: row;
	gap: 20px;
}
.extra-suggest > .contactus > div {
	margin-left: 0;
}
</style>
