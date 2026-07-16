<template>
	<div class="unavailable-record">
		<div class="not-found-details">
			<h2>{{ t('record.noRecordFound') }}</h2>
			<p>{{ t('record.noRecordFoundExplained') }}</p>
			<h2>{{ t('error.wrongUrl.altHeader') }}</h2>
			<div class="extra-suggest">
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
		</div>
		<div class="container-backdrop"><ContainerSplitBar :is-top="false"></ContainerSplitBar></div>
		<div class="end-container">
			<SpotCategories></SpotCategories>
			<div class="contact-us">
				<ContactUs
					class="contact-us"
					:relative-position="false"
				></ContactUs>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import ContactUs from '@/components/search/ContactUs.vue';
import KBButton from '@/components/common/KBButton.vue';
import SpotCategories from '@/components/common/SpotCategories.vue';
import ContainerSplitBar from '@/components/global/content-elements/ContainerSplitBar.vue';

export default defineComponent({
	name: 'GenericRecord',
	components: {
		ContactUs,
		KBButton,
		SpotCategories,
		ContainerSplitBar,
	},
	setup() {
		const { t } = useI18n();
		return { t, addTestDataEnrichment };
	},
});
</script>
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
.unavailable-record {
	background-color: white;
}
.not-found-details {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding-bottom: 25px;
	color: var(--color-default);
}
.extra-suggest {
	display: flex;
	flex-direction: row;
	gap: 20px;
}
</style>
